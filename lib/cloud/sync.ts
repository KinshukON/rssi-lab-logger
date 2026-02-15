import type { ExperimentMeta, Reading } from "@/types";
import { loadExperiment, saveExperiment } from "@/lib/storage";
import {
  listExperiments,
  getExperiment,
  createExperiment,
  updateExperiment,
  addReadings,
  deleteReading,
} from "@/lib/cloud/api";

const DEFAULT_META: ExperimentMeta = {
  title: "RSSI Measurement",
  dateISO: new Date().toISOString(),
  band: "Unknown",
  unit: "m",
};

/** Get the latest experiment or create one with DEFAULT_META */
export async function getOrCreateCurrentExperiment(): Promise<{
  id: string;
  meta: ExperimentMeta;
  readings: Reading[];
}> {
  const experiments = await listExperiments();
  if (experiments.length > 0) {
    const latest = experiments[0];
    return {
      id: latest.id,
      meta: latest.meta,
      readings: latest.readings,
    };
  }
  const id = await createExperiment(DEFAULT_META);
  return {
    id,
    meta: DEFAULT_META,
    readings: [],
  };
}

/** Upsert experiment meta (create or update) */
export async function upsertExperimentMeta(
  experimentId: string | null,
  meta: ExperimentMeta
): Promise<string> {
  if (experimentId) {
    await updateExperiment(experimentId, meta);
    return experimentId;
  }
  return createExperiment(meta);
}

/** Insert readings and return created readings with IDs */
export async function syncReadings(
  experimentId: string,
  readings: Reading[]
): Promise<Reading[]> {
  if (readings.length === 0) return [];
  const toInsert = readings.map((r) => ({
    createdAtISO: r.createdAtISO,
    distanceM: r.distanceM,
    rssiDbm: r.rssiDbm,
    noiseDbm: r.noiseDbm,
    txRateMbps: r.txRateMbps,
    note: r.note,
  }));
  return addReadings(experimentId, toInsert);
}

export async function removeReading(id: string): Promise<void> {
  await deleteReading(id);
}

/** Load initial data: from cloud if available, else from localStorage */
export async function loadInitialData(useCloud: boolean): Promise<{
  meta: ExperimentMeta;
  readings: Reading[];
  cloudExperimentId: string | null;
}> {
  if (!useCloud) {
    const data = loadExperiment();
    return {
      meta: data?.meta ?? DEFAULT_META,
      readings: data?.readings ?? [],
      cloudExperimentId: null,
    };
  }

  try {
    const { id, meta, readings } = await getOrCreateCurrentExperiment();
    return {
      meta,
      readings,
      cloudExperimentId: id,
    };
  } catch {
    const data = loadExperiment();
    return {
      meta: data?.meta ?? DEFAULT_META,
      readings: data?.readings ?? [],
      cloudExperimentId: null,
    };
  }
}

/** Cache to localStorage for offline fallback */
export function cacheToLocal(meta: ExperimentMeta, readings: Reading[]): void {
  saveExperiment({ meta, readings });
}
