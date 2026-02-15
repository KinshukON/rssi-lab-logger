"use client";

import { Home, Briefcase, Wrench } from "lucide-react";

const useCases = [
  {
    icon: Home,
    title: "Home owner",
    items: [
      "Optimize router placement before buying extenders",
      "Plan mesh system placement with data",
      "Validate upgrades — prove the new router is better",
    ],
  },
  {
    icon: Briefcase,
    title: "Remote worker",
    items: [
      "Measure office Wi-Fi for SLA discussions",
      "Document home office signal before support calls",
      "Compare wired vs wireless speeds at different spots",
    ],
  },
  {
    icon: Wrench,
    title: "Installer / MSP",
    items: [
      "Generate evidence reports for clients",
      "Before/after documentation",
      "Professional PDF outputs for handoff",
    ],
  },
];

export default function UseCases() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center">
          Who it&apos;s for
        </h2>
        <p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
          From home optimization to professional installs.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {useCases.map(({ icon: Icon, title, items }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="rounded-xl bg-slate-100 p-4 w-fit mb-6">
                <Icon className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <ul className="mt-4 space-y-2 text-slate-600 text-sm">
                {items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-blue-500 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
