"use client";

import { useState } from "react";
import { Trash2, Bell, Moon } from "lucide-react";

export default function ConfiguracoesPage() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifGeracao, setNotifGeracao] = useState(true);
  const [darkMode] = useState(true); // BookForge AI é dark-first por padrão de marca

  async function handleDeleteAccount() {
    if (!confirm("Isso excluirá sua conta e todos os eBooks permanentemente. Continuar?")) return;
    if (!confirm("Tem certeza absoluta? Essa ação não pode ser desfeita.")) return;
    await fetch("/api/user/profile", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ivory-100">Configurações</h1>
      <p className="mt-1 text-ivory-500">Preferências da sua conta.</p>

      <div className="card mt-8 divide-y divide-ivory-500/10 p-2">
        <SettingRow
          icon={Bell}
          title="Notificações por email"
          description="Receba um email quando um eBook terminar de ser gerado."
          checked={notifEmail}
          onChange={setNotifEmail}
        />
        <SettingRow
          icon={Bell}
          title="Alertas de geração"
          description="Notificação no navegador durante a criação do eBook."
          checked={notifGeracao}
          onChange={setNotifGeracao}
        />
        <SettingRow
          icon={Moon}
          title="Modo escuro"
          description="BookForge AI usa o tema preto e dourado por padrão."
          checked={darkMode}
          onChange={() => {}}
          disabled
        />
      </div>

      <div className="card mt-8 border-red-500/20 p-6">
        <h2 className="font-display text-lg text-red-400">Zona de perigo</h2>
        <p className="mt-1 text-sm text-ivory-500">
          Excluir sua conta remove permanentemente todos os seus eBooks e dados.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-500/40 px-5 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          Excluir minha conta
        </button>
      </div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-4">
      <Icon className="h-5 w-5 shrink-0 text-gold-500" />
      <div className="flex-1">
        <p className="text-sm text-ivory-100">{title}</p>
        <p className="text-xs text-ivory-500">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
          checked ? "bg-gold-gradient" : "bg-ivory-500/20"
        }`}
      >
        <span
          className={`block h-5 w-5 translate-x-0.5 rounded-full bg-ink-950 transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
