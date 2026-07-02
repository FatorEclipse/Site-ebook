import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const project = await prisma.ebookProject.findUnique({ where: { id: params.id } });

  // Garante que o usuário só pode excluir os próprios projetos (IDOR protection)
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }

  await prisma.ebookProject.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
