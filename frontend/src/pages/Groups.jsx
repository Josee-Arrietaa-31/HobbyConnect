import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Compass, Plus } from "lucide-react";
import GroupCard from "../components/GroupCard.jsx";
import { api } from "../api.js";
import { LEVELS } from "../data/seed.js";

export default function Groups() {
  const [params] = useSearchParams();
  const [hobbies, setHobbies] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [f, setF] = useState({ hobbyId: params.get("hobbyId") || "", level: "", community: "" });

  useEffect(() => {
    api("/hobbies").then(setHobbies).catch(() => {});
  }, []);

  useEffect(() => {
    const q = new URLSearchParams();
    if (f.hobbyId) q.set("hobbyId", f.hobbyId);
    if (f.level) q.set("level", f.level);
    if (f.community) q.set("community", f.community);
    setLoading(true);
    api("/groups?" + q.toString())
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, [f]);

  const clear = () => setF({ hobbyId: "", level: "", community: "" });
  const active = f.hobbyId || f.level || f.community;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Explorar grupos</h1>
        <p className="mt-1 text-stone-600">Filtrá por hobby, nivel de desempeño y ubicación.</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <Search size={18} className="text-stone-400" />
        <select value={f.hobbyId} onChange={(e) => setF({ ...f, hobbyId: e.target.value })}
          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 sm:w-auto">
          <option value="">Todos los hobbies</option>
          {hobbies.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        <select value={f.level} onChange={(e) => setF({ ...f, level: e.target.value })}
          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm capitalize outline-none focus:border-emerald-400 sm:w-auto">
          <option value="">Todos los niveles</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <input value={f.community} onChange={(e) => setF({ ...f, community: e.target.value })}
          placeholder="Ubicación o comunidad…"
          className="w-full flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
        {active && <button onClick={clear} className="rounded-lg px-3 py-2 text-sm text-stone-500 hover:text-stone-800">Limpiar</button>}
      </div>

      <p className="mb-3 text-sm text-stone-500">{loading ? "Cargando…" : `${groups.length} grupo(s)`}</p>

      {!loading && groups.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center">
          <Compass className="text-stone-300" size={40} />
          <p className="mt-3 font-medium text-stone-600">No hay grupos para esa búsqueda</p>
          <Link to="/crear" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
            <Plus size={16} /> Crear grupo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => <GroupCard key={g.id} group={g} index={i} />)}
        </div>
      )}
    </section>
  );
}
