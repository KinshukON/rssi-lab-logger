"use client";

import { useState, useEffect } from "react";
import { Reading } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { metersToFeet, feetToMeters } from "@/lib/units";

interface Props {
    unit: "m" | "ft";
    onAddReading: (reading: Reading) => void;
    suggestedDistance?: number;
}

export default function ReadingForm({ unit, onAddReading, suggestedDistance }: Props) {
    // Local state for form inputs (as strings for easy typing)
    const [distance, setDistance] = useState<string>(suggestedDistance ? suggestedDistance.toString() : "");
    const [rssi, setRssi] = useState<string>("");
    const [noise, setNoise] = useState<string>("");
    const [txRate, setTxRate] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const [isElectron, setIsElectron] = useState(false);

    useEffect(() => {
        // Debug logging for Electron detection
        if (typeof window !== 'undefined') {
            const api = (window as any).electronAPI;
            console.log("Checking for electronAPI:", api);
            if (api?.isElectron) {
                console.log("Electron detected!");
                setIsElectron(true);
            } else {
                console.log("Electron NOT detected.");
            }
        }
    }, []);

    const handleAutoMeasure = async () => {
        if (!window.electronAPI) return;
        try {
            setError(null);
            // Show some loading state if desired, or just wait
            const rssiVal = await window.electronAPI.getRssi();
            setRssi(rssiVal.toString());
        } catch (err: any) {
            console.error(err);
            setError("Failed to get reading from airport utility. Is Wi-Fi on?");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        const distVal = parseFloat(distance);
        const rssiVal = parseInt(rssi);

        if (isNaN(distVal) || distVal <= 0) {
            setError("Distance must be a positive number.");
            return;
        }

        if (isNaN(rssiVal) || rssiVal >= -10 || rssiVal <= -100) {
            setError("RSSI must be a valid negative integer (e.g. -30 to -99).");
            return;
        }

        // Convert distance to meters if needed
        const distanceM = unit === "m" ? distVal : feetToMeters(distVal);

        const newReading: Reading = {
            id: uuidv4(), // We'll just generate a random string ID
            createdAtISO: new Date().toISOString(),
            distanceM,
            rssiDbm: rssiVal,
            noiseDbm: noise ? parseInt(noise) : undefined,
            txRateMbps: txRate ? parseInt(txRate) : undefined,
            note: note || undefined,
        };

        onAddReading(newReading);

        // Reset fields (keep distance for convenience if measuring multiple samples at same spot)
        setRssi("");
        setNoise("");
        setTxRate("");
        setNote("");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <span className="bg-blue-100 text-blue-600 p-1 rounded mr-2 text-xs">STEP 2</span>
                    Add Measurement
                </h3>
                {isElectron && (
                    <button
                        type="button"
                        onClick={handleAutoMeasure}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold hover:bg-green-200 transition-colors flex items-center"
                    >
                        ⚡️ Auto Measure
                    </button>
                )}
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">

                <div className="col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Dis ({unit})
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="0.0"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        required
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        RSSI (dBm)
                    </label>
                    <input
                        type="number"
                        value={rssi}
                        onChange={(e) => setRssi(e.target.value)}
                        placeholder="-50"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        required
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Noise
                    </label>
                    <input
                        type="number"
                        value={noise}
                        onChange={(e) => setNoise(e.target.value)}
                        placeholder="-90"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Rate
                    </label>
                    <input
                        type="number"
                        value={txRate}
                        onChange={(e) => setTxRate(e.target.value)}
                        placeholder="Mbps"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                </div>

                <div className="col-span-2 md:col-span-4 lg:col-span-1 mt-2 lg:mt-0">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm"
                    >
                        Add
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-3 p-2 bg-red-50 text-xs text-red-600 font-medium rounded border border-red-100 animate-pulse">
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
}
