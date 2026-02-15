"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { User } from "@supabase/supabase-js";
import { getCloudModePreference, setCloudModePreference } from "@/lib/auth/mode";

type AuthContextType = {
  user: User | null;
  cloudMode: boolean;
  setCloudMode: (v: boolean) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cloudMode, setCloudModeState] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        setUser(u ?? null);
        setCloudModeState(getCloudModePreference());
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const setCloudMode = (v: boolean) => {
    setCloudModeState(v);
    setCloudModePreference(v);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        cloudMode: !!user && cloudMode,
        setCloudMode,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
