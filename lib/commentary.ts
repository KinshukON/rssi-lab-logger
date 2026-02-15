import { DistanceGroup } from "./compute";
import { ExperimentMeta } from "@/types";

export function generateCommentary(
    groups: DistanceGroup[],
    meta: ExperimentMeta
): string {
    if (groups.length < 2) {
        return "Insufficient data to generate a full commentary. Please record measurements at multiple distances (e.g., 1m, 3m, 5m) to observe the signal attenuation trend.";
    }

    const baseline = groups[0];
    const farthest = groups[groups.length - 1];
    const totalDrop = Math.abs(farthest.meanRssi - baseline.meanRssi).toFixed(1);
    const bandText = meta.band === "Unknown" ? "Wi-Fi" : meta.band;

    // Detect critical drop
    const weakSpots = groups.filter((g) => g.meanRssi < -70);
    const hasWeakSpots = weakSpots.length > 0;

    // Parts of the commentary to assemble
    const intro = `In this experiment, I measured the Received Signal Strength Indicator (RSSI) of the ${bandText} network at distances ranging from ${baseline.distanceM} m to ${farthest.distanceM} m. The results, as shown in the data table and chart, demonstrate a clear inverse relationship between distance and signal strength, consistent with the expected behavior of radio wave propagation in an indoor environment.`;

    const trend = `Starting from a baseline of ${baseline.meanRssi} dBm at ${baseline.distanceM} m, the signal strength attenuated by approximately ${totalDrop} dB as the distance increased to ${farthest.distanceM} m. This drop is not purely linear but follows a logarithmic trend characteristic of path loss models, though real-world fluctuations were observed. These variations from the theoretical ideal are likely due to multipath fading caused by reflections from walls, furniture, and the floor, as well as potential shadowing effects from obstructions in the line of sight.`;

    const impact = hasWeakSpots
        ? `Crucially, at distances where the RSSI dropped below -70 dBm (specifically around ${weakSpots[0].distanceM} m), the signal quality degraded to a level where throughput typically begins to suffer. In a practical scenario, readings in the -75 to -80 dBm range often result in noticeable latency, lower data rates, and increased packet retries, making reliable real-time communication (like voIP or video calls) difficult.`
        : `Throughout the measured range, the signal remained relatively strong (above -70 dBm), indicating good coverage for this specific testing area. However, if the distance were increased further, we would expect the RSSI to eventually fall into the -75 to -80 dBm range, where packet loss and retransmissions significantly impact network performance.`;

    const conclusion = `Overall, the data confirms that distance is a primary factor in signal attenuation. The standard deviation observed at each measurement point further highlights the time-varying nature of wireless channels, where even stationary devices experience slight fluctuations in received power due to environmental changes. This experiment validates the fundamental constraints of Wi-Fi connectivity and the necessity of adequate access point placement for consistent coverage.`;

    const fullText = `${intro} ${trend} ${impact} ${conclusion}`;

    // Word count check (simplistic split)
    const wordCount = fullText.split(/\s+/).length;

    // Attempt to trim or pad if absolutely necessary (though the template is designed to be ~180-220 words)
    // This is a safety valve.
    if (wordCount < 150) {
        return fullText + " Additionally, it is worth noting that interference from other nearby electronic devices or overlapping Wi-Fi networks could have contributed to the noise floor, further affecting the Signal-to-Noise Ratio (SNR) and the precise RSSI values recorded during this session.";
    }

    return fullText;
}
