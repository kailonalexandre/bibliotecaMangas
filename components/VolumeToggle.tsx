"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function VolumeToggle({ id, name, checked, label }: { id: string; name: "owned" | "read" | "borrowed"; checked: boolean; label: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function update(value: boolean) {
    setPending(true);
    await fetch(`/api/volumes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [name]: value })
    });
    setPending(false);
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm font-normal">
      <input className="h-4 w-4 rounded border-line accent-teal-700" type="checkbox" checked={checked} disabled={pending} onChange={(event) => update(event.target.checked)} />
      {label}
    </label>
  );
}
