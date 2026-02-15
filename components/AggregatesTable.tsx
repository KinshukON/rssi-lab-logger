"use client";

import { DistanceGroup } from "@/lib/compute";
import { formatDistance } from "@/lib/units";
import { ExperimentMeta } from "@/types";
import clsx from 'clsx';

interface Props {
    groups: DistanceGroup[];
    meta: ExperimentMeta;
}

export default function AggregatesTable({ groups, meta }: Props) {
    if (groups.length === 0) return null;

    return (
        <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white print:border-black print:shadow-none">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 print:bg-transparent print:border-black">
                <h3 className="text-lg font-semibold text-gray-800">Aggregated Results</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 print:divide-black">
                    <thead className="bg-gray-50 print:bg-transparent">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black">
                                Distance
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black">
                                Samples
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black">
                                Mean RSSI
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black">
                                Std Dev
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black">
                                Delta (dB)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black">
                                Quality
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 print:divide-black">
                        {groups.map((group) => (
                            <tr key={group.distanceM}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatDistance(group.distanceM, meta.unit)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {group.sampleCount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                    {group.meanRssi.toFixed(1)} dBm
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ±{group.stdDevRssi?.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {group.deltaFromBaseline === 0 ? "-" : `${group.deltaFromBaseline} dB`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <span className={clsx(
                                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                        group.qualityLabel === "Excellent" && "bg-green-100 text-green-800 print:bg-transparent print:text-black",
                                        group.qualityLabel === "Good" && "bg-blue-100 text-blue-800 print:bg-transparent print:text-black",
                                        group.qualityLabel === "Fair" && "bg-yellow-100 text-yellow-800 print:bg-transparent print:text-black",
                                        group.qualityLabel === "Weak" && "bg-orange-100 text-orange-800 print:bg-transparent print:text-black",
                                        group.qualityLabel === "Unusable" && "bg-red-100 text-red-800 print:bg-transparent print:text-black",
                                    )}>
                                        {group.qualityLabel}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
