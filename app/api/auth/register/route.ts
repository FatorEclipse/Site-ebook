import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ratelimit } from "@/lib/ratelimit";

const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(80),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "A senha precisa ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula")
    .regex(/[0-9]/, "Inclua ao menos um número"),
});

export async function POST(req: NextRequest) {
  // Rate limit por IP para evitar criação em massa de contas (bot abuse)
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await ratelimit.limit(`register:${ip}`);
  if (!success) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um momento." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Este email já está cadastrado." }, { status: 409 });
  }

  // Hash com salt — nunca armazenar senha em texto puro
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, credits: 3, plan: "FREE" },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}
