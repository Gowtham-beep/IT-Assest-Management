"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ExportButton } from "@/components/ExportButton";
import { api } from "@/lib/api";

export default function ReportsPage() {
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);

  async function loadAudit() {
    const data = await api<Array<Record<string, unknown>>>("/api/reports/audit");
    setRows(data);
  }

  function exportCsv() {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const body = rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")).join("\n");
    const csv = `${headers.join(",")}\n${body}`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "audit-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell title="Reports">
      <div className="flex items-center gap-3">
        <button onClick={loadAudit} className="rounded-lg border border-slate-300 bg-white px-4 py-2">Load Audit Trail</button>
        <ExportButton onClick={exportCsv} />
      </div>
      <pre className="mt-4 overflow-auto rounded-xl border border-slate-200 bg-white p-4 text-xs">
        {JSON.stringify(rows.slice(0, 25), null, 2)}
      </pre>
    </AppShell>
  );
}
