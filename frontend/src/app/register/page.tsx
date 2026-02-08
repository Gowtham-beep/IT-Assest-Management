"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="mx-auto max-w-lg px-6 py-12">
      <h1 className="text-3xl font-semibold">Create your workspace</h1>
      <form
        className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-6"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <input className="rounded-lg border p-2" placeholder="Company Name" required />
        <input className="rounded-lg border p-2" placeholder="Subdomain" required />
        <input className="rounded-lg border p-2" placeholder="Admin Email" type="email" required />
        <input className="rounded-lg border p-2" placeholder="Password" type="password" required />
        <button className="rounded-lg bg-brand-700 py-2 text-white">Create Tenant</button>
        {submitted && <p className="text-sm text-emerald-700">Submitted. Connect this form to POST /api/auth/register.</p>}
      </form>
    </section>
  );
}
