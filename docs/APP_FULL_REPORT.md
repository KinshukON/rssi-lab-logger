# RSSI Lab Logger — Full Forensic Audit & Architecture Report

**Date:** February 15, 2025  
**Scope:** Complete codebase audit, architecture documentation, security review  
**Source of Truth:** Repository files only — no speculation

---

## 1) One-Paragraph Summary

**RSSI Lab Logger** is a Wi-Fi RSSI (Received Signal Strength Indicator) measurement and reporting tool built for MIT PE (Physical Electronics) lab assignments. It lets users record distance-vs-RSSI readings, aggregate them (mean, std dev), visualize them on a chart, and produce a printable PDF-ready report with AI-style commentary. The application has two deployment bodies: (1) **Web/Vercel** — a static Next.js app served on Vercel, where users manually enter RSSI from macOS Wi-Fi diagnostics (Option-click menu bar or `airport -I`); and (2) **Mac/Electron** — a desktop app that wraps the same Next.js UI and adds an "Auto Measure" feature that executes the macOS `airport` utility to capture RSSI automatically via IPC. Both share the same React components, state, and localStorage persistence.

---

## 2) Repository Map (Tree)

```
rssi-lab-logger/
├── .github/
│   └── workflows/
│       └── build-app.yml          # Mac build on tag push; publishes to GitHub Releases
├── app/
│   ├── layout.tsx                # Root layout, Geist fonts, global error handler
│   ├── page.tsx                  # Main logger page (home)
│   ├── report/
│   │   └── page.tsx              # Report view with Print/PDF
│   ├── globals.css               # Tailwind v4, print media styles
│   └── favicon.ico
├── components/
│   ├── ExperimentMetaForm.tsx    # Experiment metadata (title, date, band, unit, SSID)
│   ├── ReadingForm.tsx           # Add reading form + Auto Measure (Electron)
│   ├── ReadingsTable.tsx         # Raw readings table with delete
│   ├── AggregatesTable.tsx       # Mean, std dev, quality per distance
│   ├── RssiChart.tsx             # Recharts line chart (RSSI vs distance)
│   ├── ReportView.tsx            # Full report layout (header, tables, chart, commentary)
│   └── Commentary.tsx            # Renders generated analysis text
├── lib/
│   ├── storage.ts                # localStorage load/save/clear (key: rssi-lab-logger-v1)
│   ├── compute.ts                # groupReadings, mean, stdDev, quality labels
│   ├── units.ts                  # meters↔feet conversion, formatDistance
│   └── commentary.ts             # generateCommentary (template-based text)
├── types/
│   ├── index.ts                  # ExperimentMeta, Reading, ExperimentData
│   └── electron.d.ts             # Window.electronAPI type declaration
├── electron/
│   ├── main.js                   # Electron main process, BrowserWindow, IPC handler
│   └── preload.js                # contextBridge exposes getRssi, isElectron
├── public/                       # Static assets (file.svg, vercel.svg, etc.)
├── docs/
│   └── APP_FULL_REPORT.md        # This document
├── next.config.ts                # output: export, assetPrefix for Electron
├── vercel.json                   # Vercel framework config (next build)
├── package.json                  # Scripts, electron-builder config
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── README.md
└── LICENSE
```

### Folder Descriptions

| Folder | Purpose |
|--------|---------|
| `.github/workflows` | CI/CD: runs Mac build on version tags, publishes DMG to GitHub Releases |
| `app/` | Next.js App Router pages; layout and routes (`/`, `/report/`) |
| `components/` | Reusable React components for form, table, chart, report |
| `lib/` | Business logic: storage, aggregation, units, commentary generation |
| `types/` | TypeScript types and global declarations (electron API) |
| `electron/` | Electron main + preload scripts; no renderer code (uses Next.js output) |
| `public/` | Static files served at root |
| `docs/` | Documentation (this report) |

---

## 3) Runtime Architecture

### Web Path (Vercel / Browser)

| Layer | Technology | Location |
|-------|------------|----------|
| Routes | Next.js App Router | `app/page.tsx` → `/`, `app/report/page.tsx` → `/report/` |
| State | React `useState` | `app/page.tsx` (meta, readings), `app/report/page.tsx` (meta, readings loaded from storage) |
| Storage | `localStorage` | Key `rssi-lab-logger-v1`; `lib/storage.ts` |
| Charting | Recharts | `components/RssiChart.tsx` (LineChart, XAxis, YAxis, Tooltip) |
| Report | Client-side load from localStorage + `window.print()` | `app/report/page.tsx` lines 42–43 |

**What runs where (Web):** All logic runs in the browser. Next.js produces static HTML (`output: 'export'`). No server-side rendering after build. Vercel serves the static export.

### Desktop Path (Electron)

| Layer | Technology | Location |
|-------|------------|----------|
| Main process | Node.js, Electron | `electron/main.js` — creates BrowserWindow, handles IPC |
| Renderer | Next.js static output | Loaded from `out/index.html` (prod) or `http://localhost:3000` (dev) |
| Preload | contextBridge | `electron/preload.js` — exposes `getRssi`, `isElectron` |
| IPC channel | `get-rssi` | Main invokes `airport -I`, parses RSSI, returns to renderer |

**What runs where (Electron):**

- **Main process:** Window creation, menu, `exec()` of airport, IPC handler `get-rssi`.
- **Preload:** Runs in isolated context; bridges `ipcRenderer.invoke('get-rssi')` to `window.electronAPI.getRssi()`.
- **Renderer:** Same React app as web; detects `window.electronAPI?.isElectron` to show "Auto Measure" and "Download App" logic.
- **Command execution:** Only in main process. Renderer never touches `child_process` or shell.

**Dev vs prod:**

- Dev: `electron-dev` → `next dev` + `electron .` loading `http://localhost:3000`.
- Prod: `dist` → `next build` (with `NEXT_PUBLIC_IS_ELECTRON=true`) → `electron-builder` → packages `out/**/*` into app.

---

## 4) Feature Inventory (Exhaustive)

| # | Feature | UX Location | Code Pointers |
|---|---------|-------------|---------------|
| 1 | **Manual RSSI entry** | Reading form, main page | `components/ReadingForm.tsx` — form submit, `handleSubmit` (lines 51–89) |
| 2 | **Auto-measure RSSI (Electron only)** | "⚡️ Auto Measure" button in ReadingForm | `components/ReadingForm.tsx` — `handleAutoMeasure` (lines 38–48), `window.electronAPI.getRssi()` |
| 3 | **Distance unit conversion** | Experiment setup (m/ft), display in tables/chart | `lib/units.ts` — `metersToFeet`, `feetToMeters`, `formatDistance`; `components/ExperimentMetaForm.tsx` (unit select, line 98–106); `ReadingForm` converts on submit (line 70) |
| 4 | **Aggregations (mean, std dev)** | AggregatesTable, compute | `lib/compute.ts` — `groupReadings` (lines 21–59); `components/AggregatesTable.tsx` |
| 5 | **Quality labels** | AggregatesTable (Excellent/Good/Fair/Weak/Unusable) | `lib/compute.ts` — `getQualityLabel` (lines 13–19); `AggregatesTable.tsx` (lines 64–72) |
| 6 | **Charting** | Live Visualization section, Report | `components/RssiChart.tsx` — Recharts LineChart, XAxis, YAxis, Tooltip |
| 7 | **Report view** | `/report` page | `app/report/page.tsx`; `components/ReportView.tsx` |
| 8 | **Print to PDF** | Report page "Print / Save PDF" button | `app/report/page.tsx` line 43: `onClick={() => window.print()}`; print styles in `app/globals.css` |
| 9 | **CSV export** | Download icon in navbar | `app/page.tsx` — `handleCsvExport` (lines 119–138) |
| 10 | **localStorage persistence** | Automatic save on change | `lib/storage.ts` — `loadExperiment`, `saveExperiment`; `app/page.tsx` useEffect (lines 97–101) saves when meta/readings change |
| 11 | **Delete readings** | Trash icon per row in ReadingsTable | `components/ReadingsTable.tsx` — `onDeleteReading` (lines 68–74); `app/page.tsx` — `handleDeleteReading` (lines 107–109) |
| 12 | **Edit readings** | **NOT FOUND** | No edit UI or handler. Would typically live in `ReadingsTable` or a dedicated edit modal. |
| 13 | **Validation rules** | ReadingForm submit | `components/ReadingForm.tsx` (lines 56–67): distance > 0, RSSI in [-99, -11] |
| 14 | **Experiment metadata** | STEP 1 form | `components/ExperimentMetaForm.tsx` — title, name, date, location, band, unit, SSID |
| 15 | **Demo data** | "Test with Demo Data" in navbar | `app/page.tsx` — `handleDemoData` (lines 141–158) |
| 16 | **Reset experiment** | Rotate icon in navbar | `app/page.tsx` — `handleReset` (lines 111–117) |
| 17 | **AI-style commentary** | Report view | `lib/commentary.ts` — `generateCommentary`; `components/Commentary.tsx`; `ReportView.tsx` (line 16) |
| 18 | **Electron detection** | Conditional UI (Auto Measure, Download App link) | `app/page.tsx` line 55: `(window as any).electronAPI?.isElectron`; `ReadingForm.tsx` lines 26–36 |

---

## 5) Data Model + State Flow

### Types / Interfaces

**`types/index.ts`:**

```typescript
// Lines 1–10
export type ExperimentMeta = {
  title: string;
  name?: string;
  dateISO: string;
  location?: string;
  band: "2.4GHz" | "5GHz" | "Unknown";
  ssid?: string;
  notes?: string;
  unit: "m" | "ft";
};

// Lines 12–20
export type Reading = {
  id: string;
  createdAtISO: string;
  distanceM: number;   // canonical meters
  rssiDbm: number;    // negative integer
  noiseDbm?: number;
  txRateMbps?: number;
  note?: string;
};

// Lines 22–26
export type ExperimentData = {
  meta: ExperimentMeta;
  readings: Reading[];
};
```

### Where State Lives

- **`app/page.tsx`:** `meta`, `readings`, `loaded`, `isElectron`, `loadingStatus`, `loadError` — all in React state.
- **`app/report/page.tsx`:** `meta`, `readings`, `loaded` — loaded from localStorage on mount.
- **Persistent store:** `localStorage` key `rssi-lab-logger-v1` — `lib/storage.ts` line 3.

### Persistence

- **Key:** `rssi-lab-logger-v1` — `lib/storage.ts` line 3.
- **Schema:** Single JSON object: `{ meta: ExperimentMeta, readings: Reading[] }`.
- **Migrations:** None. Comment at `lib/storage.ts` line 23: "Basic validation/migration could go here". `loadExperiment` merges `DEFAULT_META` over `data.meta` and ensures readings is an array.

### Data Flow (Text Diagram)

```
┌─────────────────┐     loadExperiment()      ┌──────────────────┐
│   localStorage   │ ◄────────────────────────►│  app/page.tsx    │
│  rssi-lab-logger │     saveExperiment()      │  (meta, readings)│
│      -v1        │                            └────────┬─────────┘
└─────────────────┘                                     │
                                                         │ props
        ┌───────────────────────────────────────────────┼───────────────────────────────────┐
        │                                               │                                   │
        ▼                                               ▼                                   ▼
┌───────────────┐  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐  ┌────────────────┐
│ExperimentMeta │  │  ReadingForm     │  │  groupReadings()  │  │  ReadingsTable  │  │  RssiChart      │
│    Form       │  │  onAddReading   │  │  lib/compute.ts   │  │  onDeleteReading │  │  AggregatesTable│
└───────────────┘  └─────────────────┘  └────────┬─────────┘  └─────────────────┘  └────────────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │  /report page    │
                                         │  loadExperiment  │
                                         │  ReportView     │
                                         └─────────────────┘
```

---

## 6) RSSI Capture Implementation (Deep Dive)

### Command Executed

**Full path:**

```
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I
```

**Evidence:** `electron/main.js` line 76:

```javascript
const cmd = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I';
```

### Where It Is Executed

- **Process:** Electron main process (`electron/main.js`).
- **Mechanism:** `require('child_process').exec` — line 3 and line 78.

**Evidence:** `electron/main.js` lines 1–4, 73–94:

```javascript
const { exec } = require('child_process');
// ...
ipcMain.handle('get-rssi', async () => {
    return new Promise((resolve, reject) => {
        const cmd = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I';
        exec(cmd, (error, stdout, stderr) => {
            // ...
        });
    });
});
```

- **NOT in preload:** Preload only bridges IPC; no `child_process`.
- **NOT in renderer:** Renderer cannot access Node or child_process.

### Output Parsing

**Regex:** `stdout.match(/agrCtlRSSI:\s*(-?\d+)/)` — `electron/main.js` line 85.

- Extracts the numeric value from `agrCtlRSSI: -xx` and returns `parseInt(match[1], 10)`.
- Only `agrCtlRSSI` is used; no other airport fields.

### Results to UI (IPC)

- **Channel:** `get-rssi`.
- **Preload:** `electron/preload.js` lines 3–5:

  ```javascript
  contextBridge.exposeInMainWorld('electronAPI', {
      getRssi: () => ipcRenderer.invoke('get-rssi'),
      isElectron: true,
  });
  ```

- **Renderer:** `ReadingForm.tsx` line 44: `const rssiVal = await window.electronAPI.getRssi();` then `setRssi(rssiVal.toString());`.

### Safeguards

- **Whitelist:** Command is hardcoded; no user input in the command string.
- **spawn vs exec:** Uses `exec` (not `execSync` or `spawn`). `exec` runs the command in a shell; the command itself is fixed.
- **Input handling:** No user input is concatenated into the command.
- **Safeguards:** No explicit timeout, whitelist, or sandbox. Mitigation is that the command is fixed.

### Error Handling

- **exec error:** Rejects with `error.message` — `electron/main.js` lines 79–82.
- **Parse failure:** Rejects with `"Could not find RSSI in airport output"` — lines 89–90.
- **Renderer:** `ReadingForm.tsx` lines 47–48: catch block sets `setError("Failed to get reading from airport utility. Is Wi-Fi on?")`.

---

## 7) Security Review

### Threat Model: Command Execution

| Risk | Status | Evidence |
|------|--------|----------|
| Arbitrary command execution | Low | Command is hardcoded in `electron/main.js` line 76; no user input. |
| Injection into command | Low | No string concatenation of user input; no variables in command. |
| Path traversal / argument injection | N/A | No arguments from user. |

### exec Usage

- **Used:** `child_process.exec` — `electron/main.js` line 78.
- **How:** Single hardcoded command; callback handles error/stdout/stderr.
- **Shell:** `exec` uses a shell by default. The command is fixed, so shell metacharacters from user input do not affect it.

### User Input and Shell

- **User input:** Distance, RSSI, noise, tx rate, note, metadata — all used only in React state and localStorage, never passed to the main process or shell.
- **Conclusion:** User input does not influence shell execution.

### Permissions and Sandbox

- **nodeIntegration:** `false` — `electron/main.js` line 15.
- **contextIsolation:** `true` — `electron/main.js` line 16.
- **preload:** Used for explicit API surface (`getRssi`, `isElectron`).
- **Sandbox:** Not explicitly set; Electron default applies (renderer sandbox varies by version).
- **macOS entitlements:** Not found in repo; no custom entitlements file.

### Recommendations

1. **Replace exec with spawn:** Use `spawn` with `shell: false` and pass the path and arguments as an array to avoid shell interpretation.
2. **Add timeouts:** Use `child_process.spawn` with `timeout` or wrap in `Promise.race` to avoid hanging.
3. **Validate parsed RSSI:** Ensure parsed value is in a reasonable range (e.g. -100 to 0) before returning.
4. **Code signing / notarization:** `package.json` has `"identity": null`; add signing and notarization for distribution.
5. **CSP:** Add Content-Security-Policy headers if loading remote content.

---

## 8) Build + Packaging Pipeline

### Next.js → Electron Flow

1. **Build command:** `npm run build:electron` = `NEXT_PUBLIC_IS_ELECTRON=true next build`
   - **Evidence:** `package.json` line 9.
2. **Next.js config:** `output: 'export'` → static export to `out/`.
   - **Evidence:** `next.config.ts` line 4.
3. **Asset prefix:** For Electron production (non-Vercel), `assetPrefix: './'` for relative paths.
   - **Evidence:** `next.config.ts` lines 5–6.
4. **Electron loads:** `mainWindow.loadFile(path.join(__dirname, '../out/index.html'))` in production.
   - **Evidence:** `electron/main.js` lines 32–35.

### electron-builder Configuration

**Evidence:** `package.json` lines 17–27:

```json
"build": {
  "appId": "com.kinshukdutta.rssilablogger",
  "productName": "RSSI Lab Logger",
  "files": ["electron/**/*", "out/**/*", "package.json"],
  "mac": {
    "target": [{"target": "dmg", "arch": ["x64", "arm64"]}],
    "identity": null
  },
  "asarUnpack": ["**/node_modules/sharp/**/*", "..."],
  "directories": {"output": "dist"}
}
```

- **electron-forge:** Not used; only electron-builder.
- ** Mac targets:** DMG for x64 and arm64.
- **Output:** `dist/` — `package.json` line 42 (in build config), `directories.output`.

### Code Signing / Notarization

- ** identity:** `null` — `package.json` line 24.
- **Signing / notarization:** Not configured. GitHub workflow uses `mac_certs: ''`.
- **Evidence:** `.github/workflows/build-app.yml` line 37: `mac_certs: ''`.

### Versioning and Artifacts

- **Version:** `package.json` line 2: `"version": "0.1.0"`.
- **CI trigger:** Push of tags matching `v*` — `.github/workflows/build-app.yml` lines 4–6.
- **Artifact naming:** Controlled by electron-builder; outputs go to `dist/` and are published to GitHub Releases by the workflow.

### CI Definition

**File:** `.github/workflows/build-app.yml`

**Steps:** Checkout → Setup Node 20 → `npm ci` → `npm run build:electron` → `action-electron-builder` with `release: true`, `--mac --publish always`.

---

## 9) Deployment Paths

### Vercel

- **Build:** `next build` — `vercel.json` line 2.
- **Install:** `npm install` — `vercel.json` line 3.
- **Output:** Static export from Next.js (no server functions).
- **Routes:** `/` and `/report/` served as static HTML.

### Desktop Distribution

- **Build:** `npm run dist` = `npm run build:electron && electron-builder`.
- **Output:** DMG in `dist/` (and published to GitHub Releases by CI on tag push).
- **User install:** Download DMG from GitHub Releases, open, drag app to Applications.

---

## 10) How to Run Locally

### Web Dev

```bash
npm install
npm run dev
```

- Open http://localhost:3000.
- Uses Next.js Turbopack.
- **Evidence:** `package.json` line 8.

### Desktop Dev

```bash
npm install
npm run electron-dev
```

- Runs `next dev` and `wait-on http://localhost:3000 && electron .`.
- Electron loads http://localhost:3000; Auto Measure works.
- **Evidence:** `package.json` line 12.

### Production Build

**Web (Vercel):**

```bash
npm install
npm run build
```

- Output in `out/` (or Vercel build output).

**Desktop:**

```bash
npm install
npm run dist
```

- Builds Next.js with `NEXT_PUBLIC_IS_ELECTRON=true`, then runs electron-builder.
- Mac: DMG in `dist/`.

**Evidence:** `package.json` lines 9–10, 14.

### Prerequisites

- Node.js 20 (from CI).
- npm.
- For Mac build: macOS, Xcode (for native modules).
- For Auto Measure: macOS (airport is macOS-only).

### Common Failure Fixes

- **`out/index.html` not found:** Run `npm run build:electron` before `electron .` in prod.
- **Auto Measure fails:** Ensure Wi-Fi is on and airport binary is present (macOS only).
- **Blank screen:** Check `assetPrefix`; Electron needs `./` for relative paths.
- **localStorage quota:** Clear site data or use a different browser profile if quota is exceeded.

---

## 11) Known Limitations

| Limitation | Details |
|-----------|---------|
| **Auto Measure only on Mac** | Uses macOS `airport`; no Windows/Linux equivalent. |
| **No edit readings** | Only add and delete; no in-place edit. |
| **localStorage only** | No IndexedDB, no sync; data tied to origin and device. |
| **Browser sandbox** | Web build cannot run `airport`; no Node/child_process in browser. |
| **Single experiment** | One dataset per origin; no multi-experiment management. |
| **No migration** | Storage schema is fixed; no versioning or migration logic. |
| **Print depends on browser** | PDF quality depends on browser print implementation. |
| **macOS-only desktop** | `app.on('window-all-closed')` quits on non-darwin; no Windows/Linux target. |
| **Unsigned build** | `identity: null`; Gatekeeper may block unsigned app. |
| **No notarization** | May trigger security warnings on first launch. |

---

## 12) Appendix: Evidence Index

| Claim | File(s) |
|-------|---------|
| App name, version | `package.json` L1–2 |
| Main entry for Electron | `package.json` L5 |
| Scripts (dev, build, dist) | `package.json` L8–14 |
| electron-builder config | `package.json` L17–27 |
| Next.js output export | `next.config.ts` L4 |
| assetPrefix for Electron | `next.config.ts` L6 |
| Vercel config | `vercel.json` |
| ExperimentMeta, Reading types | `types/index.ts` L1–26 |
| electronAPI type | `types/electron.d.ts` |
| localStorage key | `lib/storage.ts` L3 |
| loadExperiment, saveExperiment | `lib/storage.ts` L12–41 |
| groupReadings, mean, stdDev | `lib/compute.ts` |
| metersToFeet, feetToMeters | `lib/units.ts` |
| generateCommentary | `lib/commentary.ts` |
| Manual entry, validation | `components/ReadingForm.tsx` L51–89, L56–67 |
| Auto Measure | `components/ReadingForm.tsx` L38–48, L98–105 |
| Delete reading | `components/ReadingsTable.tsx` L68–74 |
| Recharts chart | `components/RssiChart.tsx` |
| Aggregates table | `components/AggregatesTable.tsx` |
| Report layout | `components/ReportView.tsx` |
| Print to PDF | `app/report/page.tsx` L43 |
| CSV export | `app/page.tsx` L119–138 |
| Demo data | `app/page.tsx` L141–158 |
| Electron detection | `app/page.tsx` L55; `ReadingForm.tsx` L26–36 |
| airport command, exec, parsing | `electron/main.js` L73–94 |
| preload API | `electron/preload.js` |
| nodeIntegration false, contextIsolation true | `electron/main.js` L15–16 |
| Dev loads localhost, prod loads out/index.html | `electron/main.js` L24–35 |
| GitHub Actions build | `.github/workflows/build-app.yml` |
| mac identity null | `package.json` L24 |
| mac_certs empty | `.github/workflows/build-app.yml` L37 |
| Edit readings | NOT FOUND |
