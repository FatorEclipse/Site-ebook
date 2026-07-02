import { BookOpenText } from "lucide-react";
import Link from "next/link";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-radial px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <BookOpenText className="h-6 w-6 text-gold-500" />
          <span className="font-display text-lg font-semibold text-ivory-100">BookForge AI</span>
        </Link>

        <div className="card p-8">
          <h1 className="font-display text-2xl font-semibold text-ivory-100">{title}</h1>
          <p className="mt-1 text-sm text-ivory-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm text-ivory-500">{footer}</div>}
      </div>
    </main>
  );
}
