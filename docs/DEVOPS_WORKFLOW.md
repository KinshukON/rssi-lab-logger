# DevOps Workflow

## Repo overview

- **Web app**: Next.js (App Router) + TypeScript, deployed to **Vercel**
- **Mac app**: Electron DMG, built via **GitHub Actions** on tags, published to **GitHub Releases**

## Branching model

- `main`: protected; merges trigger production deploy on Vercel
- `feat/*`: feature branches (e.g. `feat/auth-ui`)
- `fix/*`: bugfix branches (optional)

## Day-to-day workflow

1. Create branch: `git checkout -b feat/your-feature`
2. Code
3. Run `npm run ci` (recommended before every commit)
4. Commit: `git add -A && git commit -m "feat: your change"`
5. Push: `git push -u origin feat/your-feature`
6. Verify Vercel preview deployment on the PR
7. Open PR targeting `main`
8. Merge to `main` → Vercel production deploy

## Verify preview deployment

After pushing a branch, check the Vercel deployment and verify:

- `/` — main logger page
- `/report` — report page
- `/landing` — landing page
- `/login` — sign-in (requires Supabase env vars configured)
- `/experiments` — cloud experiments list (requires auth)

## Electron release workflow

1. Bump version in `package.json`
2. Commit: `git add package.json && git commit -m "chore: bump to X.Y.Z"`
3. Tag: `git tag vX.Y.Z`
4. Push tag: `git push origin vX.Y.Z`
5. Verify GitHub Action **Build Mac App** succeeds
6. Download DMG from GitHub Releases

> Release builds run only on tags matching `v*`. The workflow uses `samuelmeuli/action-electron-builder` with `--mac --publish always`.

## Environment variables policy

### Vercel

Configure in Vercel project → Settings → Environment Variables:

| Variable | Description | Env |
|----------|-------------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Production, Preview |

These are safe to expose on the client; they are designed for browser use with RLS.

### Server-only / never client

- OAuth provider secrets (Google, GitHub) live in Supabase Dashboard, not in this repo
- Do not add any other secrets to Vercel; Supabase handles auth

### Local development

- Copy `.env.example` to `.env.local`
- Never commit `.env`, `.env.local`, or `.env.*.local`
- If a secret is leaked, rotate it immediately in Supabase Dashboard

## Troubleshooting

### Vercel build fails

1. Run `npm run ci` locally; fix lint/typecheck/build errors
2. Check Vercel build logs for missing env vars
3. Ensure `next.config.ts` has no `output: 'export'` if using API routes (this repo uses auth callbacks)

### Lint fails

- The project uses `eslint .` (not `next lint`) because `next lint` can fail in workspace setups.
- Fix reported errors; warnings do not fail the pipeline.
- Electron (`electron/**`) is excluded from ESLint (uses CommonJS/`require`).

### Typecheck fails

- Run `npx tsc --noEmit` locally
- Fix type errors; ensure no `any` unless explicitly required

### Next export path issues

- This repo does not use `output: 'export'`; it deploys as a server-rendered Next.js app
- If you see export path errors, check `next.config.ts` for unintended `output` changes

### Electron build issues on CI

- Ensure `npm run build:electron` works locally (`NEXT_PUBLIC_IS_ELECTRON=true next build`)
- Electron loads the deployed Vercel URL in prod; local builds use `localhost:3000` or `APP_URL`
- If `mac_certs` is empty, builds are unscoped/unsigned; Gatekeeper may block — users can right-click → Open
