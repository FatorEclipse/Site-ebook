import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const original = await prisma.ebookProject.findUnique({ where: { id: params.id } });
  if (!original || original.userId !== session.user.id) {
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }

  // Duplica os metadados e o conteúdo já gerado (PDF/capa), sem gastar créditos de IA novamente
  const copy = await prisma.ebookProject.create({
    data: {
      userId: session.user.id,
      prompt: original.prompt,
      title: original.title ? `${original.title} (cópia)` : null,
      status: original.status,
      options: original.options as any,
      pdfUrl: original.pdfUrl,
      coverUrl: original.coverUrl,
      docxUrl: original.docxUrl,
      epubUrl: original.epubUrl,
    },
  });

  return NextResponse.json({ id: copy.id });
}
