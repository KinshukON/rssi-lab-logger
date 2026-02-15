"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/landing", label: "Landing" },
  { href: "/report", label: "Report" },
];

export default function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            href="/landing"
            className="flex items-center gap-2 text-slate-800 hover:text-slate-900 font-bold text-lg tracking-tight"
          >
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <FileText size={20} />
            </div>
            RSSI Lab Logger
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
