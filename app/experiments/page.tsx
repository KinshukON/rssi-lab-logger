"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { listExperiments } from "@/lib/cloud/api";
import type { ExperimentMeta } from "@/types";
type ExperimentItem = {
  id: string;
  meta: ExperimentMeta;
  readingsCount: number;
};

export default function ExperimentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [experiments, setExperiments] = useState<ExperimentItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
      return;
    }
    if (user) {
      listExperiments()
        .then((data) =>
          setExperiments(
            data.map((e) => ({
              id: e.id,
              meta: e.meta,
              readingsCount: e.readings.length,
            }))
          )
        )
        .catch(() => setExperiments([]))
        .finally(() => setLoadingList(false));
    }
  }, [user, loading, router]);

  const handleCreateNew = async () => {
    if (!user) return;
    setCreating(true);
    try {
      const { createExperiment } = await import("@/lib/cloud/api");
      const id = await createExperiment({
        title: "New RSSI Experiment",
        dateISO: new Date().toISOString(),
        band: "Unknown",
        unit: "m",
      });
      router.push(`/experiments/${id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  if (loading || (user && loadingList)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Logger
          </Link>
        </div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Experiments</h1>
          <button
            onClick={handleCreateNew}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            New experiment
          </button>
        </div>

        {experiments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h2 className="text-lg font-semibold text-slate-700 mb-2">
              No experiments yet
            </h2>
            <p className="text-slate-500 mb-6">
              Create your first experiment to start measuring RSSI.
            </p>
            <button
              onClick={handleCreateNew}
              disabled={creating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              Create experiment
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {experiments.map((exp) => (
              <Link
                key={exp.id}
                href={`/experiments/${exp.id}`}
                className="block bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <h3 className="font-semibold text-slate-900 truncate">
                  {exp.meta?.title || "Untitled experiment"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {exp.readingsCount} reading
                  {exp.readingsCount !== 1 ? "s" : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
