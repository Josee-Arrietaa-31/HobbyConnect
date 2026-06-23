import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { api } from "../api.js";
import { LEVELS } from "../data/seed.js";

export default function CreateGroup() {
  const navigate = useNavigate();
  const [hobbies, setHobbies] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", hobbyId: "", level: "principiante", community: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    api("/hobbies").then(setHobbies).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.hobbyId || !form.community) { setErr("Nombre, hobby y comunidad son obligatorios."); return; }
    try {
      const d = await api("/groups", { method: "POST", body: form });
      navigate(`/grupos/${d.id}`);
    } catch (e) { setErr(e.message); }
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="font-display mb-1 text-3xl font-semibold tracking-tight">Crear un grupo</h1>
      <p className="mb-6 text-stone-600">Un mismo hobby puede tener varios grupos según nivel y comunidad.</p>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        {err && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</p>}
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-stone-700">Nombre del grupo</span>
          <input value={form.name} onChange={set("name")} className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-stone-700">Descripción</span>
          <textarea value={form.description} onChange={set("description")} rows={3} className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-stone-700">Hobby</span>
            <select value={form.hobbyId} onChange={set("hobbyId")} className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400">
              <option value="">Seleccioná…</option>
              {hobbies.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-stone-700">Nivel</span>
            <select value={form.level} onChange={set("level")} className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm capitalize outline-none focus:border-emerald-400">
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-stone-700">Comunidad o región</span>
          <input value={form.community} onChange={set("community")} placeholder="Ej: San Carlos, Virtual, Nacional…" className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
        </label>
        <div className="flex gap-3 pt-2">
          <button className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"><Plus size={16} /> Crear grupo</button>
          <button type="button" onClick={() => navigate("/grupos")} className="rounded-full px-5 py-2.5 text-sm text-stone-500 hover:text-stone-800">Cancelar</button>
        </div>
      </form>
    </section>
  );
}
