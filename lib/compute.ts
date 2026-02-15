import { Reading } from "@/types";

export type DistanceGroup = {
    distanceM: number;
    readings: Reading[];
    meanRssi: number;
    stdDevRssi?: number;
    sampleCount: number;
    qualityLabel: "Excellent" | "Good" | "Fair" | "Weak" | "Unusable";
    deltaFromBaseline?: number;
};

export function getQualityLabel(rssi: number): DistanceGroup["qualityLabel"] {
    if (rssi >= -50) return "Excellent";
    if (rssi >= -60) return "Good";
    if (rssi >= -70) return "Fair";
    if (rssi >= -80) return "Weak";
    return "Unusable";
}

export function groupReadings(readings: Reading[]): DistanceGroup[] {
    const groups: Record<number, Reading[]> = {};

    readings.forEach((r) => {
        // Group by exact distance entered (or rounded if too precise, but user entry usually discrete)
        const d = r.distanceM;
        if (!groups[d]) groups[d] = [];
        groups[d].push(r);
    });

    const distances = Object.keys(groups)
        .map(Number)
        .sort((a, b) => a - b);

    let baselineRssi: number | undefined = undefined;

    return distances.map((d, index) => {
        const rs = groups[d];
        const sum = rs.reduce((acc, curr) => acc + curr.rssiDbm, 0);
        const mean = sum / rs.length;

        // Std dev
        const variance = rs.reduce((acc, curr) => acc + Math.pow(curr.rssiDbm - mean, 2), 0) / rs.length;
        const stdDev = Math.sqrt(variance);

        if (index === 0) {
            baselineRssi = mean;
        }

        return {
            distanceM: d,
            readings: rs,
            meanRssi: Number(mean.toFixed(1)), // 1 decimal place
            stdDevRssi: Number(stdDev.toFixed(2)),
            sampleCount: rs.length,
            qualityLabel: getQualityLabel(mean),
            deltaFromBaseline: baselineRssi !== undefined ? Number((mean - baselineRssi).toFixed(1)) : 0,
        };
    });
}
