"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  PlusCircle,
  BookOpen,
  History,
  CreditCard,
  UserCircle,
  Settings,
  LogOut,
  BookOpenText,
} from "lucide-react";

const navItems = [
  { href: "/dashboard/editor", label: "Novo Projeto", icon: PlusCircle },
  { href: "/dashboard", label: "Meus eBooks", icon: BookOpen },
  { href: "/dashboard/historico", label: "Histórico", icon: History },
  { href: "/dashboard/assinatura", label: "Assinatura", icon: CreditCard },
  { href: "/dashboard/perfil", label: "Perfil", icon: UserCircle },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-ivory-500/10 bg-ink-900/60 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <BookOpenText className="h-6 w-6 text-gold-500" />
        <span className="font-display text-lg font-semibold text-ivory-100">BookForge AI</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-gold-500/10 text-gold-300"
                  : "text-ivory-300 hover:bg-ivory-500/5 hover:text-ivory-100"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ivory-500/10 pt-4">
        <div className="mb-2 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-gradient font-display text-sm text-ink-950">
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-ivory-100">{session?.user?.name ?? "Usuário"}</p>
            <p className="truncate text-xs text-ivory-500">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ivory-500 transition-colors hover:bg-ivory-500/5 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
