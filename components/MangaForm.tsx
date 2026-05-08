"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/Button";

type FormState = {
  title: string;
  originalTitle: string;
  author: string;
  publisher: string;
  description: string;
  coverUrl: string;
  status: string;
  totalVolumes: string;
  notes: string;
};

const emptyState: FormState = {
  title: "",
  originalTitle: "",
  author: "",
  publisher: "",
  description: "",
  coverUrl: "",
  status: "COLLECTING",
  totalVolumes: "",
  notes: ""
};

type MangaTextKey = Exclude<keyof FormState, "totalVolumes">;

type MangaFormInput = Partial<Record<MangaTextKey, string | null>> & {
  id?: string;
  totalVolumes?: number | string | null;
};

export function MangaForm({ manga }: { manga?: MangaFormInput }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    ...emptyState,
    title: manga?.title || "",
    originalTitle: manga?.originalTitle || "",
    author: manga?.author || "",
    publisher: manga?.publisher || "",
    description: manga?.description || "",
    coverUrl: manga?.coverUrl || "",
    status: manga?.status || "COLLECTING",
    notes: manga?.notes || "",
    totalVolumes: manga?.totalVolumes ? String(manga.totalVolumes) : ""
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");

  function setField(name: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function searchCover() {
    if (!form.title.trim()) return;
    setLoading(true);
    setError("");
    const response = await fetch(`/api/mangas/search?title=${encodeURIComponent(form.title)}`);
    const data = await response.json();
    setResults(data.results || []);
    setLoading(false);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch(manga?.id ? `/api/mangas/${manga.id}` : "/api/mangas", {
      method: manga?.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, totalVolumes: form.totalVolumes ? Number(form.totalVolumes) : null })
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Erro ao salvar");
      setLoading(false);
      return;
    }
    const data = await response.json();
    router.push(`/mangas/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <section className="grid gap-4">
        {error ? <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        <div className="grid gap-2">
          <label htmlFor="title">Titulo</label>
          <div className="flex gap-2">
            <input id="title" value={form.title} onChange={(e) => setField("title", e.target.value)} required />
            <Button type="button" variant="secondary" onClick={searchCover} disabled={loading} title="Buscar dados">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Titulo original" value={form.originalTitle} onChange={(value) => setField("originalTitle", value)} />
          <Field label="Autor" value={form.author} onChange={(value) => setField("author", value)} />
          <Field label="Editora" value={form.publisher} onChange={(value) => setField("publisher", value)} />
          <Field label="Total de volumes" type="number" value={form.totalVolumes} onChange={(value) => setField("totalVolumes", value)} />
        </div>
        <div className="grid gap-2">
          <label>Status</label>
          <select value={form.status} onChange={(e) => setField("status", e.target.value)}>
            <option value="COLLECTING">Colecionando</option>
            <option value="COMPLETE">Completo</option>
            <option value="PAUSED">Pausado</option>
            <option value="SOLD">Vendido</option>
            <option value="WISHLIST">Wishlist</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label>Descricao</label>
          <textarea rows={5} value={form.description} onChange={(e) => setField("description", e.target.value)} />
        </div>
        <Field label="URL da capa" value={form.coverUrl} onChange={(value) => setField("coverUrl", value)} />
        <div className="grid gap-2">
          <label>Notas</label>
          <textarea rows={3} value={form.notes} onChange={(e) => setField("notes", e.target.value)} />
        </div>
        <Button disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
      </section>
      <aside className="grid content-start gap-3">
        <div className="aspect-[2/3] overflow-hidden rounded-md border border-line bg-white">
          {form.coverUrl ? <img src={form.coverUrl} alt="" className="h-full w-full object-cover" /> : null}
        </div>
        {results.map((result, index) => (
          <button
            type="button"
            key={`${result.source}-${index}`}
            className="grid grid-cols-[56px_1fr] gap-3 rounded-md border border-line bg-white p-2 text-left"
            onClick={() =>
              setForm((current) => ({
                ...current,
                title: result.title || current.title,
                originalTitle: result.originalTitle || current.originalTitle,
                author: result.author || current.author,
                publisher: result.publisher || current.publisher,
                description: result.description || current.description,
                coverUrl: result.coverUrl || current.coverUrl
              }))
            }
          >
            <div className="aspect-[2/3] overflow-hidden rounded bg-stone-100">{result.coverUrl ? <img src={result.coverUrl} alt="" className="h-full w-full object-cover" /> : null}</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{result.title}</p>
              <p className="text-xs text-stone-500">{result.source}</p>
            </div>
          </button>
        ))}
      </aside>
    </form>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div className="grid gap-2">
      <label>{label}</label>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
