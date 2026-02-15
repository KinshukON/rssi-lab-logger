"use client";

import { useEffect, useState } from "react";
import { ExperimentMeta, Reading } from "@/types";
import { loadExperiment } from "@/lib/storage";
import { groupReadings } from "@/lib/compute";
import ReportView from "@/components/ReportView";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export default function ReportPage() {
    const [loaded, setLoaded] = useState(false);
    const [meta, setMeta] = useState<ExperimentMeta | null>(null);
    const [readings, setReadings] = useState<Reading[]>([]);

    useEffect(() => {
        const data = loadExperiment();
        if (data) {
            setMeta(data.meta);
            setReadings(data.readings);
        }
        setLoaded(true);
    }, []);

    if (!loaded) return null;
    if (!meta) return <div>No data found.</div>;

    const groups = groupReadings(readings);

    return (
        <div className="min-h-screen bg-white">
            {/* No-print control bar */}
            <div className="print:hidden bg-gray-900 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center text-gray-300 hover:text-white transition-colors">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Logger
                </Link>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400 hidden sm:inline">
                        Use browser &quot;Print to PDF&quot;
                    </span>
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors"
                    >
                        <Printer size={18} className="mr-2" />
                        Print / Save PDF
                    </button>
                </div>
            </div>

            <ReportView meta={meta} groups={groups} />
        </div>
    );
}
