"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import type { ExperimentMeta, Reading } from "@/types";
import { loadExperiment, saveExperiment } from "@/lib/storage";
import {
  loadInitialData,
  upsertExperimentMeta,
  syncReadings,
  removeReading,
  cacheToLocal,
} from "@/lib/cloud/sync";

const META_DEBOUNCE_MS = 600;

export function useExperimentData() {
  const { user, cloudMode, loading: authLoading } = useAuth();
  const [meta, setMeta] = useState<ExperimentMeta>({
    title: "RSSI Measurement",
    dateISO: new Date().toISOString(),
    band: "Unknown",
    unit: "m",
  });
  const [readings, setReadings] = useState<Reading[]>([]);
  const [cloudExperimentId, setCloudExperimentId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [syncOffline, setSyncOffline] = useState(false);
  const metaDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (typeof window === "undefined") return;

      try {
        const useCloud = !!user && cloudMode;
        const { meta: m, readings: r, cloudExperimentId: cid } = await loadInitialData(
          useCloud
        );
        if (mounted) {
          setMeta(m);
          setReadings(r);
          setCloudExperimentId(cid);
        }
      } catch (e) {
        if (mounted) {
          setSyncOffline(true);
          const data = loadExperiment();
          if (data) {
            setMeta(data.meta);
            setReadings(data.readings);
          }
        }
      } finally {
        if (mounted) setLoaded(true);
      }
    };

    if (!authLoading) {
      init();
    }

    return () => {
      mounted = false;
    };
  }, [user?.id, cloudMode, authLoading]);

  useEffect(() => {
    if (!loaded || !user || !cloudMode) return;

    if (metaDebounceRef.current) clearTimeout(metaDebounceRef.current);
    metaDebounceRef.current = setTimeout(() => {
      metaDebounceRef.current = null;
      upsertExperimentMeta(cloudExperimentId, meta)
        .then((id) => {
          setCloudExperimentId(id);
        })
        .catch(() => setSyncOffline(true));
    }, META_DEBOUNCE_MS);

    return () => {
      if (metaDebounceRef.current) clearTimeout(metaDebounceRef.current);
    };
  }, [meta, loaded, user, cloudMode, cloudExperimentId]);

  useEffect(() => {
    if (loaded) {
      saveExperiment({ meta, readings });
    }
  }, [meta, readings, loaded]);

  useEffect(() => {
    if (loaded && (user && cloudMode)) {
      cacheToLocal(meta, readings);
    }
  }, [meta, readings, loaded, user, cloudMode]);

  const handleAddReading = useCallback(
    async (reading: Reading) => {
      setReadings((prev) => [...prev, reading]);

      if (user && cloudMode) {
        try {
          let expId = cloudExperimentId;
          if (!expId) {
            expId = await upsertExperimentMeta(null, meta);
            setCloudExperimentId(expId);
          }
          const created = await syncReadings(expId, [reading]);
          setReadings((prev) =>
            prev.map((r) => (r.id === reading.id ? created[0] : r))
          );
        } catch {
          setSyncOffline(true);
        }
      }
    },
    [user, cloudMode, cloudExperimentId, meta]
  );

  const handleDeleteReading = useCallback(
    async (id: string) => {
      if (user && cloudMode) {
        try {
          await removeReading(id);
        } catch {
          setSyncOffline(true);
        }
      }
      setReadings((prev) => prev.filter((r) => r.id !== id));
    },
    [user, cloudMode]
  );

  return {
    meta,
    setMeta,
    readings,
    setReadings,
    handleAddReading,
    handleDeleteReading,
    loaded,
    loadError,
    isCloudMode: !!user && cloudMode,
    syncOffline,
    setSyncOffline,
  };
}
