export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-semibold">Forgot password</h1>
      <form className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-white p-6">
        <input className="w-full rounded-lg border p-2" type="email" placeholder="Work email" required />
        <button className="w-full rounded-lg bg-brand-700 py-2 text-white">Send reset link</button>
      </form>
    </section>
  );
}
