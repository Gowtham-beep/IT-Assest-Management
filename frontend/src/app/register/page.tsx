"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useSessionStore } from "@/lib/store";

type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
  tenantId: string;
  userId: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useSessionStore();
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await api<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          companyName,
          subdomain,
          email,
          password,
          firstName,
          lastName
        })
      });

      setSession({
        accessToken: data.accessToken,
        tenantId: data.tenantId,
        userId: data.userId
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg px-6 py-12">
      <h1 className="text-3xl font-semibold">Create your workspace</h1>
      <form className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-6" onSubmit={onSubmit}>
        <input
          className="rounded-lg border p-2"
          placeholder="Company Name"
          required
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
        />
        <input
          className="rounded-lg border p-2"
          placeholder="Subdomain"
          required
          value={subdomain}
          onChange={(event) => setSubdomain(event.target.value)}
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-lg border p-2"
            placeholder="First Name"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <input
            className="rounded-lg border p-2"
            placeholder="Last Name"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>
        <input
          className="rounded-lg border p-2"
          placeholder="Admin Email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="rounded-lg border p-2"
          placeholder="Password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button className="rounded-lg bg-brand-700 py-2 text-white disabled:opacity-70" disabled={loading}>
          {loading ? "Creating..." : "Create Tenant"}
        </button>
      </form>
    </section>
  );
}
