export const M_TO_FT = 3.28084;

export function metersToFeet(m: number): number {
    return m * M_TO_FT;
}

export function feetToMeters(ft: number): number {
    return ft / M_TO_FT;
}

export function formatDistance(m: number, unit: "m" | "ft"): string {
    if (unit === "m") {
        return `${m.toFixed(2)} m`;
    } else {
        return `${metersToFeet(m).toFixed(2)} ft`;
    }
}
