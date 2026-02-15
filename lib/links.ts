/**
 * External and internal links for the application.
 * Override GITHUB_RELEASES_URL via env NEXT_PUBLIC_GITHUB_RELEASES_URL if needed.
 */
export const GITHUB_RELEASES_URL =
  process.env.NEXT_PUBLIC_GITHUB_RELEASES_URL ||
  "https://github.com/KinshukON/rssi-lab-logger/releases/latest";

export const GITHUB_REPO_URL =
  process.env.NEXT_PUBLIC_GITHUB_REPO_URL ||
  "https://github.com/KinshukON/rssi-lab-logger";
