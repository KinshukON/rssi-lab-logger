# RSSI Lab Logger

A Next.js application designed for RSSI Lab Logger (MIT PE) to record, visualize, and report Wi-Fi RSSI measurements.

## Features

- **Data Entry**: Record Distance and RSSI (dBm).
- **Auto-Aggregation**: Computes mean RSSI and standard deviation per distance.
- **Visuals**: Plots RSSI vs Distance trend line.
- **Commentary**: Generates a 150-300 word specific analysis text based on your data.
- **Export**:
  - **Print to PDF**: Generates a clean, assignment-ready report.
  - **CSV Download**: Exports raw data.
- **Persistence**: All data is saved to your browser's LocalStorage automatically.

## How to Measure RSSI on macOS

You do **not** need external tools. macOS has built-in diagnostics.

**Method A: The Easy Way (Menu Bar)**
1. Press and hold the **Option (⌥)** key.
2. Click the **Wi-Fi icon** in the top menu bar.
3. Look for the gray text line: `RSSI: -xx dBm`.
4. Record this number.

**Method B: The Terminal Way (Faster)**
1. Open Terminal.
2. Paste this command:
   ```bash
   /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I
   ```
3. Look for `agrCtlRSSI: -xx`.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

This app is optimized for Vercel.

1. Push this code to a GitHub repository.
2. Go to [Vercel.com](https://vercel.com) and "Add New Project".
3. Import your repository.
4. Click **Deploy**. No environment variables are needed.

## License

MIT License. See [LICENSE](./LICENSE) file for details.
