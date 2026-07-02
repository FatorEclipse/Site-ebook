"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpenText,
  Sparkles,
  Image as ImageIcon,
  BarChart3,
  FileDown,
  Wand2,
  ArrowRight,
  Check,
} from "lucide-react";

// Signature element: um índice que se "auto-escreve", linha por linha,
// como se a IA estivesse redigindo o sumário do livro em tempo real.
const tocLines = [
  "Capítulo 1 — Introdução",
  "Capítulo 2 — Fundamentos",
  "Capítulo 3 — Estratégia",
  "Capítulo 4 — Aplicação prática",
  "Capítulo 5 — Estudos de caso",
  "Conclusão & Próximos passos",
];

function SelfWritingIndex() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= tocLines.length) return;
    const timeout = setTimeout(() => setVisibleLines((v) => v + 1), 550);
    return () => clearTimeout(timeout);
  }, [visibleLines]);

  return (
    <div className="card w-full max-w-md p-8">
      <div className="mb-6 flex items-center justify-between border-b border-ivory-500/10 pb-4">
        <span className="font-mono text-xs uppercase tracking-widest text-gold-400">
          Índice gerado
        </span>
        <Sparkles className="h-4 w-4 text-gold-500" />
      </div>
      <ul className="space-y-3 font-display text-lg text-ivory-100">
        {tocLines.map((line, i) => (
          <li
            key={line}
            className={`overflow-hidden whitespace-nowrap border-r-2 border-gold-500/0 ${
              i < visibleLines ? "border-gold-500/70" : ""
            }`}
            style={{
              width: i < visibleLines ? "100%" : "0%",
              transition: "width 0.6s steps(30,end)",
            }}
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

const benefits = [
  {
    icon: Wand2,
    title: "Do prompt ao livro pronto",
    text: "Descreva o tema em uma frase. A IA estrutura capítulos, subtítulos, conclusão e FAQ sozinha.",
  },
  {
    icon: ImageIcon,
    title: "Imagens e capa geradas",
    text: "Capa moderna e ilustrações do conteúdo criadas automaticamente, no estilo do seu livro.",
  },
  {
    icon: BarChart3,
    title: "Gráficos e tabelas",
    text: "Dados viram gráficos e tabelas diagramados, prontos para embasar seus argumentos.",
  },
  {
    icon: FileDown,
    title: "PDF de qualidade editorial",
    text: "Margens, tipografia, cabeçalho, rodapé e numeração — como um livro de editora de verdade.",
  },
];

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/sempre",
    description: "Para testar a criação com IA.",
    features: ["1 eBook por mês", "Até 15 páginas", "Marca d'água BookForge", "Exportação em PDF"],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 49",
    period: "/mês",
    description: "Para criadores e infoprodutores.",
    features: [
      "10 eBooks por mês",
      "Até 120 páginas",
      "Sem marca d'água",
      "Imagens e gráficos com IA",
      "Exportação em PDF e DOCX",
    ],
    cta: "Assinar Pro",
    highlighted: true,
  },
  {
    name: "Business",
    price: "R$ 149",
    period: "/mês",
    description: "Para times e agências.",
    features: [
      "eBooks ilimitados",
      "Páginas ilimitadas",
      "Exportação PDF, DOCX e EPUB",
      "Geração de página de vendas e anúncios",
      "Suporte prioritário",
    ],
    cta: "Assinar Business",
    highlighted: false,
  },
];

export default function HomePage() {
  const [testPrompt, setTestPrompt] = useState("");

  return (
    <main className="relative overflow-hidden bg-ink-radial">
      {/* JSON-LD Schema.org para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "BookForge AI",
            applicationCategory: "BusinessApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
          }),
        }}
      />

      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-ivory-500/10 bg-ink-950/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpenText className="h-6 w-6 text-gold-500" />
            <span className="font-display text-lg font-semibold">BookForge AI</span>
          </div>
          <div className="hidden items-center gap-8 font-sans text-sm text-ivory-300 md:flex">
            <a href="#beneficios" className="hover:text-gold-300">Benefícios</a>
            <a href="#planos" className="hover:text-gold-300">Planos</a>
            <a href="/login" className="hover:text-gold-300">Entrar</a>
          </div>
          <a href="/cadastro" className="btn-gold text-sm">Começar grátis</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 pb-24 pt-20 md:flex-row md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <span className="mb-4 inline-block rounded-full border border-gold-500/30 px-3 py-1 font-mono text-xs uppercase tracking-widest text-gold-400">
            Editor de eBooks com IA
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight text-ivory-100 md:text-6xl">
            Crie eBooks profissionais usando{" "}
            <span className="italic text-gold-400">Inteligência Artificial</span>.
          </h1>
          <p className="mt-6 text-lg text-ivory-500">
            Escreva um prompt. Em minutos, o BookForge AI entrega um eBook completo:
            capítulos, capa, índice, imagens, gráficos e um PDF pronto para publicar.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/cadastro" className="btn-gold gap-2">
              Começar grátis <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#teste" className="btn-outline">Testar um prompt</a>
          </div>

          {/* Campo para testar um prompt */}
          <div id="teste" className="card mt-10 p-4">
            <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-gold-400">
              Teste rápido
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Ex: eBook sobre finanças pessoais para iniciantes"
                className="flex-1 rounded-lg border border-ivory-500/20 bg-ink-900 px-4 py-3 text-sm text-ivory-100 placeholder:text-ivory-500 focus:border-gold-500"
              />
              <a
                href={`/cadastro?prompt=${encodeURIComponent(testPrompt)}`}
                className="btn-gold whitespace-nowrap text-sm"
              >
                Gerar prévia
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex w-full justify-center"
        >
          <SelfWritingIndex />
        </motion.div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-12 text-center font-display text-3xl font-semibold md:text-4xl">
          Tudo que um eBook profissional precisa
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-6"
            >
              <b.icon className="h-6 w-6 text-gold-500" />
              <h3 className="mt-4 font-display text-lg font-medium">{b.title}</h3>
              <p className="mt-2 text-sm text-ivory-500">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-4 text-center font-display text-3xl font-semibold md:text-4xl">
          Planos para cada fase da sua ideia
        </h2>
        <p className="mb-12 text-center text-ivory-500">Cancele quando quiser. Sem letras miúdas.</p>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card flex flex-col p-8 ${
                plan.highlighted ? "border-gold-500 shadow-gold" : ""
              }`}
            >
              {plan.highlighted && (
                <span className="mb-4 w-fit rounded-full bg-gold-gradient px-3 py-1 font-mono text-xs text-ink-950">
                  Mais popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-ivory-500">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-gold-300">{plan.price}</span>
                <span className="text-sm text-ivory-500">{plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ivory-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/cadastro"
                className={`mt-8 ${plan.highlighted ? "btn-gold" : "btn-outline"}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-ivory-500/10 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <BookOpenText className="h-5 w-5 text-gold-500" />
            <span className="font-display font-medium">BookForge AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-ivory-500">
            <a href="/termos" className="hover:text-gold-300">Termos de uso</a>
            <a href="/privacidade" className="hover:text-gold-300">Privacidade</a>
            <a href="/contato" className="hover:text-gold-300">Contato</a>
          </div>
          <span className="text-sm text-ivory-500">© {new Date().getFullYear()} BookForge AI</span>
        </div>
      </footer>
    </main>
  );
}
