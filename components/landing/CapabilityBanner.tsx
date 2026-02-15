"use client";

import { Info } from "lucide-react";

export default function CapabilityBanner() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mb-2 mt-4 sm:mt-6">
      <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 flex items-start gap-3 text-sm text-amber-900">
        <Info size={18} className="shrink-0 mt-0.5 text-amber-600" />
        <p>
          <strong>Web app:</strong> Cannot auto-measure RSSI — you enter values manually.{" "}
          <strong>Mac app:</strong> Can auto-measure via local <code className="bg-amber-100 px-1 rounded font-mono text-xs">airport -I</code>.
        </p>
      </div>
    </div>
  );
}
