import type { Asset } from "@/types";
import { StatusBadge } from "./StatusBadge";

export function AssetCard({ asset }: { asset: Asset }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{asset.brand} {asset.model}</h3>
        <StatusBadge status={asset.status} />
      </div>
      <p className="mt-2 text-sm text-slate-600">Serial: {asset.serial_number}</p>
      <p className="text-sm text-slate-600">Type: {asset.asset_type}</p>
    </article>
  );
}
