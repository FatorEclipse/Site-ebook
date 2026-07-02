"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Upload, Save } from "lucide-react";
import Providers from "@/components/Providers";

function ProfileForm() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    await update({ name });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ivory-100">Perfil</h1>
      <p className="mt-1 text-ivory-500">Suas informações pessoais e marca (logo usada nos eBooks).</p>

      <div className="card mt-8 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient font-display text-2xl text-ink-950">
            {name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <label className="btn-outline cursor-pointer gap-2 text-sm">
            <Upload className="h-4 w-4" />
            Enviar logo
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-ivory-500">
              Nome
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-ivory-500/20 bg-ink-900 px-4 py-3 text-sm text-ivory-100 focus:border-gold-500"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-ivory-500">
              Email
            </label>
            <input
              value={session?.user?.email ?? ""}
              disabled
              className="w-full rounded-lg border border-ivory-500/10 bg-ink-900/50 px-4 py-3 text-sm text-ivory-500"
            />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-gold mt-6 gap-2 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar alterações
        </button>
        {saved && <p className="mt-2 text-sm text-gold-400">Perfil atualizado.</p>}
      </div>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <Providers>
      <ProfileForm />
    </Providers>
  );
}
