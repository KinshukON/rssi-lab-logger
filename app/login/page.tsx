"use client";

import { createClient } from "@/lib/supabase/browser";
import Link from "next/link";
import { FileText } from "lucide-react";

function getRedirectUrl(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/auth/callback`;
}

export default function LoginPage() {
  const supabase = createClient();

  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl(),
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-800 font-bold text-lg mb-8 justify-center"
        >
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <FileText size={24} />
          </div>
          RSSI Lab Logger
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-xl font-bold text-slate-900 text-center mb-2">
            Sign in
          </h1>
          <p className="text-slate-600 text-sm text-center mb-6">
            Use Google to sync experiments across devices and enable cloud backup.
          </p>

          <button
            onClick={handleSignInWithGoogle}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
            <p className="font-medium text-slate-700">Web vs Mac app:</p>
            <p>
              The <strong>web app</strong> works on any device — you manually enter RSSI
              (e.g., from your device&apos;s Wi-Fi menu or <code className="bg-slate-200 px-1 rounded">airport -I</code>).
              The <strong>Mac app</strong> adds one-click Auto Measure that runs{" "}
              <code className="bg-slate-200 px-1 rounded">airport -I</code> locally.
            </p>
          </div>

          <p className="mt-6 text-xs text-slate-500 text-center">
            By signing in, you enable cloud sync. You can always use the app
            without an account (local mode).
          </p>
        </div>

        <Link
          href="/"
          className="block text-center text-sm text-slate-500 hover:text-slate-700 mt-6"
        >
          ← Back to app
        </Link>
      </div>
    </div>
  );
}
