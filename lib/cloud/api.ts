import { createClient } from "@/lib/supabase/browser";
import type { ExperimentMeta, Reading } from "@/types";

export type CloudExperiment = {
  id: string;
  meta: ExperimentMeta;
  readings: Reading[];
};

function mapRowToReading(row: {
  id: string;
  created_at_iso: string;
  distance_m: number;
  rssi_dbm: number;
  noise_dbm: number | null;
  tx_rate_mbps: number | null;
  note: string | null;
}): Reading {
  return {
    id: row.id,
    createdAtISO: row.created_at_iso,
    distanceM: row.distance_m,
    rssiDbm: row.rssi_dbm,
    noiseDbm: row.noise_dbm ?? undefined,
    txRateMbps: row.tx_rate_mbps ?? undefined,
    note: row.note ?? undefined,
  };
}

export async function listExperiments(): Promise<CloudExperiment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("experiments")
    .select(`
      id,
      meta,
      readings (
        id,
        created_at_iso,
        distance_m,
        rssi_dbm,
        noise_dbm,
        tx_rate_mbps,
        note
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((e) => ({
    id: e.id,
    meta: (e.meta ?? {}) as ExperimentMeta,
    readings: (e.readings ?? []).map(mapRowToReading),
  }));
}

export async function getExperiment(id: string): Promise<CloudExperiment | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("experiments")
    .select(`
      id,
      meta,
      readings (
        id,
        created_at_iso,
        distance_m,
        rssi_dbm,
        noise_dbm,
        tx_rate_mbps,
        note
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    meta: (data.meta ?? {}) as ExperimentMeta,
    readings: (data.readings ?? []).map(mapRowToReading),
  };
}

export async function createExperiment(meta: ExperimentMeta): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("experiments")
    .insert({
      user_id: user.id,
      meta,
    })
    .select("id")
    .single();

  if (error) throw error;
  if (!data?.id) throw new Error("Failed to create experiment");
  return data.id;
}

export async function updateExperiment(id: string, meta: ExperimentMeta): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("experiments")
    .update({ meta })
    .eq("id", id);

  if (error) throw error;
}

export async function addReadings(
  experimentId: string,
  readings: Array<Omit<Reading, "id"> | Reading>
): Promise<Reading[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const rows = readings.map((r) => ({
    experiment_id: experimentId,
    user_id: user.id,
    created_at_iso: r.createdAtISO,
    distance_m: r.distanceM,
    rssi_dbm: r.rssiDbm,
    noise_dbm: r.noiseDbm ?? null,
    tx_rate_mbps: r.txRateMbps ?? null,
    note: r.note ?? null,
  }));

  const { data, error } = await supabase
    .from("readings")
    .insert(rows)
    .select("id, created_at_iso, distance_m, rssi_dbm, noise_dbm, tx_rate_mbps, note");

  if (error) throw error;

  return (data ?? []).map((row, i) => {
    const r = readings[i];
    return {
      id: row.id,
      createdAtISO: row.created_at_iso,
      distanceM: row.distance_m,
      rssiDbm: row.rssi_dbm,
      noiseDbm: row.noise_dbm ?? undefined,
      txRateMbps: row.tx_rate_mbps ?? undefined,
      note: row.note ?? undefined,
    };
  });
}

export async function deleteReading(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("readings").delete().eq("id", id);
  if (error) throw error;
}
