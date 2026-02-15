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
  const [meta, setMeta] = useState<ExperimentMeta>({
    title: "RSSI Measurement",
    dateISO: new Date().toISOString(),
    band: "Unknown",
    unit: "m",
  });
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [loadingStatus, setLoadingStatus] = useState<string[]>(["Application mounted."]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const addLog = (msg: string) => setLoadingStatus(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  // Load data on mount
  useEffect(() => {
    let mounted = true;

    // Safety timeout
    const timer = setTimeout(() => {
      if (mounted && !loaded) {
        setLoadError("Loading timed out (5s). Check logs above.");
      }
    }, 5000);

    const init = async () => {
      try {
        await new Promise(r => setTimeout(r, 100)); // Give UI time to paint
        addLog("Starting initialization hook...");

        if (typeof window === 'undefined') {
          addLog("Error: window is undefined (SSR?)");
          return;
        }
        addLog("Window object found.");

        addLog("Reading localStorage...");
        let data;
        try {
          data = loadExperiment();
          addLog(`LocalStorage read complete. Data found: ${!!data}`);
        } catch (storageErr: any) {
          addLog(`LocalStorage Error: ${storageErr.message}`);
          throw storageErr;
        }

        if (data) {
          addLog("Parsing metadata...");
          setMeta(data.meta);
          addLog("Parsing readings...");
          setReadings(data.readings);
        } else {
          addLog("No existing data found. Using defaults.");
        }

        addLog("Setting loaded state to true...");
        setLoaded(true);
        addLog("Initialization complete.");
      } catch (e: any) {
        console.error(e);
        setLoadError(e.message || "Unknown error during initialization");
        addLog(`CRITICAL FAILURE: ${e.message}`);
      }
    };

    init();

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleDemoData = () => {
    if (readings.length > 0 && !confirm("Overwrite current data with demo data?")) return;

    const demoReadings: Reading[] = [
      { id: "1", createdAtISO: new Date().toISOString(), distanceM: 1, rssiDbm: -35, note: "Baseline" },
      { id: "2", createdAtISO: new Date().toISOString(), distanceM: 1, rssiDbm: -38 },
      { id: "3", createdAtISO: new Date().toISOString(), distanceM: 2, rssiDbm: -45 },
      { id: "4", createdAtISO: new Date().toISOString(), distanceM: 3, rssiDbm: -52 },
      { id: "5", createdAtISO: new Date().toISOString(), distanceM: 4, rssiDbm: -58 },
      { id: "6", createdAtISO: new Date().toISOString(), distanceM: 5, rssiDbm: -62, note: "Wall obstruction" },
      { id: "7", createdAtISO: new Date().toISOString(), distanceM: 6, rssiDbm: -68 },
      { id: "8", createdAtISO: new Date().toISOString(), distanceM: 8, rssiDbm: -72 },
      { id: "9", createdAtISO: new Date().toISOString(), distanceM: 10, rssiDbm: -78 },
      { id: "10", createdAtISO: new Date().toISOString(), distanceM: 12, rssiDbm: -82, note: "Packet loss started" },
    ];
    setReadings(demoReadings);
    setMeta({ ...meta, band: "5GHz", ssid: "MIT-Secure" });
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-red-200">
          <h3 className="text-red-600 font-bold text-lg mb-2">Initialization Error</h3>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
        <h2 className="text-xl font-bold mb-4">System Initializing... (v1.0.17)</h2>
        <div className="w-full max-w-2xl bg-black border border-green-9000 rounded p-4 h-96 overflow-y-auto shadow-inner">
          {loadingStatus.map((log, i) => (
            <div key={i} className="border-b border-green-900/30 py-1">{log}</div>
          ))}
          {loadError && (
            <div className="text-red-500 font-bold mt-2 pt-2 border-t border-red-900">
              ERROR: {loadError}
            </div>
          )}
        </div>
        <p className="mt-4 text-slate-500 text-xs">If this screen persists, please screenshot this log.</p>
      </div>
    );
  }

  const groups = groupReadings(readings);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-blue-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 bg-opacity-90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <FileText size={20} />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">RSSI Lab Logger</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDemoData}
                className="hidden sm:inline-flex text-xs font-semibold text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors"
              >
                Test with Demo Data
              </button>
              <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
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
              <Link href="/report">
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all shadow-sm hover:shadow active:scale-95">
                  <FileText size={16} />
                  <span>View Report</span>
                </button>
              </Link>
              <a
                href="https://github.com/KinshukON/rssi-lab-logger/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all shadow-sm hover:shadow active:scale-95 ml-2"
              >
                <span> Download App</span>
              </a>
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
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-6 sticky top-24">
            <ReadingForm
              unit={meta.unit}
              onAddReading={handleAddReading}
            />
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl text-sm text-blue-900 shadow-sm">
              <p className="font-bold mb-2 flex items-center">
                <span className="mr-2 text-lg">ℹ️</span> How to measure on macOS:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-1">
                <li>Hold <kbd className="font-mono bg-blue-200 px-1.5 py-0.5 rounded text-blue-800 border border-blue-300">Option (⌥)</kbd> and click the Wi-Fi icon in your top menu bar.</li>
                <li>Look for the line: <strong className="font-mono bg-white px-1 rounded">RSSI: -xx dBm</strong>.</li>
                <li>Alternative (Terminal): <br /><code className="bg-slate-800 text-slate-200 px-2 py-1 rounded block mt-1.5 text-xs font-mono overflow-x-auto whitespace-pre">airport -I</code></li>
              </ol>
            </div>
          </div>

          {/* Right Column: Data & Vis */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Live Visualization</h3>
              <RssiChart groups={groups} meta={meta} />
            </div>

            <AggregatesTable groups={groups} meta={meta} />
            <ReadingsTable groups={groups} meta={meta} onDeleteReading={handleDeleteReading} />
          </div>
        </section>

      </main>
    </div>
  );
}
