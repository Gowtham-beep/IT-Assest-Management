import type { Asset } from "@/types";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";

export function AssetTable({ assets }: { assets: Asset[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Asset</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Serial</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{asset.brand} {asset.model}</td>
              <td className="px-4 py-3">{asset.asset_type}</td>
              <td className="px-4 py-3">{asset.serial_number}</td>
              <td className="px-4 py-3"><StatusBadge status={asset.status} /></td>
              <td className="px-4 py-3">
                <Link href={`/assets/${asset.id}`} className="text-brand-700 hover:underline">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
