"use client";

import Link from "next/link";
import { BarChart2 } from "lucide-react";

const mockData = [
  { dist: "1 m", rssi: "-42" },
  { dist: "3 m", rssi: "-55" },
  { dist: "5 m", rssi: "-62" },
  { dist: "8 m", rssi: "-71" },
  { dist: "10 m", rssi: "-78" },
];

export default function SamplePreview() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center">
          See it in action
        </h2>
        <p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
          A sample report shows aggregated data, charts, and commentary.
        </p>

        <div className="mt-16 max-w-2xl mx-auto">
          <div className="rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-slate-800">
                Sample Wi-Fi Health Report
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="text-xs font-medium text-slate-500 uppercase">
                Distance
              </div>
              <div className="text-xs font-medium text-slate-500 uppercase">
                Mean RSSI
              </div>
              {mockData.map(({ dist, rssi }) => (
                <span key={dist} className="contents">
                  <div className="text-sm font-mono">{dist}</div>
                  <div className="text-sm font-mono font-bold">{rssi} dBm</div>
                </span>
              ))}
            </div>
            <div className="h-24 flex items-end gap-2">
              {mockData.map(({ rssi }, i) => {
                const val = Math.abs(parseInt(rssi, 10));
                const h = Math.max(12, Math.min(80, (val - 40) * 1.5));
                return (
                  <div
                    key={i}
                    className="flex-1 bg-blue-500 rounded-t min-h-[4px] transition-all hover:bg-blue-600"
                    style={{ height: `${h}%` }}
                    title={`${rssi} dBm`}
                  />
                );
              })}
            </div>
            <p className="mt-4 text-xs text-slate-500 italic">
              Figure: Signal attenuation with distance
            </p>
            <Link
              href="/report"
              className="mt-6 inline-flex items-center justify-center w-full px-6 py-4 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              View Sample Report
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
