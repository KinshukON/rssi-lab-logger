"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExperimentMeta, Reading } from "@/types";
import { loadExperiment, saveExperiment } from "@/lib/storage";
import { groupReadings } from "@/lib/compute";
import ExperimentMetaForm from "@/components/ExperimentMetaForm";
import ReadingForm from "@/components/ReadingForm";
import ReadingsTable from "@/components/ReadingsTable";
import AggregatesTable from "@/components/AggregatesTable";
import RssiChart from "@/components/RssiChart";
import { Trash2, FileText, Download, RotateCcw } from "lucide-react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [meta, setMeta] = useState<ExperimentMeta>({
    title: "Assignment 3.1 – RSSI Measurement",
    dateISO: new Date().toISOString(),
    band: "Unknown",
    unit: "m",
  });
  const [readings, setReadings] = useState<Reading[]>([]);

  // Load data on mount
  useEffect(() => {
    const data = loadExperiment();
    if (data) {
      setMeta(data.meta);
      setReadings(data.readings);
    }
    setLoaded(true);
  }, []);

  // Save data on change
  useEffect(() => {
    if (loaded) {
      saveExperiment({ meta, readings });
    }
  }, [meta, readings, loaded]);

  const handleAddReading = (reading: Reading) => {
    setReadings([...readings, reading]);
  };

  const handleDeleteReading = (id: string) => {
    setReadings(readings.filter((r) => r.id !== id));
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      setReadings([]);
      // keep meta mostly, maybe just reset date
      setMeta({ ...meta, dateISO: new Date().toISOString() });
    }
  };

  const handleCsvExport = () => {
    const headers = ["ReadingID", "Timestamp", "Distance_Meters", "RSSI_dBm", "Noise_dBm", "TxRate_Mbps", "Note"];
    const rows = readings.map(r => [
      r.id,
      r.createdAtISO,
      r.distanceM.toString(),
      r.rssiDbm.toString(),
      r.noiseDbm || "",
      r.txRateMbps || "",
      r.note || ""
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rssi_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!loaded) return <div className="p-10 text-center">Loading...</div>;

  const groups = groupReadings(readings);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">RSSI Lab Logger</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReset}
                className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors"
                title="Reset Experiment"
              >
                <RotateCcw size={20} />
              </button>
              <button
                onClick={handleCsvExport}
                className="text-gray-500 hover:text-blue-600 p-2 rounded-md transition-colors"
                title="Export CSV"
              >
                <Download size={20} />
              </button>
              <Link href="/report">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors">
                  <FileText size={16} />
                  <span>View Report</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Setup Section */}
        <section>
          <ExperimentMetaForm meta={meta} onUpdate={setMeta} />
        </section>

        {/* Measurement Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-6">
            <ReadingForm
              unit={meta.unit}
              onAddReading={handleAddReading}
              suggestedDistance={
                // Propose next distance based on simple heuristic (last + 1 or +5)? 
                // Actually maybe just leave blank or keep last.
                // Let's leave blank for now.
                undefined
              }
            />
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-md text-sm text-blue-800">
              <p className="font-semibold mb-1">How to measure on macOS:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Hold <kbd className="font-mono bg-blue-100 px-1 rounded">Option (⌥)</kbd> and click Wi-Fi icon.</li>
                <li>Look for <strong>RSSI: -xx dBm</strong>.</li>
                <li>Or run in Terminal: <br /><code className="bg-blue-100 px-1 rounded block mt-1 text-xs">/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I</code></li>
              </ol>
            </div>
          </div>

          {/* Right Column: Data & Vis */}
          <div className="lg:col-span-2 space-y-8">
            <AggregatesTable groups={groups} meta={meta} />
            <RssiChart groups={groups} meta={meta} />
            <ReadingsTable groups={groups} meta={meta} onDeleteReading={handleDeleteReading} />
          </div>
        </section>

      </main>
    </div>
  );
}
