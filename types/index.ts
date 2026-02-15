export type ExperimentMeta = {
  title: string; // default: "RSSI Measurement of a Laptop (WiFi)"
  name?: string;
  dateISO: string;
  location?: string;
  band: "2.4GHz" | "5GHz" | "Unknown";
  ssid?: string;
  notes?: string;
  unit: "m" | "ft";
};

export type Reading = {
  id: string;
  createdAtISO: string;
  distanceM: number; // canonical meters
  rssiDbm: number;   // negative integer
  noiseDbm?: number;
  txRateMbps?: number;
  note?: string;
};

export type ExperimentData = {
  meta: ExperimentMeta;
  readings: Reading[];
};
