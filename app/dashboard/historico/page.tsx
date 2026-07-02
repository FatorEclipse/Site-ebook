import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, XCircle, Loader2, FileDown } from "lucide-react";

const statusConfig = {
  COMPLETED: { icon: CheckCircle2, color: "text-gold-500", label: "Concluído" },
  GENERATING: { icon: Loader2, color: "text-ivory-500 animate-spin", label: "Gerando" },
  FAILED: { icon: XCircle, color: "text-red-400", label: "Falhou" },
} as const;

export default async function HistoricoPage() {
  const session = await getServerSession(authOptions);
  const projects = await prisma.ebookProject.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ivory-100">Histórico</h1>
      <p className="mt-1 text-ivory-500">Todas as gerações de eBooks, incluindo tentativas com falha.</p>

      <div className="mt-8 space-y-3">
        {projects.map((p) => {
          const config = statusConfig[p.status];
          return (
            <div key={p.id} className="card flex items-center gap-4 p-4">
              <config.icon className={`h-5 w-5 shrink-0 ${config.color}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ivory-100">{p.title ?? p.prompt.slice(0, 80)}</p>
                <p className="text-xs text-ivory-500">
                  {p.createdAt.toLocaleString("pt-BR")} · {config.label}
                </p>
              </div>
              {p.pdfUrl && (
                <a
                  href={p.pdfUrl}
                  download
                  className="rounded-lg border border-ivory-500/20 p-2 text-ivory-300 hover:border-gold-500 hover:text-gold-300"
                >
                  <FileDown className="h-4 w-4" />
                </a>
              )}
            </div>
          );
        })}

        {projects.length === 0 && (
          <p className="py-12 text-center text-ivory-500">Nenhuma atividade registrada ainda.</p>
        )}
      </div>
    </div>
  );
}
