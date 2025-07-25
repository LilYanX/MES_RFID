import React from "react";

export default function UserSearchBar({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  return (
    <div className="mb-6 flex gap-4 items-center">
      <input
        type="text"
        className="border rounded-lg px-3 py-2 flex-1"
        placeholder="Search by name, first name, email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </div>
  );
} 