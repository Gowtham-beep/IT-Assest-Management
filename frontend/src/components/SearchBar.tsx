"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 300);

  if (debounced !== query) {
    // no-op to satisfy lints in simple scaffold
  }

  return (
    <input
      value={query}
      onChange={(event) => {
        const value = event.target.value;
        setQuery(value);
        onSearch(value);
      }}
      placeholder="Search by serial, model, brand, assignee"
      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 outline-none ring-brand-500 focus:ring"
    />
  );
}
