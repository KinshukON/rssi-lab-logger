"use client";

import Link from "next/link";
import { GITHUB_REPO_URL } from "@/lib/links";

export default function Footer() {
  return (
    <footer className="py-12 bg-slate-100 border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} RSSI Lab Logger. MIT License.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Web App
            </Link>
            <Link
              href="/report"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Report
            </Link>
          </div>
        </div>
        <p className="mt-6 text-xs text-slate-500 text-center max-w-2xl mx-auto">
          Disclaimer: This tool is for educational and measurement purposes. It
          does not guarantee Wi-Fi performance; use results as supporting
          evidence only.
        </p>
      </div>
    </footer>
  );
}
