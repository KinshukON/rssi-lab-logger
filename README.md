# RSSI Lab Logger

A Next.js application for recording, visualizing, and reporting Wi-Fi RSSI measurements. Supports **Local Mode** (no account, `localStorage` only) and **Cloud Mode** (Supabase Auth + Postgres sync) with Google/GitHub sign-in.

## Features

- **Data entry**: Record distance and RSSI (dBm), optional noise and tx rate
- **Auto-aggregation**: Mean RSSI and standard deviation per distance
- **Charting**: RSSI vs distance (Recharts)
- **Commentary**: Generated analysis text
- **Export**: Print to PDF, CSV download
- **Persistence**: LocalStorage (always) + Supabase Postgres (when signed in + Cloud Mode)
- **Auth**: Supabase Auth with Google and GitHub OAuth (optional)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

**Required for auth and cloud sync:**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

Get these from [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API.

### 3. Supabase Google OAuth configuration

In [Supabase Dashboard](https://supabase.com/dashboard) → Authentication:

**Providers → Google**

- Enable the Google provider
- Add **Client ID** and **Client Secret** from [Google Cloud Console](https://console.cloud.google.com/):
  - Create OAuth 2.0 credentials (Web application)
  - Add authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`

**URL Configuration**

- **Site URL**: `http://localhost:3000` (for local dev) or `https://rssi-lab-logger.vercel.app` (for production)
- **Additional Redirect URLs** — add both:
  - `http://localhost:3000/auth/callback`
  - `https://rssi-lab-logger.vercel.app/auth/callback`
  - If your Vercel URL differs (e.g. `rssi-lab-logger-eqt3.vercel.app`), add that too: `https://rssi-lab-logger-eqt3.vercel.app/auth/callback`

### 5. Apply SQL migration

In Supabase Dashboard → SQL Editor, run the contents of:

```
supabase/migrations/001_init.sql
```

Or use the Supabase CLI:

```bash
supabase link
supabase db push
```

### 6. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 7. Verification checklist

1. Visit `/landing` — marketing page loads with CTAs
2. Click **Sign in** → complete Google OAuth
3. Confirm navbar shows logged-in user (avatar/email) and **Sign out**
4. Refresh the page — session persists (cookie-based)

## Local vs Cloud Mode

| Mode | When | Data stored |
|------|------|-------------|
| **Local** | Logged out, or logged in with Cloud Mode off | `localStorage` only |
| **Cloud** | Logged in + Cloud Mode on | Supabase Postgres + `localStorage` cache |

- Logged-out users always use Local Mode.
- Logged-in users can toggle between Local and Cloud in the account dropdown.
- Cloud Mode defaults to ON once signed in.
- If cloud sync fails (offline, etc.), a non-blocking banner appears: "Cloud sync offline — using local cache".

## Deploy to Vercel

1. Push to GitHub and import the repo in Vercel.
2. In Vercel project → Settings → Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (Scope: Production and Preview)
3. In Supabase → Authentication → URL Configuration, add your Vercel URL to Redirect URLs: `https://<your-app>.vercel.app/auth/callback` (e.g. `https://rssi-lab-logger.vercel.app/auth/callback`)
4. Deploy. Production deploys on merge to `main`.

## Mac App (Electron)

- **Dev**: `npm run electron-dev` — loads `http://localhost:3000`, Auto Measure works.
- **Prod**: `npm run dist` — packages Electron app; loads from deployed URL for auth + cloud sync.
- **Auto Measure**: Runs `airport -I` locally via `spawn` (Electron-only).

## How to measure RSSI on macOS

**Menu bar**: Hold **Option (⌥)** and click the Wi-Fi icon → look for `RSSI: -xx dBm`.

**Terminal**:

```bash
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I
```

Look for `agrCtlRSSI: -xx`.

## License

MIT. See [LICENSE](LICENSE).
