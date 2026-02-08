import Link from "next/link";

const links = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/assets", label: "Assets" },
  { href: "/requests", label: "Requests" },
  { href: "/users", label: "Users" },
  { href: "/reports", label: "Reports" }
];

export default function HomePage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Smart Inventory Management</h1>
      <p className="mt-4 text-slate-600">Track assets, assignments, requests, and audit history in one SaaS workspace.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-brand-500"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
