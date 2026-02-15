"use client";

import { DistanceGroup } from "@/lib/compute";
import { formatDistance } from "@/lib/units";
import { ExperimentMeta, Reading } from "@/types";
import { Trash2 } from "lucide-react";

interface Props {
    groups: DistanceGroup[];
    meta: ExperimentMeta;
    onDeleteReading: (id: string) => void;
}

export default function ReadingsTable({ groups, meta, onDeleteReading }: Props) {
    if (groups.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 italic border rounded-lg mt-6 bg-gray-50">
                No readings recorded yet. Add your first measurement above.
            </div>
        );
    }

    return (
        <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">Raw Measurements</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Distance
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RSSI (dBm)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Noise / Rate
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {groups.map((group) => (
                            group.readings.map((reading, idx) => (
                                <tr key={reading.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {/* Only show distance for first item in group for cleanliness */}
                                        {idx === 0 ? formatDistance(group.distanceM, meta.unit) : ""}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                        {reading.rssiDbm} <span className="text-gray-400 font-normal">dBm</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(reading.createdAtISO).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {reading.noiseDbm ? `N: ${reading.noiseDbm} ` : ""}
                                        {reading.txRateMbps ? `Rate: ${reading.txRateMbps} Mbps` : ""}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => onDeleteReading(reading.id)}
                                            className="text-red-600 hover:text-red-900 focus:outline-none"
                                            title="Delete Reading"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
