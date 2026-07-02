# BookForge AI — Fase 1 + Fase 2

## Fase 2 (novo): Autenticação + Dashboard completo

- **`app/login`**, **`app/cadastro`**, **`app/recuperar-senha`** — telas com
  Google, GitHub e email/senha, usando o componente `AuthShell` compartilhado.
- **`app/api/auth/[...nextauth]`**, **`app/api/auth/register`**,
  **`app/api/auth/recuperar-senha`** — cadastro com hash bcrypt (salt 12),
  validação de senha forte, rate limit por IP, e fluxo de recuperação sem
  enumeração de emails (resposta idêntica exista ou não a conta).
- **`app/dashboard/layout.tsx`** — protege TODAS as rotas do dashboard
  (incluindo o editor) verificando a sessão no servidor antes de renderizar.
- **`components/Sidebar.tsx`** — navegação completa (Novo Projeto, Meus
  eBooks, Histórico, Assinatura, Perfil, Configurações) com estado ativo e
  logout.
- **`app/dashboard/page.tsx`** + **`components/ProjectCard.tsx`** — grade de
  eBooks com baixar / editar / duplicar / excluir, protegida contra IDOR
  (cada ação confere se o projeto pertence ao usuário logado).
- **`app/dashboard/historico`** — linha do tempo de todas as gerações,
  inclusive falhas.
- **`app/dashboard/assinatura`** — plano atual, créditos restantes, cards de
  upgrade e botão de portal de faturamento (checkout e portal do Stripe já
  funcionais; webhook de sincronização fica para a Fase 3).
- **`app/dashboard/perfil`** — edição de nome e upload de logo (usada nos
  eBooks gerados).
- **`app/dashboard/configuracoes`** — notificações e exclusão de conta (com
  cascade no banco).

## O que já está pronto (Fase 1)

- **`app/page.tsx`** — Landing page completa: hero com animação de assinatura
  (índice "se auto-escrevendo"), campo de teste de prompt, benefícios, planos
  e rodapé. Tema preto/dourado definido em `tailwind.config.ts`.
- **`app/dashboard/editor/page.tsx`** — Editor com campo de prompt gigante,
  todas as opções pedidas (idioma, tema, páginas, público, tom, estilo,
  imagens, gráficos, capa, índice, referências) e barra de progresso das
  etapas da IA.
- **`app/api/generate/route.ts`** — Orquestra a geração: autenticação → rate
  limit → validação → checagem de créditos → geração de conteúdo (IA) → capa →
  PDF → upload → débito de crédito.
- **`lib/openai.ts`** — Chamada estruturada à OpenAI que devolve JSON com
  índice, capítulos, subtítulos, conclusão, FAQ e CTA, mais geração de capa
  via DALL·E.
- **`lib/pdf-generator.ts`** — Diagramação profissional do PDF (capa, índice,
  cabeçalho, rodapé, numeração, margens, tipografia, links clicáveis).
- **`prisma/schema.prisma`** — Modelos de usuário, projeto de eBook,
  assinatura, log de auditoria e as tabelas padrão do NextAuth.
- **`lib/auth.ts`** — NextAuth com Google, GitHub e login por email/senha.
- **`lib/ratelimit.ts`** e **`lib/storage.ts`** — Proteção contra abuso e
  upload do PDF final para storage compatível com S3.

## O que ainda falta (próximas fases, sob demanda)

1. **Webhook do Stripe** (`checkout.session.completed`, `customer.subscription.updated/deleted`)
   para sincronizar `plan`, `credits` e status da `Subscription` automaticamente.
2. **Painel Admin**: usuários, assinaturas, relatórios de receita, logs de auditoria.
3. Exportação em **DOCX** e **EPUB**, geração de página de vendas, anúncios,
   posts para Instagram e roteiro para TikTok.
4. Página de redefinição de senha (`/redefinir-senha?token=...`) que consome
   o `PasswordResetToken` criado pela API de recuperação.
5. Variáveis de ambiente (`.env`): `DATABASE_URL`, `OPENAI_API_KEY`,
   `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET`,
   `GITHUB_CLIENT_ID/SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO`,
   `STRIPE_PRICE_BUSINESS`, `UPSTASH_REDIS_*`, `STORAGE_*`, `SMTP_*`.

## Como você pode usar isso sem PC

1. Crie um repositório novo no GitHub pelo app ou pelo site mobile.
2. Use a opção "Add file → Upload files" para subir estes arquivos mantendo
   as pastas (`app/`, `lib/`, `prisma/`).
3. Conecte o repositório na Vercel (também funciona pelo navegador do
   celular) — ela instala as dependências e builda automaticamente.
4. Configure as variáveis de ambiente no painel da Vercel.
5. Crie um banco Postgres gerenciado (ex.: Neon ou Supabase, ambos com painel
   mobile-friendly) e cole a `DATABASE_URL`.

Quando quiser, eu continuo com a próxima fase (auth/dashboard ou Stripe).
