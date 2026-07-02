import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

// SEO completo: title template, OG, Twitter card, schema.org via JSON-LD no page.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://bookforge.ai"),
  title: {
    default: "BookForge AI — Crie eBooks profissionais com Inteligência Artificial",
    template: "%s | BookForge AI",
  },
  description:
    "Transforme uma ideia em um eBook profissional completo em minutos. Capítulos, capa, índice, gráficos e PDF diagramado — tudo gerado por IA.",
  keywords: ["ebook com ia", "gerador de ebook", "criar ebook automatico", "bookforge ai"],
  openGraph: {
    title: "BookForge AI — eBooks profissionais gerados por IA",
    description:
      "Digite um prompt e receba um eBook completo, formatado e pronto para publicar em PDF.",
    url: "https://bookforge.ai",
    siteName: "BookForge AI",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookForge AI",
    description: "Crie eBooks profissionais usando Inteligência Artificial.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
