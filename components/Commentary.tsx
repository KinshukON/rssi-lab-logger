"use client";

interface Props {
    text: string;
}

export default function Commentary({ text }: Props) {
    if (!text) return null;

    return (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 print:shadow-none print:border-black">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Analysis & Commentary</h3>
            <p className="text-gray-700 leading-relaxed text-justify">
                {text}
            </p>
            <div className="mt-2 text-xs text-gray-400 text-right print:hidden">
                Word count: {text.split(/\s+/).length}
            </div>
        </div>
    );
}
