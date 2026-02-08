import Link from "next/link";

const nav = [
  ["/dashboard", "Dashboard"],
  ["/assets", "Assets"],
  ["/requests", "Requests"],
  ["/users", "Users"],
  ["/reports", "Reports"]
] as const;

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <nav className="flex gap-2">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
