"use client";

import { create } from "zustand";

type SessionState = {
  tenantId: string | null;
  userId: string | null;
  setSession: (input: { tenantId: string; userId: string; accessToken: string }) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  tenantId: null,
  userId: null,
  setSession: ({ tenantId, userId, accessToken }) => {
    if (typeof window !== "undefined") localStorage.setItem("sim_access_token", accessToken);
    set({ tenantId, userId });
  },
  clearSession: () => {
    if (typeof window !== "undefined") localStorage.removeItem("sim_access_token");
    set({ tenantId: null, userId: null });
  }
}));
