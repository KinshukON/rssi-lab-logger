"use client";

import { ExperimentMeta } from "@/types";
import { useEffect, useState } from "react";

interface Props {
    meta: ExperimentMeta;
    onUpdate: (meta: ExperimentMeta) => void;
}

export default function ExperimentMetaForm({ meta, onUpdate }: Props) {
    const [formData, setFormData] = useState<ExperimentMeta>(meta);

    useEffect(() => {
        setFormData(meta);
    }, [meta]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        const newMeta = { ...formData, [name]: value };
        setFormData(newMeta);
        onUpdate(newMeta);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-1 rounded mr-2 text-xs">STEP 1</span>
                Experiment Setup
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Operator Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        placeholder="e.g. John Smith"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date & Time</label>
                    <input
                        type="datetime-local"
                        name="dateISO"
                        value={formData.dateISO.slice(0, 16)}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        placeholder="e.g. Living Room"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Band</label>
                        <select
                            name="band"
                            value={formData.band}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="Unknown">Unknown</option>
                            <option value="2.4GHz">2.4 GHz</option>
                            <option value="5GHz">5 GHz</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unit</label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="m">Meters (m)</option>
                            <option value="ft">Feet (ft)</option>
                        </select>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">AP Name / SSID (Optional)</label>
                    <input
                        type="text"
                        name="ssid"
                        value={formData.ssid || ""}
                        onChange={handleChange}
                        placeholder="e.g. MIT-GUEST"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}
