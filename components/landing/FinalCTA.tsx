"use client";

import Link from "next/link";
import { GITHUB_RELEASES_URL } from "@/lib/links";

export default function FinalCTA() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Stop guessing. Measure it.
        </h2>
        <p className="mt-4 text-slate-300 text-lg">
          Turn Wi-Fi complaints into evidence. Start in seconds.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            Use the Web App
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border-2 border-slate-400 hover:border-white rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            Sign in
          </Link>
          <a
            href={GITHUB_RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border-2 border-slate-400 hover:border-white rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            Download the Mac App
          </a>
        </div>
      </div>
    </section>
  );
}
