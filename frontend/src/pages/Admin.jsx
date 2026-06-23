import { useEffect, useState } from "react";
import { Users, Boxes, Sparkles, CalendarDays, Trash2, Plus, Shield } from "lucide-react";
import { api } from "../api.js";

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon size={20} /></span>
      <div>
        <div className="font-display text-2xl font-semibold">{value ?? "—"}</div>
        <div className="text-sm text-stone-500">{label}</div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [stats, setStats] = useState({});
  const [hobbies, setHobbies] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [newHobby, setNewHobby] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => {
    api("/admin/stats").then(setStats).catch(() => {});
    api("/hobbies").then(setHobbies).catch(() => {});
    api("/admin/groups").then(setGroups).catch(() => {});
    api("/admin/users").then(setUsers).catch(() => {});
  };
  useEffect(load, []);

  const addHobby = async (e) => {
    e.preventDefault();
    if (!newHobby.trim()) return;
    try { await api("/admin/hobbies", { method: "POST", body: { name: newHobby } }); setNewHobby(""); setMsg(""); load(); }
    catch (e) { setMsg(e.message); }
  };
  const delHobby = async (id) => {
    try { await api(`/admin/hobbies/${id}`, { method: "DELETE" }); setMsg(""); load(); }
    catch (e) { setMsg(e.message); }
  };
  const delGroup = async (id) => {
    try { await api(`/admin/groups/${id}`, { method: "DELETE" }); load(); }
    catch (e) { setMsg(e.message); }
  };
  const toggleRole = async (u) => {
    const role = u.role === "admin" ? "user" : "admin";
    try { await api(`/admin/users/${u.id}/role`, { method: "PATCH", body: { role } }); load(); }
    catch (e) { setMsg(e.message); }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center gap-2">
        <Shield className="text-orange-600" size={24} />
        <h1 className="font-display text-4xl font-semibold tracking-tight">Panel de administración</h1>
      </div>
      {msg && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{msg}</p>}

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Users} label="Usuarios" value={stats.users} />
        <StatCard icon={Boxes} label="Grupos" value={stats.groups} />
        <StatCard icon={Sparkles} label="Hobbies" value={stats.hobbies} />
        <StatCard icon={CalendarDays} label="Actividades" value={stats.activities} />
      </div>

      <h2 className="font-display mb-3 text-2xl font-semibold">Hobbies</h2>
      <form onSubmit={addHobby} className="mb-4 flex gap-2">
        <input value={newHobby} onChange={(e) => setNewHobby(e.target.value)} placeholder="Nuevo hobby…"
          className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
        <button className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"><Plus size={16} /> Agregar</button>
      </form>
      <div className="mb-10 flex flex-wrap gap-2">
        {hobbies.map((h) => (
          <span key={h.id} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm">
            {h.name}
            <button onClick={() => delHobby(h.id)} className="text-stone-400 hover:text-rose-600" aria-label="Eliminar hobby"><Trash2 size={14} /></button>
          </span>
        ))}
      </div>

      <h2 className="font-display mb-3 text-2xl font-semibold">Grupos</h2>
      <div className="mb-10 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {groups.map((g) => (
          <div key={g.id} className="flex items-center justify-between gap-3 border-b border-stone-100 px-4 py-3 last:border-0">
            <div>
              <div className="font-medium">{g.name}</div>
              <div className="text-xs text-stone-500">{g.hobby} · {g.level} · {g.community} · {g.members} miembro(s)</div>
            </div>
            <button onClick={() => delGroup(g.id)} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50"><Trash2 size={15} /> Eliminar</button>
          </div>
        ))}
      </div>

      <h2 className="font-display mb-3 text-2xl font-semibold">Usuarios</h2>
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between gap-3 border-b border-stone-100 px-4 py-3 last:border-0">
            <div>
              <div className="font-medium">{u.name} {u.role === "admin" && <span className="ml-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">admin</span>}</div>
              <div className="text-xs text-stone-500">{u.email}</div>
            </div>
            <button onClick={() => toggleRole(u)} className="rounded-full border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100">
              {u.role === "admin" ? "Quitar admin" : "Hacer admin"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
