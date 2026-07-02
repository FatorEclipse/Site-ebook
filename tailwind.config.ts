import type { Config } from "tailwindcss";

// Design tokens do BookForge AI
// Paleta: tinta quase-preta + dourado antigo (não é o dourado genérico #FFD700)
// Tipografia: Fraunces (serif com personalidade, remete a livro impresso) + Inter (UI) + JetBrains Mono (rótulos/dados)
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0906", // fundo principal — preto quente, não neutro
          900: "#121009",
          800: "#1B1810",
          700: "#262216",
        },
        gold: {
          200: "#F1E3B0",
          300: "#E8CD7A",
          400: "#D9B959",
          500: "#C9A227", // dourado antigo — cor de assinatura
          600: "#A6821D",
          700: "#7C6115",
        },
        ivory: {
          100: "#F5F1E6",
          300: "#D8D2C0",
          500: "#9C9483", // texto secundário
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E8CD7A 0%, #C9A227 50%, #7C6115 100%)",
        "ink-radial": "radial-gradient(circle at 50% 0%, #1B1810 0%, #0A0906 60%)",
      },
      boxShadow: {
        gold: "0 0 40px -10px rgba(201, 162, 39, 0.35)",
      },
      keyframes: {
        "type-line": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "type-line": "type-line 1.6s steps(24, end) forwards",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
