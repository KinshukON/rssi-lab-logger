const CLOUD_MODE_KEY = "rssi-lab-logger-cloud-mode";

export function getCloudModePreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(CLOUD_MODE_KEY);
    return stored === "true";
  } catch {
    return false;
  }
}

export function setCloudModePreference(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLOUD_MODE_KEY, String(value));
  } catch {
    // ignore
  }
}
