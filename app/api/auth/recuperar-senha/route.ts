import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { ratelimit } from "@/lib/ratelimit";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await ratelimit.limit(`reset:${ip}`);
  if (!success) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um momento." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }
  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  // Resposta idêntica exista ou não o usuário — evita enumeração de emails cadastrados
  if (user) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/redefinir-senha?token=${token}`;
    await sendPasswordResetEmail(email, resetUrl);
  }

  return NextResponse.json({
    message: "Se este email estiver cadastrado, você receberá um link de recuperação.",
  });
}
