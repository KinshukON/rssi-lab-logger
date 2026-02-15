"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import Link from "next/link";
import { Cloud, HardDrive, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AuthButton() {
  const { user, cloudMode, setCloudMode, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCloudMode(false);
  };

  const handleToggleMode = (value: boolean) => {
    setCloudMode(value);
  };

  if (loading) {
    return <div className="w-24 h-8 bg-slate-200 animate-pulse rounded-lg" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        Sign in
      </Link>
    );
  }

  const initial = (user.user_metadata?.full_name || user.email || "?")[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
      >
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt=""
            width={32}
            height={32}
            className="rounded-full border border-slate-200 w-8 h-8 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
            {initial}
          </div>
        )}
        <span className="hidden sm:inline truncate max-w-[100px]">
          {user.user_metadata?.full_name || user.email}
        </span>
        <ChevronDown size={16} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full mt-1 z-50 w-64 bg-white rounded-lg border border-slate-200 shadow-lg py-2">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs text-slate-500">Signed in as</p>
              <p className="text-sm font-medium text-slate-800 truncate">
                {user.email}
              </p>
            </div>
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-2">
                Mode
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleMode(false)}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    !cloudMode
                      ? "bg-slate-200 text-slate-800"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <HardDrive size={14} />
                  Local
                </button>
                <button
                  onClick={() => handleToggleMode(true)}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    cloudMode
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Cloud size={14} />
                  Cloud
                </button>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
