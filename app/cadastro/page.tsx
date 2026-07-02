"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, User } from "lucide-react";
import AuthShell from "@/components/AuthShell";

export default function CadastroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível criar sua conta.");
        setLoading(false);
        return;
      }

      // Login automático após o cadastro
      await signIn("credentials", { email, password, redirect: false });
      router.push(
        initialPrompt ? `/dashboard/editor?prompt=${encodeURIComponent(initialPrompt)}` : "/dashboard"
      );
    } catch {
      setError("Erro inesperado. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Criar conta grátis"
      subtitle="3 créditos inclusos para gerar seus primeiros eBooks."
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/login" className="text-gold-400 hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="btn-outline gap-2"
        >
          Continuar com Google
        </button>
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="btn-outline gap-2"
        >
          Continuar com GitHub
        </button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ivory-500/15" />
        <span className="text-xs uppercase tracking-widest text-ivory-500">ou</span>
        <div className="h-px flex-1 bg-ivory-500/15" />
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-500" />
          <input
            required
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-ivory-500/20 bg-ink-900 py-3 pl-11 pr-4 text-sm text-ivory-100 placeholder:text-ivory-500 focus:border-gold-500"
          />
        </div>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-500" />
          <input
            type="email"
            required
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-ivory-500/20 bg-ink-900 py-3 pl-11 pr-4 text-sm text-ivory-100 placeholder:text-ivory-500 focus:border-gold-500"
          />
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-500" />
          <input
            type="password"
            required
            placeholder="Senha (mín. 8 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-ivory-500/20 bg-ink-900 py-3 pl-11 pr-4 text-sm text-ivory-100 placeholder:text-ivory-500 focus:border-gold-500"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn-gold gap-2 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Criar conta grátis
        </button>

        <p className="text-center text-xs text-ivory-500">
          Ao continuar, você concorda com os{" "}
          <Link href="/termos" className="hover:text-gold-300">Termos de uso</Link> e a{" "}
          <Link href="/privacidade" className="hover:text-gold-300">Política de privacidade</Link>.
        </p>
      </form>
    </AuthShell>
  );
}
