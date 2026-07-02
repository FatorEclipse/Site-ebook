"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock } from "lucide-react";
import AuthShell from "@/components/AuthShell";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.9 3.2 14.7 2.2 12 2.2 6.9 2.2 2.7 6.4 2.7 11.5S6.9 20.8 12 20.8c6.9 0 9.3-4.8 9.3-7.3 0-.5-.1-.9-.1-1.3H12z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5v-1.75c-2.78.62-3.37-1.36-3.37-1.36-.46-1.2-1.11-1.52-1.11-1.52-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .28.18.61.69.5A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", { email, password, redirect: false });

    setLoading(false);
    if (res?.error) {
      setError("Email ou senha incorretos.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <AuthShell
      title="Entrar"
      subtitle="Acesse sua conta para continuar criando eBooks."
      footer={
        <>
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-gold-400 hover:underline">
            Criar conta grátis
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="btn-outline gap-2"
        >
          <GoogleIcon /> Continuar com Google
        </button>
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="btn-outline gap-2"
        >
          <GitHubIcon /> Continuar com GitHub
        </button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ivory-500/15" />
        <span className="text-xs uppercase tracking-widest text-ivory-500">ou</span>
        <div className="h-px flex-1 bg-ivory-500/15" />
      </div>

      <form onSubmit={handleCredentialsLogin} className="flex flex-col gap-4">
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
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-ivory-500/20 bg-ink-900 py-3 pl-11 pr-4 text-sm text-ivory-100 placeholder:text-ivory-500 focus:border-gold-500"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end">
          <Link href="/recuperar-senha" className="text-xs text-ivory-500 hover:text-gold-300">
            Esqueceu sua senha?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="btn-gold gap-2 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Entrar
        </button>
      </form>
    </AuthShell>
  );
}
