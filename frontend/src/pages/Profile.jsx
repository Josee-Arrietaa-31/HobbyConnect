import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ChevronRight, X, Pencil } from "lucide-react";
import LevelBadge from "../components/LevelBadge.jsx";
import { api } from "../api.js";
import { useAuth } from "../store/store.jsx";
import { LEVELS } from "../data/seed.js";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [hobbies, setHobbies] = useState([]);
  const [myHobbies, setMyHobbies] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [sel, setSel] = useState({ hobbyId: "", level: "principiante" });
  const [edit, setEdit] = useState({ name: "", password: "" });
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => {
    api("/hobbies").then(setHobbies).catch(() => {});
    api("/me/hobbies").then(setMyHobbies).catch(() => {});
    api("/me/groups").then(setMyGroups).catch(() => {});
  };
  useEffect(load, []);

  const addHobby = async (e) => {
    e.preventDefault();
    if (!sel.hobbyId) return;
    try { await api("/me/hobbies", { method: "POST", body: sel }); setMsg("Hobby agregado"); setSel({ hobbyId: "", level: "principiante" }); load(); }
    catch (e) { setMsg(e.message); }
  };
  const removeHobby = async (hobbyId) => {
    try { await api(`/me/hobbies/${hobbyId}`, { method: "DELETE" }); load(); } catch (e) { setMsg(e.message); }
  };
  const startEdit = () => { setEdit({ name: user.name, password: "" }); setEditing(true); setMsg(""); };
  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const body = { name: edit.name };
      if (edit.password) body.password = edit.password;
      const d = await api("/me", { method: "PATCH", body });
      updateUser(d.user);
      setEditing(false);
      setMsg("Perfil actualizado");
    } catch (e) { setMsg(e.message); }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-700 text-2xl font-semibold text-white">{user.name.charAt(0)}</span>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight">{user.name}</h1>
          <p className="text-stone-500">{user.email}{user.role === "admin" && <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">admin</span>}</p>
        </div>
        <button onClick={startEdit} className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100"><Pencil size={14} /> Editar</button>
      </div>

      {editing && (
        <form onSubmit={saveProfile} className="mt-5 space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="font-display text-lg font-semibold">Editar perfil</h3>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-stone-700">Nombre</span>
            <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-stone-700">Nueva contraseña (opcional)</span>
            <input type="password" value={edit.password} onChange={(e) => setEdit({ ...edit, password: e.target.value })} placeholder="Dejar vacío para no cambiarla" className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
          </label>
          <div className="flex gap-2">
            <button className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Guardar</button>
            <button type="button" onClick={() => setEditing(false)} className="rounded-full px-4 py-2 text-sm text-stone-500 hover:text-stone-800">Cancelar</button>
          </div>
        </form>
      )}

      <h2 className="font-display mb-3 mt-8 text-xl font-semibold">Mis hobbies</h2>
      {myHobbies.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-400">Aún no agregaste hobbies.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {myHobbies.map((h) => (
            <span key={h.id} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm">
              {h.name} <LevelBadge level={h.level} />
              <button onClick={() => removeHobby(h.id)} className="text-stone-400 hover:text-rose-600" aria-label="Quitar hobby"><X size={13} /></button>
            </span>
          ))}
        </div>
      )}

      <form onSubmit={addHobby} className="mt-5 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end">
        <label className="block flex-1">
          <span className="mb-1 block text-sm font-medium text-stone-700">Agregar hobby</span>
          <select value={sel.hobbyId} onChange={(e) => setSel({ ...sel, hobbyId: e.target.value })} className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400">
            <option value="">Seleccioná…</option>
            {hobbies.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-stone-700">Nivel</span>
          <select value={sel.level} onChange={(e) => setSel({ ...sel, level: e.target.value })} className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm capitalize outline-none focus:border-emerald-400">
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <button className="inline-flex items-center justify-center gap-1.5 rounded-full bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700"><Plus size={16} /> Agregar</button>
      </form>
      {msg && <p className="mt-2 text-sm text-emerald-700">{msg}</p>}

      <h2 className="font-display mb-3 mt-8 text-xl font-semibold">Grupos a los que pertenezco</h2>
      <div className="space-y-2">
        {myGroups.length === 0 && <p className="text-sm text-stone-400">Todavía no te has unido a ningún grupo.</p>}
        {myGroups.map((g) => (
          <Link key={g.id} to={`/grupos/${g.id}`} className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-white p-4 text-left transition hover:border-emerald-300 hover:shadow-sm">
            <span>
              <span className="font-display font-semibold">{g.name}</span>
              <span className="mt-0.5 block text-xs text-stone-500">{g.hobby} · {g.community}</span>
            </span>
            <ChevronRight size={18} className="text-stone-400" />
          </Link>
        ))}
      </div>
    </section>
  );
}
