"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AssignmentTimeline, type TimelineItem } from "@/components/AssignmentTimeline";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Asset } from "@/types";

export default function AssetDetailPage() {
  const params = useParams<{ id: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [history, setHistory] = useState<TimelineItem[]>([]);

  useEffect(() => {
    if (!params.id) return;
    api<Asset>(`/api/assets/${params.id}`).then(setAsset).catch(() => undefined);
    api<Array<{ id: string; assigned_date: string; returned_date: string | null; first_name: string; last_name: string }>>(
      "/api/assignments"
    )
      .then((rows) => rows.filter((row) => row.id).map((row) => ({
        id: row.id,
        assignedDate: row.assigned_date,
        returnedDate: row.returned_date,
        assignedTo: `${row.first_name} ${row.last_name}`
      })))
      .then(setHistory)
      .catch(() => undefined);
  }, [params.id]);

  if (!asset) return <AppShell title="Asset Detail"><p>Loading asset...</p></AppShell>;

  return (
    <AppShell title="Asset Detail">
      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-xl font-semibold">{asset.brand} {asset.model}</h2>
          <p className="mt-2 text-sm text-slate-600">Serial: {asset.serial_number}</p>
          <p className="text-sm text-slate-600">Type: {asset.asset_type}</p>
          <div className="mt-3"><StatusBadge status={asset.status} /></div>
        </article>
        <article>
          <h3 className="mb-2 text-lg font-semibold">Assignment Timeline</h3>
          <AssignmentTimeline items={history} />
        </article>
      </section>
    </AppShell>
  );
}
