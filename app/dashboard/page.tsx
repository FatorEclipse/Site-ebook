import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PlusCircle } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";

export default async function MeusEbooksPage() {
  const session = await getServerSession(authOptions);
  const projects = await prisma.ebookProject.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ivory-100">Meus eBooks</h1>
          <p className="mt-1 text-ivory-500">{projects.length} projeto(s) criado(s)</p>
        </div>
        <Link href="/dashboard/editor" className="btn-gold gap-2">
          <PlusCircle className="h-4 w-4" />
          Novo eBook
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 px-6 py-20 text-center">
          <p className="font-display text-xl text-ivory-100">Nenhum eBook ainda</p>
          <p className="max-w-sm text-sm text-ivory-500">
            Descreva sua ideia no editor e a IA cria capítulos, capa, gráficos e o PDF final por você.
          </p>
          <Link href="/dashboard/editor" className="btn-gold mt-2">
            Criar meu primeiro eBook
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title ?? project.prompt.slice(0, 60)}
              status={project.status}
              coverUrl={project.coverUrl}
              pdfUrl={project.pdfUrl}
              createdAt={project.createdAt.toISOString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
