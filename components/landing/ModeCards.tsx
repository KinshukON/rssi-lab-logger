"use client";

import { Globe, Monitor } from "lucide-react";
import Link from "next/link";
import { GITHUB_RELEASES_URL } from "@/lib/links";

export default function ModeCards() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center">
          Two modes. One workflow.
        </h2>
        <p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
          Use the web app anywhere, or the Mac app for the fastest data capture.
        </p>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-8 hover:border-blue-200 transition-colors">
            <div className="rounded-xl bg-blue-100 p-4 w-fit mb-6">
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">
              Web App (Vercel)
            </h3>
            <ul className="mt-4 space-y-2 text-slate-600 text-sm">
              <li>• Manual entry — works on any device</li>
              <li>• Shareable URL — no install</li>
              <li>• Mobile-friendly — measure on phone</li>
              <li>• No Auto Measure — you log values yourself</li>
            </ul>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Use the Web App
            </Link>
          </div>

          <div className="rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-8 hover:border-indigo-200 transition-colors">
            <div className="rounded-xl bg-indigo-100 p-4 w-fit mb-6">
              <Monitor className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">
              Mac App (Electron)
            </h3>
            <ul className="mt-4 space-y-2 text-slate-600 text-sm">
              <li>• Auto Measure — one-click RSSI capture</li>
              <li>• Runs airport -I locally</li>
              <li>• Faster data capture — no manual typing</li>
              <li>• macOS only — no Windows/Linux build yet</li>
            </ul>
            <p className="mt-4 text-xs text-slate-500 font-medium">
              Security note: Auto Measure runs locally and reads only Wi-Fi RSSI.
            </p>
            <a
              href={GITHUB_RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              Download the Mac App
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
