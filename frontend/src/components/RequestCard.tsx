import type { AssetRequest } from "@/types";
import { StatusBadge } from "./StatusBadge";

export function RequestCard({ request }: { request: AssetRequest }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{request.asset_type} request</h3>
        <StatusBadge status={request.status} />
      </div>
      <p className="mt-2 text-sm text-slate-700">{request.justification}</p>
      <p className="mt-2 text-xs text-slate-500">Created: {new Date(request.created_at).toLocaleDateString()}</p>
    </article>
  );
}
