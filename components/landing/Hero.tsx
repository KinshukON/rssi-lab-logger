"use client";

import Link from "next/link";
import { GITHUB_RELEASES_URL } from "@/lib/links";
import { Wifi, CheckCircle2 } from "lucide-react";

const trustBullets = [
  "Manual entry works anywhere",
  "Mac app can Auto Measure (local only)",
  "Printable report + CSV export",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
            <Wifi size={16} />
            Wi-Fi signal measurement made simple
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
            Turn Wi-Fi complaints into{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              measurable evidence
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Measure RSSI (dBm) across your home, see the drop-off, and generate
            a PDF-ready Wi-Fi Health Report. Validate upgrades, optimize router
            placement, and prove improvements.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
            >
              Use the Web App
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl transition-all duration-200 hover:border-blue-300 active:scale-[0.98]"
            >
              Sign in
            </Link>
            <a
              href={GITHUB_RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl transition-all duration-200 hover:border-slate-300 active:scale-[0.98]"
            >
              Download the Mac App
            </a>
          </div>

          <ul className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-8">
            {trustBullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-center gap-2 text-slate-600 text-sm font-medium"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
