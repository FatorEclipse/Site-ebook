"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import AuthShell from "@/components/AuthShell";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/recuperar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true); // sempre mostra sucesso, mesmo se o email não existir (evita enumeração)
  }

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Enviaremos um link para você criar uma nova senha."
      footer={
        <Link href="/login" className="text-gold-400 hover:underline">
          Voltar para o login
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-gold-500" />
          <p className="text-sm text-ivory-300">
            Se <strong>{email}</strong> estiver cadastrado, você receberá um link de recuperação em
            instantes. Confira também sua caixa de spam.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <button type="submit" disabled={loading} className="btn-gold gap-2 disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Enviar link de recuperação
          </button>
        </form>
      )}
    </AuthShell>
  );
}
