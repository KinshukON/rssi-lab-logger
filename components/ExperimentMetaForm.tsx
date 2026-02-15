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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Experiment Metadata</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experiment Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student / Researcher Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                    <input
                        type="datetime-local"
                        name="dateISO"
                        // truncated to minutes for input compatibility
                        value={formData.dateISO.slice(0, 16)}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        placeholder="e.g. Living Room, Building 4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wi-Fi Band</label>
                    <select
                        name="band"
                        value={formData.band}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="Unknown">Unknown</option>
                        <option value="2.4GHz">2.4 GHz</option>
                        <option value="5GHz">5 GHz</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SSID (Optional)</label>
                    <input
                        type="text"
                        name="ssid"
                        value={formData.ssid || ""}
                        onChange={handleChange}
                        placeholder="Network Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Measurement Unit</label>
                    <div className="flex items-center space-x-4 mt-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="unit"
                                value="m"
                                checked={formData.unit === "m"}
                                onChange={handleChange}
                                className="mr-2 text-blue-600 focus:ring-blue-500"
                            />
                            Meters (m)
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="unit"
                                value="ft"
                                checked={formData.unit === "ft"}
                                onChange={handleChange}
                                className="mr-2 text-blue-600 focus:ring-blue-500"
                            />
                            Feet (ft)
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
