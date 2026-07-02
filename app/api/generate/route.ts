import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateEbookContent, generateCoverImage } from "@/lib/openai";
import { renderEbookToPdfBuffer } from "@/lib/pdf-generator";
import { ratelimit } from "@/lib/ratelimit";
import { put } from "@/lib/storage";

// Validação de entrada (proteção contra payloads malformados / injeção)
const requestSchema = z.object({
  prompt: z.string().min(10).max(2000),
  options: z.object({
    idioma: z.string(),
    tema: z.string(),
    paginas: z.number().min(5).max(300),
    publico: z.string(),
    tom: z.string(),
    estilo: z.string(),
    imagens: z.boolean(),
    graficos: z.boolean(),
    capa: z.boolean(),
    indice: z.boolean(),
    referencias: z.boolean(),
  }),
});

export async function POST(req: NextRequest) {
  // 1. Autenticação
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  // 2. Rate limit por usuário (proteção contra abuso e custo descontrolado de IA)
  const { success } = await ratelimit.limit(session.user.id);
  if (!success) {
    return NextResponse.json(
      { error: "Muitas gerações em pouco tempo. Aguarde um momento." },
      { status: 429 }
    );
  }

  // 3. Validação do payload
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }
  const { prompt, options } = parsed.data;

  // 4. Checagem de créditos do usuário
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.credits <= 0) {
    return NextResponse.json(
      { error: "Créditos insuficientes. Faça upgrade do seu plano." },
      { status: 402 }
    );
  }

  try {
    // 5. Cria o registro do projeto em estado "gerando"
    const project = await prisma.ebookProject.create({
      data: {
        userId: user.id,
        prompt,
        status: "GENERATING",
        options: options as any,
      },
    });

    // 6. Geração do conteúdo estruturado (índice, capítulos, subtítulos, conclusão, FAQ, CTA)
    const content = await generateEbookContent(prompt, options);

    // 7. Geração da capa (se solicitada)
    const coverUrl = options.capa ? await generateCoverImage(content.titulo, options.tema) : undefined;

    // 8. Diagramação e renderização do PDF profissional
    const pdfBuffer = await renderEbookToPdfBuffer(content, coverUrl);

    // 9. Upload do PDF para storage (S3/R2) e persistência da URL final
    const pdfUrl = await put(`ebooks/${project.id}.pdf`, pdfBuffer, "application/pdf");

    const updated = await prisma.ebookProject.update({
      where: { id: project.id },
      data: {
        status: "COMPLETED",
        title: content.titulo,
        pdfUrl,
        coverUrl,
      },
    });

    // 10. Debita 1 crédito do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } },
    });

    return NextResponse.json({
      id: updated.id,
      title: updated.title,
      pdfUrl: updated.pdfUrl,
      coverUrl: updated.coverUrl,
    });
  } catch (error) {
    console.error("Erro na geração do eBook:", error);
    return NextResponse.json({ error: "Falha ao gerar o eBook. Tente novamente." }, { status: 500 });
  }
}
