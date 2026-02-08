"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApiError, api } from "@/lib/api";
import { useSessionStore } from "@/lib/store";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tenantId: string;
  userId: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useSessionStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegisterHint, setShowRegisterHint] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setShowRegisterHint(false);
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    try {
      const data = await api<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword })
      });
      setSession({ accessToken: data.accessToken, tenantId: data.tenantId, userId: data.userId });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError("User does not exist.");
          setShowRegisterHint(true);
        } else if (err.status === 401) {
          setError("Invalid password.");
        } else {
          setError(err.message);
        }
      } else {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-semibold">Login</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <input
          className="w-full rounded-lg border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          placeholder="Email"
          required
        />
        <input
          className="w-full rounded-lg border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          required
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        {showRegisterHint && (
          <p className="text-sm text-slate-700">
            Please register first: <Link href="/register" className="text-brand-700 underline">Create account</Link>
          </p>
        )}
        <button className="w-full rounded-lg bg-brand-700 py-2 text-white disabled:opacity-70" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}
