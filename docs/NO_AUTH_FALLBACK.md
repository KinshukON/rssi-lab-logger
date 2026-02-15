# No-Auth Fallback (Local Mode)

RSSI Lab Logger supports **local-only usage** without signing in. This document explains how it works.

## Behavior

| Mode   | Sign-in required? | Where data lives      | Sync across devices? |
|--------|-------------------|------------------------|----------------------|
| Local  | No                | `localStorage`         | No                   |
| Cloud  | Yes + toggle on   | Supabase Postgres      | Yes                  |

## Local Mode

- **How to use**: Simply open the app and start recording. Do not click "Sign in".
- **Data storage**: All experiment metadata and readings are saved to your browser's `localStorage` under the key `rssi-lab-logger-v1`.
- **Persistence**: Data survives page refresh and browser restarts. It is tied to the browser and origin.
- **Limits**: `localStorage` is typically 5–10 MB. Clearing site data or using a different browser/profile will lose data.

## Cloud Mode

- **How to use**: Click "Sign in", authenticate with Google or GitHub, then ensure "Cloud" is selected in the account dropdown.
- **Data storage**: Experiments and readings are stored in Supabase Postgres (RLS enforced). Metadata is debounced (600ms); readings sync immediately.
- **Persistence**: Data is available across devices and sessions.
- **localStorage cache**: Cloud mode also writes to `localStorage` as an offline backup.

## Switching Modes

- **Local → Cloud**: Sign in and enable Cloud in the dropdown. Local data can be migrated on first cloud load.
- **Cloud → Local**: Toggle to Local in the dropdown, or sign out. Cloud data remains in Supabase.

## Electron

- The Mac Electron app loads the deployed web app URL for auth + cloud sync.
- Auto Measure (RSSI capture) works locally via IPC; no auth required for that feature.
