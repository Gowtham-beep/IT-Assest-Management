import type { AssetStatus } from "@/types";

const styles: Record<AssetStatus | "pending" | "approved" | "rejected" | "fulfilled", string> = {
  available: "bg-emerald-100 text-emerald-700",
  assigned: "bg-blue-100 text-blue-700",
  in_repair: "bg-amber-100 text-amber-700",
  retired: "bg-slate-200 text-slate-700",
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-blue-100 text-blue-700",
  rejected: "bg-rose-100 text-rose-700",
  fulfilled: "bg-emerald-100 text-emerald-700"
};

export function StatusBadge({ status }: { status: keyof typeof styles }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>{status}</span>;
}
