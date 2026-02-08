"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RequestCard } from "@/components/RequestCard";
import { api } from "@/lib/api";
import type { AssetRequest } from "@/types";

export default function RequestsPage() {
  const [requests, setRequests] = useState<AssetRequest[]>([]);

  useEffect(() => {
    api<AssetRequest[]>("/api/requests").then(setRequests).catch(() => undefined);
  }, []);

  return (
    <AppShell title="Requests">
      <div className="grid gap-3">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </AppShell>
  );
}
