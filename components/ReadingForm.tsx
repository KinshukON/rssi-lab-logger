"use client";

import { useState } from "react";
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Measurement</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                        Distance ({unit})
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="0.0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                        RSSI (dBm)
                    </label>
                    <input
                        type="number"
                        value={rssi}
                        onChange={(e) => setRssi(e.target.value)}
                        placeholder="-50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                        Noise (Opt.)
                    </label>
                    <input
                        type="number"
                        value={noise}
                        onChange={(e) => setNoise(e.target.value)}
                        placeholder="-90"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                        Tx Rate (Opt.)
                    </label>
                    <input
                        type="number"
                        value={txRate}
                        onChange={(e) => setTxRate(e.target.value)}
                        placeholder="Mbps"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                    >
                        Add Reading
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-3 text-sm text-red-600 font-medium">
                    Error: {error}
                </div>
            )}
        </div>
    );
}
