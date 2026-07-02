"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Globe,
  Palette,
  FileText,
  Users,
  Mic2,
  Image as ImageIcon,
  BarChart3,
  BookOpen,
  ListTree,
  Link2,
  Loader2,
  CheckCircle2,
} from "lucide-react";

type GenerationStep =
  | "idle"
  | "indice"
  | "capitulos"
  | "imagens"
  | "graficos"
  | "conclusao"
  | "diagramando"
  | "pronto";

const stepLabels: Record<Exclude<GenerationStep, "idle">, string> = {
  indice: "Criando índice",
  capitulos: "Escrevendo capítulos e subtítulos",
  imagens: "Gerando imagens e capa",
  graficos: "Criando tabelas e gráficos",
  conclusao: "Redigindo conclusão, FAQ e CTA",
  diagramando: "Diagramando o PDF",
  pronto: "eBook pronto",
};

const stepOrder: Exclude<GenerationStep, "idle">[] = [
  "indice",
  "capitulos",
  "imagens",
  "graficos",
  "conclusao",
  "diagramando",
  "pronto",
];

interface EbookOptions {
  idioma: string;
  tema: string;
  paginas: number;
  publico: string;
  tom: string;
  estilo: string;
  imagens: boolean;
  graficos: boolean;
  capa: boolean;
  indice: boolean;
  referencias: boolean;
}

export default function EditorPage() {
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState<EbookOptions>({
    idioma: "Português (BR)",
    tema: "Negócios",
    paginas: 40,
    publico: "Iniciantes",
    tom: "Profissional",
    estilo: "Didático",
    imagens: true,
    graficos: true,
    capa: true,
    indice: true,
    referencias: false,
  });
  const [step, setStep] = useState<GenerationStep>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (prompt.trim().length < 10) {
      setError("Descreva sua ideia com um pouco mais de detalhe (mín. 10 caracteres).");
      return;
    }
    setError(null);

    // Chama a API real de geração (app/api/generate/route.ts).
    // A UI avança visualmente pelas etapas enquanto o backend processa
    // cada fase do eBook (índice → capítulos → imagens → gráficos → PDF).
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, options }),
      });

      if (!res.ok) throw new Error("Falha ao gerar o eBook. Tente novamente.");

      // Simula o avanço de etapas em paralelo ao streaming do backend.
      for (const s of stepOrder) {
        setStep(s);
        await new Promise((r) => setTimeout(r, 900));
      }

      const data = await res.json();
      // data.pdfUrl deve apontar para o PDF gerado, pronto para download
      console.log("eBook gerado:", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setStep("idle");
    }
  }

  const isGenerating = step !== "idle" && step !== "pronto";

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ivory-100">Novo eBook</h1>
      <p className="mt-2 text-ivory-500">
        Descreva sua ideia. A IA cuida da estrutura, do texto e da diagramação.
      </p>

      {/* Campo gigante de prompt */}
      <div className="card mt-8 p-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Um eBook completo sobre como iniciar no investimento em ações, para leitores sem experiência financeira, com exemplos práticos e linguagem acessível..."
          rows={8}
          className="w-full resize-none rounded-xl bg-transparent p-6 font-display text-lg leading-relaxed text-ivory-100 placeholder:text-ivory-500/60 focus:outline-none"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {/* Opções de geração */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectOption
          icon={Globe}
          label="Idioma"
          value={options.idioma}
          options={["Português (BR)", "Inglês", "Espanhol"]}
          onChange={(v) => setOptions({ ...options, idioma: v })}
        />
        <SelectOption
          icon={Palette}
          label="Tema visual"
          value={options.tema}
          options={["Negócios", "Minimalista", "Criativo", "Acadêmico"]}
          onChange={(v) => setOptions({ ...options, tema: v })}
        />
        <SelectOption
          icon={FileText}
          label="Número de páginas"
          value={String(options.paginas)}
          options={["20", "40", "60", "100"]}
          onChange={(v) => setOptions({ ...options, paginas: Number(v) })}
        />
        <SelectOption
          icon={Users}
          label="Público-alvo"
          value={options.publico}
          options={["Iniciantes", "Intermediário", "Especialistas"]}
          onChange={(v) => setOptions({ ...options, publico: v })}
        />
        <SelectOption
          icon={Mic2}
          label="Tom da escrita"
          value={options.tom}
          options={["Profissional", "Casual", "Inspirador", "Técnico"]}
          onChange={(v) => setOptions({ ...options, tom: v })}
        />
        <SelectOption
          icon={BookOpen}
          label="Estilo"
          value={options.estilo}
          options={["Didático", "Narrativo", "Guia prático", "Analítico"]}
          onChange={(v) => setOptions({ ...options, estilo: v })}
        />
      </div>

      {/* Toggles */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <ToggleOption icon={ImageIcon} label="Adicionar imagens" checked={options.imagens} onChange={(v) => setOptions({ ...options, imagens: v })} />
        <ToggleOption icon={BarChart3} label="Adicionar gráficos" checked={options.graficos} onChange={(v) => setOptions({ ...options, graficos: v })} />
        <ToggleOption icon={BookOpen} label="Criar capa" checked={options.capa} onChange={(v) => setOptions({ ...options, capa: v })} />
        <ToggleOption icon={ListTree} label="Criar índice" checked={options.indice} onChange={(v) => setOptions({ ...options, indice: v })} />
        <ToggleOption icon={Link2} label="Criar referências" checked={options.referencias} onChange={(v) => setOptions({ ...options, referencias: v })} />
      </div>

      {/* Botão gerar */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="btn-gold mt-10 w-full gap-2 py-4 text-base disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGenerating ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Sparkles className="h-5 w-5" />
        )}
        {isGenerating ? stepLabels[step as Exclude<GenerationStep, "idle">] : "Gerar eBook"}
      </button>

      {/* Progresso das etapas da IA */}
      <AnimatePresence>
        {step !== "idle" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3 overflow-hidden"
          >
            {stepOrder.map((s) => {
              const currentIndex = stepOrder.indexOf(step as Exclude<GenerationStep, "idle">);
              const thisIndex = stepOrder.indexOf(s);
              const done = thisIndex < currentIndex || step === "pronto";
              const active = s === step;
              return (
                <div key={s} className="flex items-center gap-3 text-sm">
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 text-gold-500" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gold-400" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-ivory-500/30" />
                  )}
                  <span className={done || active ? "text-ivory-100" : "text-ivory-500"}>
                    {stepLabels[s]}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectOption({
  icon: Icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="card flex items-center gap-3 px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-gold-500" />
      <div className="flex-1">
        <span className="block font-mono text-[10px] uppercase tracking-widest text-ivory-500">
          {label}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-ivory-100 focus:outline-none"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-ink-900">
              {o}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function ToggleOption({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`card flex items-center gap-2 px-3 py-3 text-left text-xs transition-colors ${
        checked ? "border-gold-500/60 text-gold-300" : "text-ivory-500"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </button>
  );
}
