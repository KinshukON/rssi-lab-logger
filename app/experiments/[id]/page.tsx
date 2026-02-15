"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ExperimentMeta, Reading } from "@/types";
import { groupReadings } from "@/lib/compute";
import ExperimentMetaForm from "@/components/ExperimentMetaForm";
import ReadingForm from "@/components/ReadingForm";
import ReadingsTable from "@/components/ReadingsTable";
import AggregatesTable from "@/components/AggregatesTable";
import RssiChart from "@/components/RssiChart";
import { FileText, Download, RotateCcw } from "lucide-react";
import { getExperiment, updateExperiment, addReadings, deleteReading } from "@/lib/cloud/api";
import AuthButton from "@/components/auth/AuthButton";

const META_DEBOUNCE_MS = 600;

export default function ExperimentDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [meta, setMeta] = useState<ExperimentMeta | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loaded, setLoaded] = useState(false);
  const metaDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
      return;
    }
    if (user && id) {
      getExperiment(id)
        .then((data) => {
          if (data) {
            setMeta(data.meta);
            setReadings(data.readings);
          } else {
            router.replace("/experiments");
          }
        })
        .catch(() => router.replace("/experiments"))
        .finally(() => setLoaded(true));
    }
  }, [user, loading, id, router]);

  useEffect(() => {
    if (!loaded || !meta || !user) return;
    if (metaDebounceRef.current) clearTimeout(metaDebounceRef.current);
    metaDebounceRef.current = setTimeout(() => {
      metaDebounceRef.current = null;
      updateExperiment(id, meta).catch(console.error);
    }, META_DEBOUNCE_MS);
    return () => {
      if (metaDebounceRef.current) clearTimeout(metaDebounceRef.current);
    };
  }, [meta, loaded, user, id]);

  const handleAddReading = (reading: Reading) => {
    setReadings((prev) => [...prev, reading]);
    addReadings(id, [reading]).then((created) => {
      setReadings((prev) =>
        prev.map((r) => (r.id === reading.id ? created[0] : r))
      );
    }).catch(console.error);
  };

  const handleDeleteReading = (readingId: string) => {
    deleteReading(readingId).catch(console.error);
    setReadings((prev) => prev.filter((r) => r.id !== readingId));
  };

  const handleReset = () => {
    if (confirm("Reset all readings? This cannot be undone.")) {
      setReadings([]);
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
        r.distanceM,
        r.rssiDbm,
        r.noiseDbm || "",
        r.txRateMbps || "",
        r.note || "",
      ].join(",")
    );
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `rssi_${id}.csv`;
    link.click();
  };

  if (loading || !loaded || !meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const groups = groupReadings(readings);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/experiments" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <FileText size={20} />
              </div>
              <span className="text-xl font-bold text-slate-800">
                RSSI Lab Logger
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="text-slate-400 hover:text-red-500 p-2 rounded-full"
                title="Reset"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={handleCsvExport}
                className="text-slate-400 hover:text-blue-600 p-2 rounded-full"
                title="Export CSV"
              >
                <Download size={18} />
              </button>
              <Link href={`/report?experiment=${id}`}>
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <FileText size={16} />
                  View Report
                </button>
              </Link>
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section>
          <ExperimentMetaForm meta={meta} onUpdate={setMeta} />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-6 sticky top-24">
            <ReadingForm unit={meta.unit} onAddReading={handleAddReading} />
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl text-sm text-blue-900">
              <p className="font-bold mb-2">How to measure on macOS</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Option-click Wi-Fi icon → RSSI value</li>
                <li>
                  Or run{" "}
                  <code className="bg-slate-800 text-slate-200 px-1 rounded">
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
            <AggregatesTable groups={groups} meta={meta} />
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
