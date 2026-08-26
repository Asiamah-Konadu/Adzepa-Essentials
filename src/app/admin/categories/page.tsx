"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setNewName("");
      setNewDescription("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create category.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(c: Category) {
    setEditingId(c.id);
    setEditName(c.name);
    setEditDescription(c.description ?? "");
  }

  async function handleUpdate(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update category.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? This can't be undone.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete category.");
    }
  }

  return (
    <div>
      <h1 className="font-display font-black uppercase text-2xl mb-6">Categories</h1>

      {error && <p className="text-sm text-signal mb-4">{error}</p>}

      <form onSubmit={handleCreate} className="border border-ink/10 p-4 mb-8 flex flex-col sm:flex-row gap-3 items-start">
        <div className="flex-1 w-full">
          <label className="block font-tag text-[11px] uppercase tracking-tag text-muted mb-1">
            New category name
          </label>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
            placeholder="e.g. Kids Bombers"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block font-tag text-[11px] uppercase tracking-tag text-muted mb-1">
            Description (optional)
          </label>
          <input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="bg-ink text-paper font-tag text-xs uppercase tracking-tag px-5 py-2.5 hover:bg-signal transition-colors disabled:opacity-40 shrink-0 mt-0 sm:mt-5"
        >
          Add category
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-ink/50">No categories yet.</p>
      ) : (
        <div className="border border-ink/10 divide-y divide-ink/10">
          {categories.map((c) => (
            <div key={c.id} className="p-4">
              {editingId === c.id ? (
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 w-full border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
                  />
                  <input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="flex-1 w-full border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
                  />
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleUpdate(c.id)}
                      className="bg-ink text-paper font-tag text-xs uppercase tracking-tag px-4 py-2.5 hover:bg-signal transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="border border-ink/20 font-tag text-xs uppercase tracking-tag px-4 py-2.5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display font-bold">{c.name}</p>
                    {c.description && <p className="text-sm text-ink/50">{c.description}</p>}
                    <p className="text-xs text-ink/40 mt-1">
                      {c._count.products} product{c._count.products !== 1 ? "s" : ""} · /{c.slug}
                    </p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button onClick={() => startEdit(c)} className="text-xs underline text-ink/60 hover:text-ink">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="text-xs underline text-signal">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
