"use client";

type User = { id: string; label: string };

export function UserSelector({ users, value, onChange }: { users: User[]; value?: string; onChange: (id: string) => void }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
    >
      <option value="">Select user</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>{user.label}</option>
      ))}
    </select>
  );
}
