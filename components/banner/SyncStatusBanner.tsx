"use client";

import { CloudOff } from "lucide-react";

type SyncStatusBannerProps = {
  show: boolean;
  onDismiss?: () => void;
};

export default function SyncStatusBanner({ show, onDismiss }: SyncStatusBannerProps) {
  if (!show) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-amber-800 text-sm">
        <CloudOff size={18} />
        <span>Cloud sync offline — using local cache</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-amber-700 hover:text-amber-900 text-xs font-medium"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
