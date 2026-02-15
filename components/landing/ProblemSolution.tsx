"use client";

import { X, Check } from "lucide-react";

const problems = [
  "Wi-Fi debates are subjective — no numbers to back them up",
  "Random extenders and mesh systems waste money without proof",
  "No before/after evidence when you change setup",
];

const solutions = [
  "Standardized measurement workflow anyone can follow",
  "Charts, averages, and quality labels at a glance",
  "Evidence pack in minutes — not hours of guesswork",
];

export default function ProblemSolution() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center">
          Stop guessing. Start measuring.
        </h2>
        <p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
          Wi-Fi issues feel intangible until you have data. RSSI Lab Logger turns
          vague complaints into concrete evidence.
        </p>

        <div className="mt-16 grid md:grid-cols-2 gap-12">
          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8">
            <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
              <X className="h-5 w-5" />
              The problem
            </h3>
            <ul className="mt-6 space-y-3">
              {problems.map((p) => (
                <li
                  key={p}
                  className="flex gap-2 text-slate-700 text-sm leading-relaxed"
                >
                  <span className="text-red-400 shrink-0">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-green-100 bg-green-50/50 p-8">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              <Check className="h-5 w-5" />
              The solution
            </h3>
            <ul className="mt-6 space-y-3">
              {solutions.map((s) => (
                <li
                  key={s}
                  className="flex gap-2 text-slate-700 text-sm leading-relaxed"
                >
                  <span className="text-green-500 shrink-0">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
