"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AssetTable } from "@/components/AssetTable";
import { SearchBar } from "@/components/SearchBar";
import { api } from "@/lib/api";
import type { Asset } from "@/types";

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    api<Asset[]>("/api/assets").then(setAssets).catch(() => undefined);
  }, []);

  async function search(query: string) {
    if (!query) {
      api<Asset[]>("/api/assets").then(setAssets).catch(() => undefined);
      return;
    }
    api<Asset[]>(`/api/assets/search?q=${encodeURIComponent(query)}`).then(setAssets).catch(() => undefined);
  }

  return (
    <AppShell title="Assets">
      <div className="mb-4"><SearchBar onSearch={search} /></div>
      <AssetTable assets={assets} />
    </AppShell>
  );
}
