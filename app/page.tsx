"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Reading } from "@/types";
import { useExperimentData } from "@/lib/use-experiment-data";
import { groupReadings } from "@/lib/compute";
import ExperimentMetaForm from "@/components/ExperimentMetaForm";
import ReadingForm from "@/components/ReadingForm";
import ReadingsTable from "@/components/ReadingsTable";
import AggregatesTable from "@/components/AggregatesTable";
import RssiChart from "@/components/RssiChart";
import { FileText, Download, RotateCcw, Cloud, HardDrive } from "lucide-react";
import { GITHUB_RELEASES_URL } from "@/lib/links";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthButton from "@/components/auth/AuthButton";
import SyncStatusBanner from "@/components/banner/SyncStatusBanner";

export default function Home() {
  const { user } = useAuth();
  const [isElectron, setIsElectron] = useState(false);
  const {
    meta,
    setMeta,
    readings,
    setReadings,
    handleAddReading,
    handleDeleteReading,
    loaded,
    loadError,
    isCloudMode,
    syncOffline,
    setSyncOffline,
  } = useExperimentData();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).electronAPI?.isElectron) {
      setIsElectron(true);
    }
  }, []);

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      setReadings([]);
      setMeta({ ...meta, dateISO: new Date().toISOString() });
    }
  };

  const handleCsvExport = () => {
    const headers = [
      "ReadingID",
      "Timestamp",
      "Distance_Meters",
      "RSSI_dBm",
      "Noise_dBm",
      "TxRate_Mbps",
      "Note",
    ];
    const rows = readings.map((r) =>
      [
        r.id,
        r.createdAtISO,
        r.distanceM.toString(),
        r.rssiDbm.toString(),
        r.noiseDbm || "",
        r.txRateMbps || "",
        r.note || "",
      ].join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `rssi_data_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDemoData = () => {
    if (readings.length > 0 && !confirm("Overwrite current data with demo data?"))
      return;
    const demoReadings: Reading[] = [
      {
        id: "1",
        createdAtISO: new Date().toISOString(),
        distanceM: 1,
        rssiDbm: -35,
        note: "Baseline",
      },
      {
        id: "2",
        createdAtISO: new Date().toISOString(),
        distanceM: 1,
        rssiDbm: -38,
      },
      {
        id: "3",
        createdAtISO: new Date().toISOString(),
        distanceM: 2,
        rssiDbm: -45,
      },
      {
        id: "4",
        createdAtISO: new Date().toISOString(),
        distanceM: 3,
        rssiDbm: -52,
      },
      {
        id: "5",
        createdAtISO: new Date().toISOString(),
        distanceM: 4,
        rssiDbm: -58,
      },
      {
        id: "6",
        createdAtISO: new Date().toISOString(),
        distanceM: 5,
        rssiDbm: -62,
        note: "Wall obstruction",
      },
      {
        id: "7",
        createdAtISO: new Date().toISOString(),
        distanceM: 6,
        rssiDbm: -68,
      },
      {
        id: "8",
        createdAtISO: new Date().toISOString(),
        distanceM: 8,
        rssiDbm: -72,
      },
      {
        id: "9",
        createdAtISO: new Date().toISOString(),
        distanceM: 10,
        rssiDbm: -78,
      },
      {
        id: "10",
        createdAtISO: new Date().toISOString(),
        distanceM: 12,
        rssiDbm: -82,
        note: "Packet loss started",
      },
    ];
    setReadings(demoReadings);
    setMeta({ ...meta, band: "5GHz", ssid: "MIT-Secure" });
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-red-200">
          <h3 className="text-red-600 font-bold text-lg mb-2">
            Initialization Error
          </h3>
          <p className="text-slate-700 mb-4">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-green-400 p-10 font-mono text-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4" />
        <h2 className="text-xl font-bold mb-4">Loading...</h2>
      </div>
    );
  }

  const groups = groupReadings(readings);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-blue-100">
      <SyncStatusBanner show={syncOffline} onDismiss={() => setSyncOffline(false)} />
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                {isCloudMode ? (
                  <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded">
                    <Cloud size={14} />
                    Cloud
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    <HardDrive size={14} />
                    Local
                  </span>
                )}
              </div>
              <button
                onClick={handleDemoData}
                className="hidden sm:inline-flex text-xs font-semibold text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors"
              >
                Test with Demo Data
              </button>
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />
              <button
                onClick={handleReset}
                className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="Reset Experiment"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={handleCsvExport}
                className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                title="Export CSV"
              >
                <Download size={18} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/report">
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all shadow-sm hover:shadow active:scale-95">
                  <FileText size={16} />
                  <span>View Report</span>
                </button>
              </Link>
              {!isElectron && (
                <a
                  href={GITHUB_RELEASES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all shadow-sm hover:shadow active:scale-95"
                >
                  <span>Download App</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section>
          <ExperimentMetaForm meta={meta} onUpdate={setMeta} />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-6 sticky top-24">
            <ReadingForm unit={meta.unit} onAddReading={handleAddReading} />
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl text-sm text-blue-900 shadow-sm">
              <p className="font-bold mb-2 flex items-center">
                <span className="mr-2 text-lg">ℹ️</span> How to measure on macOS:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-1">
                <li>
                  Hold{" "}
                  <kbd className="font-mono bg-blue-200 px-1.5 py-0.5 rounded text-blue-800 border border-blue-300">
                    Option (⌥)
                  </kbd>{" "}
                  and click the Wi-Fi icon in your top menu bar.
                </li>
                <li>
                  Look for the line:{" "}
                  <strong className="font-mono bg-white px-1 rounded">
                    RSSI: -xx dBm
                  </strong>
                  .
                </li>
                <li>
                  Alternative (Terminal): <br />
                  <code className="bg-slate-800 text-slate-200 px-2 py-1 rounded block mt-1.5 text-xs font-mono overflow-x-auto whitespace-pre">
                    airport -I
                  </code>
                </li>
              </ol>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Live Visualization
              </h3>
              <RssiChart groups={groups} meta={meta} />
            </div>
            <AggregatesTable
              groups={groups}
              meta={meta}
            />
            <ReadingsTable
              groups={groups}
              meta={meta}
              onDeleteReading={handleDeleteReading}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
