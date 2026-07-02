"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Copy, Trash2, Pencil, Clock, Loader2 } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  status: "GENERATING" | "COMPLETED" | "FAILED";
  coverUrl: string | null;
  pdfUrl: string | null;
  createdAt: string;
}

const statusLabel: Record<ProjectCardProps["status"], string> = {
  GENERATING: "Gerando...",
  COMPLETED: "Concluído",
  FAILED: "Falhou",
};

export default function ProjectCard({ id, title, status, coverUrl, pdfUrl, createdAt }: ProjectCardProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<"duplicate" | "delete" | null>(null);

  async function handleDuplicate() {
    setBusy("duplicate");
    await fetch(`/api/projects/${id}/duplicate`, { method: "POST" });
    router.refresh();
    setBusy(null);
  }

  async function handleDelete() {
    if (!confirm("Excluir este eBook permanentemente?")) return;
    setBusy("delete");
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.refresh();
    setBusy(null);
  }

  return (
    <div className="card group overflow-hidden">
      <div className="relative aspect-[3/4] bg-ink-800">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            {status === "GENERATING" ? (
              <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
            ) : (
              <span className="font-display text-ivory-500">Sem capa</span>
            )}
          </div>
        )}
        <span className="absolute right-2 top-2 rounded-full bg-ink-950/80 px-2 py-1 text-[10px] uppercase tracking-widest text-gold-300">
          {statusLabel[status]}
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 font-display text-base text-ivory-100">{title}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-ivory-500">
          <Clock className="h-3 w-3" />
          {new Date(createdAt).toLocaleDateString("pt-BR")}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <a
            href={pdfUrl ?? undefined}
            download
            aria-disabled={!pdfUrl}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg border border-ivory-500/20 py-2 text-xs text-ivory-300 hover:border-gold-500 hover:text-gold-300 ${
              !pdfUrl ? "pointer-events-none opacity-40" : ""
            }`}
          >
            <Download className="h-3.5 w-3.5" /> Baixar
          </a>
          <button
            onClick={() => router.push(`/dashboard/editor?edit=${id}`)}
            className="rounded-lg border border-ivory-500/20 p-2 text-ivory-300 hover:border-gold-500 hover:text-gold-300"
            aria-label="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleDuplicate}
            disabled={busy === "duplicate"}
            className="rounded-lg border border-ivory-500/20 p-2 text-ivory-300 hover:border-gold-500 hover:text-gold-300"
            aria-label="Duplicar"
          >
            {busy === "duplicate" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={busy === "delete"}
            className="rounded-lg border border-ivory-500/20 p-2 text-ivory-300 hover:border-red-400 hover:text-red-400"
            aria-label="Excluir"
          >
            {busy === "delete" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
