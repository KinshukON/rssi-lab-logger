import { ExperimentData, ExperimentMeta, Reading } from '@/types';

const STORAGE_KEY = 'rssi-lab-logger-v1';

const DEFAULT_META: ExperimentMeta = {
    title: "Assignment 3.1 – RSSI Measurement of a Laptop (WiFi)",
    dateISO: new Date().toISOString(),
    band: "Unknown",
    unit: "m",
};

export function loadExperiment(): ExperimentData {
    if (typeof window === 'undefined') {
        return { meta: DEFAULT_META, readings: [] };
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { meta: DEFAULT_META, readings: [] };
        }
        const data = JSON.parse(raw) as ExperimentData;
        // Basic validation/migration could go here
        return {
            meta: { ...DEFAULT_META, ...data.meta }, // Ensure defaults
            readings: Array.isArray(data.readings) ? data.readings : [],
        };
    } catch (e) {
        console.error("Failed to load experiment data", e);
        return { meta: DEFAULT_META, readings: [] };
    }
}

export function saveExperiment(data: ExperimentData): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save experiment data", e);
    }
}

export function clearExperiment(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}
