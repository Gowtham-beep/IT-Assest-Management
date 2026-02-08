"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatsCard } from "@/components/StatsCard";
import { api } from "@/lib/api";
import type { DashboardStats } from "@/types";

const defaults: DashboardStats = {
  totalAssets: 0,
  availableAssets: 0,
  assignedAssets: 0,
  inRepairAssets: 0,
  pendingRequests: 0
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(defaults);

  useEffect(() => {
    api<DashboardStats>("/api/dashboard/stats").then(setStats).catch(() => undefined);
  }, []);

  return (
    <AppShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-5">
        <StatsCard title="Total Assets" value={stats.totalAssets} />
        <StatsCard title="Available" value={stats.availableAssets} />
        <StatsCard title="Assigned" value={stats.assignedAssets} />
        <StatsCard title="In Repair" value={stats.inRepairAssets} />
        <StatsCard title="Pending Requests" value={stats.pendingRequests} />
      </div>
    </AppShell>
  );
}
