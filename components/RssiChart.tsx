"use client";

import { DistanceGroup } from "@/lib/compute";
import { formatDistance } from "@/lib/units";
import { ExperimentMeta } from "@/types";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label
} from "recharts";

interface Props {
    groups: DistanceGroup[];
    meta: ExperimentMeta;
}

export default function RssiChart({ groups, meta }: Props) {
    if (groups.length < 2) return null;

    // Transform data for chart
    const data = groups.map(g => ({
        displayDistance: meta.unit === "m" ? g.distanceM : g.distanceM * 3.28084,
        rssi: g.meanRssi,
        stdDev: g.stdDevRssi
    }));

    const xLabel = `Distance (${meta.unit === "m" ? "m" : "ft"})`;

    return (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 print:shadow-none print:border-black">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Signal Attenuation Graph</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="displayDistance"
                            type="number"
                            domain={['dataMin', 'dataMax']} // Ensure x-axis scales to data
                            padding={{ left: 10, right: 10 }}
                        >
                            <Label value={xLabel} offset={-10} position="insideBottom" />
                        </XAxis>
                        <YAxis domain={[-100, -20]} label={{ value: 'RSSI (dBm)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip
                            formatter={(value: number | string | Array<number | string> | undefined) => [`${value} dBm`, 'Mean RSSI']}
                            labelFormatter={(label: any) => `Distance: ${Number(label).toFixed(1)} ${meta.unit}`}
                        />
                        <Line
                            type="monotone"
                            dataKey="rssi"
                            stroke="#2563eb"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                            name="Mean RSSI"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center italic">
                Figure 1: Mean RSSI (dBm) measured at increasing distances.
            </p>
        </div>
    );
}
