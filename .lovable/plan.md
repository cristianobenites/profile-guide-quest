 Migracao do projeto Agente Takeaways (Next.js) para o projeto Lovable atual (TanStack Start + Supabase)

Escopo e contexto

O projeto compactado contem um monolito Next.js 15+ (App Router) com:
- 151+ arquivos em `app/`
- 47 rotas de API (`/api/app/*`, `/api/admin/*`, `/api/auth/*`)
- 20+ componentes React complexos (workspace 3 colunas, slide viewer, deck canvas, evidence picker, Norman command bar, etc.)
- Prisma + PostgreSQL com ~30 tabelas/models e enums
- Autenticacao NextAuth com MFA
- Dependencias pesadas: AWS SDK (S3/SQS), Cloudinary, pdf-lib, pdfjs-dist, pptxgenjs, next-auth, bcryptjs, otplib, qrcode, upstash/redis
- Worker Python independente para pipeline de IA (nao esta no zip, so referenciado)
- Pipeline multi-etapas: INGESTION -> EVIDENCE_CATALOG -> TAKEAWAYS -> GROUPING -> CURATION -> DECK_BUILD -> OUTLINE -> EXPORT_PPT

O projeto Lovable atual usa TanStack Start (SSR/SSG), Vite 7, Tailwind v4, Supabase (auth + DB), e ja tem rotas: /, /desafio, /perfil, /tecnico, /upload. Nao usa Next.js, Prisma, NextAuth, Cloudinary, AWS, nem worker Python.

Por isso a migracao nao e um "copiar e colar": e uma reescrita da arquitetura, com adaptacao de:
- Next.js App Router -> TanStack Router (file-based routes)
- NextAuth -> Supabase Auth
- Prisma ORM -> Supabase Data API (PostgREST) + SQL migrations
- Rotas API Next.js -> `createServerFn` (logica interna) ou server routes (`/api/public/*` para webhooks)
- Armazenamento Cloudinary/S3 -> Supabase Storage
- Worker Python -> nao roda no Lovable; pipeline de IA deve virar server functions assincronas ou integracao externa

Fase 0: Preparacao e fundacao (1-2 turnos)
1. Instalar dependencias necessarias no projeto Lovable (pdf-lib, pdfjs-dist, pptxgenjs, etc. so se realmente usadas; outras serao substituidas).
2. Configurar Supabase Auth (login/signup) e protecao de rotas autenticadas (`/_authenticated/*`).
3. Criar migrations do Supabase equivalentes ao schema Prisma (tabelas public, enums, RLS, GRANTs, policies, triggers de auditoria).
4. Adaptar types/domain de Prisma para types Supabase/TypeScript.
5. Criar a estrutura base de rotas: `/auth`, `/_authenticated/app`, `/_authenticated/app/projects`, `/_authenticated/app/projects/$id`, etc.

Fase 1: Auth + App shell + landing page (1-2 turnos)
1. Migrar landing page (`app/page.tsx`) para `src/routes/index.tsx`.
2. Migrar paginas de login/signup (`app/auth/*`) para rotas publicas `/auth`, usando Supabase Auth.
3. Migrar AppShell (`app/components/app-shell.tsx`) e layout autenticado (`app/app/layout.tsx`) para `src/routes/_authenticated.tsx`.
4. Migrar pagina de perfil (`app/app/profile/page.tsx`) para `/_authenticated/app/profile`.
5. Garantir que a navegacao entre rotas autenticadas funcione e que o build nao quebre.

Fase 2: Library + wizard de novo projeto (2-3 turnos)
1. Migrar listagem de projetos (`app/app/projects/page.tsx`) e ProjectCard.
2. Criar tabelas/projects no Supabase e server functions CRUD.
3. Migrar wizard de novo projeto (`app/app/projects/new/page.tsx`) de 4 etapas.
4. Migrar rotas de upload (intent/complete) para Supabase Storage + server functions.
5. Criar mock/seed de 6 projetos canon (ou carregar do banco).

Fase 3: Workspace principal (3-4 turnos)
1. Migrar `ProjectWorkspace` (`app/app/projects/[id]/page.tsx`) para `src/routes/_authenticated.app.projects.$id.tsx`.
2. Migrar componentes: SlideList, SlideViewer, TakeawayItem, PipelineStepper, AuditPanel, DeckCanvas, EvidencePickerModal, CommandBar, VersionsSheet, DiffViewer.
3. Adaptar data fetching: de `useEffect` + `apiClient` para TanStack Query (`useSuspenseQuery`/`useMutation`) + server functions.
4. Migrar todas as API routes de `/api/app/projects/[id]/...` para `createServerFn`.
5. Implementar polling de status do pipeline no client.

Fase 4: Grupos, narrativa, outline e exportacao (2-3 turnos)
1. Migrar tabs de grupos, narrativa, outline e PPT preview.
2. Migrar endpoints de grupos, itens, curation suggestions, reducao, auto-assign.
3. Migrar geracao de deck (`/deck/generate`, `/deck/reorder`) e export PPTX/PDF (`pptxgenjs`/`pdf-lib`).
4. Adaptar para Supabase Storage e evitar Node-only packages em server functions.

Fase 5: Assistente Norman + audit + admin (2-3 turnos)
1. Migrar widget flutuante do assistente (`app/components/assistant-widget.tsx`).
2. Migrar rotas `/api/app/assistant/*` para server functions usando Lovable AI Gateway.
3. Migrar painel de auditoria (`app/components/audit-panel.tsx`) e admin audit (`/app/admin/audit`).
4. Migrar internal audit routes (`/api/internal/audit/*`).
5. Implementar versions/diff basico.

Fase 6: Pipeline real (depende de decisao de IA/infra)
1. Substituir worker Python por server functions ou fila externa.
2. Implementar extracao de slides, OCR, catalogo de evidencias e geracao de takeaways via Lovable AI Gateway.
3. Implementar geracao de deck e PPTX real.
4. Ou manter modo mock por enquanto ate definir provedor de IA.

Fase 7: Ajustes finais, testes e publicacao
1. Corrigir imports, tipos, JSX e hooks do Next.js para TanStack Start.
2. Garantir que todos os componentes ui/shadcn existam no projeto Lovable (o projeto Lovable ja tem shadcn, mas pode faltar alguns).
3. Testar fluxos principais: auth, criar projeto, upload, workspace, exportar.
4. Conectar GitHub e publicar.

Restricoes e riscos importantes
- Nao da para simplesmente copiar `monolith/app/` para `src/`: rotas, auth, data fetching e server functions sao completamente diferentes.
- O worker Python nao pode rodar no Lovable Cloud. O pipeline de IA precisa ser redesenhado.
- Pacotes como `sharp`, `canvas`, `puppeteer` e codigo que executa `child_process` NAO funcionam em server functions (Cloudflare Worker). Precisam ser substituidos por alternativas puras-JS/WASM ou APIs externas.
- A migracao completa e grande. Recomendo comecar pela Fase 0 e Fase 1 (fundacao) e validar antes de prosseguir.

Proximo passo
Aprovar este plano para comecar pela Fase 0 (fundacao: Supabase, rotas, auth).