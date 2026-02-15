"use client";

import { Footprints, PenLine, FileText } from "lucide-react";

const steps = [
  {
    icon: Footprints,
    title: "Step 1: Walk test",
    desc: "Record distance or room. Walk through your space and note where you are (1m, 2m, living room, etc.).",
    step: "1",
  },
  {
    icon: PenLine,
    title: "Step 2: Log RSSI",
    desc: "Option-click the Wi-Fi icon (macOS) or run airport -I in Terminal. Log the value into the app.",
    step: "2",
  },
  {
    icon: FileText,
    title: "Step 3: Generate report",
    desc: "Get a PDF-ready report with charts, averages, and recommendations in minutes.",
    step: "3",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center">
          How it works
        </h2>
        <p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
          Three simple steps from measurement to evidence.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, title, desc, step }) => (
            <div
              key={step}
              className="relative bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                {step}
              </span>
              <div className="rounded-xl bg-blue-50 p-4 w-fit mb-6">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
