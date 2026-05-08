"use client";

import { Check, Save, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export type MissingVolumeItem = {
  mangaId: string;
  mangaTitle: string;
  volumeId: string | null;
  number: number;
  purchaseSource: string;
};

export function MissingVolumePlanner({ items }: { items: MissingVolumeItem[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(items.map((item) => [keyOf(item), item.purchaseSource])));
  const [activeSource, setActiveSource] = useState("all");
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<Record<string, boolean>>({});

  const currentItems = items.map((item) => ({ ...item, purchaseSource: values[keyOf(item)] ?? item.purchaseSource }));
  const sources = useMemo(() => {
    return Array.from(new Set(currentItems.map((item) => item.purchaseSource.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [currentItems]);

  const filteredItems = currentItems.filter((item) => {
    const source = item.purchaseSource.trim();
    if (activeSource === "none" && source) return false;
    if (activeSource !== "all" && activeSource !== "none" && source !== activeSource) return false;
    if (query.trim() && !source.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const grouped = groupByManga(filteredItems);

  async function save(item: MissingVolumeItem) {
    const key = keyOf(item);
    setPending((current) => ({ ...current, [key]: true }));
    await fetch("/api/volumes/purchase-source", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mangaId: item.mangaId, number: item.number, purchaseSource: values[key] || "" })
    });
    setPending((current) => ({ ...current, [key]: false }));
    router.refresh();
  }

  async function markOwned(item: MissingVolumeItem) {
    const key = keyOf(item);
    setPending((current) => ({ ...current, [key]: true }));
    await fetch("/api/volumes/purchase-source", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mangaId: item.mangaId, number: item.number, purchaseSource: values[key] || "", owned: true })
    });
    setPending((current) => ({ ...current, [key]: false }));
    router.refresh();
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 rounded-md border border-line bg-white p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar por local de compra..." />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <FilterButton active={activeSource === "all"} onClick={() => setActiveSource("all")}>Todos</FilterButton>
          <FilterButton active={activeSource === "none"} onClick={() => setActiveSource("none")}>Sem local definido</FilterButton>
          {sources.map((source) => (
            <FilterButton key={source} active={activeSource === source} onClick={() => setActiveSource(source)}>{source}</FilterButton>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {grouped.map((group) => (
          <section key={group.mangaId} className="rounded-md border border-line bg-white p-4">
            <h2 className="text-lg font-bold">{group.mangaTitle}</h2>
            <div className="mt-3 grid gap-2">
              {group.items.map((item) => {
                const key = keyOf(item);
                return (
                  <article key={key} className="grid gap-2 rounded-md border border-stone-100 bg-stone-50 p-3 md:grid-cols-[96px_1fr_auto_auto] md:items-center">
                    <div className="font-semibold">Volume {item.number}</div>
                    <input
                      value={values[key] ?? ""}
                      onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                      onBlur={() => save(item)}
                      placeholder="Ainda nao definido"
                    />
                    <Button type="button" variant="secondary" disabled={pending[key]} onClick={() => save(item)}>
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>
                    <Button type="button" disabled={pending[key]} onClick={() => markOwned(item)}>
                      <Check className="h-4 w-4" />
                      Comprei
                    </Button>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
        {!grouped.length ? <p className="rounded-md border border-line bg-white p-4 text-sm text-stone-600">Nenhum volume faltante encontrado.</p> : null}
      </div>
    </div>
  );
}

function keyOf(item: Pick<MissingVolumeItem, "mangaId" | "number">) {
  return `${item.mangaId}:${item.number}`;
}

function groupByManga(items: MissingVolumeItem[]) {
  const map = new Map<string, { mangaId: string; mangaTitle: string; items: MissingVolumeItem[] }>();
  for (const item of items) {
    const group = map.get(item.mangaId) || { mangaId: item.mangaId, mangaTitle: item.mangaTitle, items: [] };
    group.items.push(item);
    map.set(item.mangaId, group);
  }
  return Array.from(map.values());
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-fit rounded-md border px-3 py-2 text-sm font-semibold transition ${active ? "border-accent bg-teal-50 text-accent" : "border-line bg-white text-stone-700 hover:bg-stone-50"}`}
    >
      {children}
    </button>
  );
}
