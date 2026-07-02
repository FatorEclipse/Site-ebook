import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Providers from "@/components/Providers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Protege todas as rotas /dashboard/* no servidor — evita flash de conteúdo
  // protegido antes do redirecionamento (diferente de checagem só no client).
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <Providers>
      <div className="flex min-h-screen bg-ink-950">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </Providers>
  );
}
