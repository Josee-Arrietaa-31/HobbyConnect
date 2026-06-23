import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Check, Plus, CalendarDays, MessageCircle, LogOut, Pencil, Trash2, X } from "lucide-react";
import LevelBadge from "../components/LevelBadge.jsx";
import { api } from "../api.js";
import { useAuth } from "../store/store.jsx";
import { LEVELS } from "../data/seed.js";

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [act, setAct] = useState({ title: "", description: "", location: "", date: "" });
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState(false);
  const [edit, setEdit] = useState({ name: "", description: "", level: "principiante", community: "" });
  const [err, setErr] = useState("");

  const load = () => { api(`/groups/${id}`).then(setGroup).catch(() => setNotFound(true)); };
  useEffect(load, [id]);

  const canManage = group && (group.isOwner || (user && user.role === "admin"));

  const handleJoin = async () => {
    if (!user) { navigate("/login"); return; }
    try { await api(`/groups/${id}/join`, { method: "POST" }); load(); } catch (e) { setErr(e.message); }
  };
  const handleLeave = async () => {
    try { await api(`/groups/${id}/leave`, { method: "POST" }); load(); } catch (e) { setErr(e.message); }
  };
  const startEdit = () => {
    setEdit({ name: group.name, description: group.description || "", level: group.level, community: group.community });
    setEditing(true);
  };
  const saveEdit = async (e) => {
    e.preventDefault();
    try { await api(`/groups/${id}`, { method: "PUT", body: edit }); setEditing(false); setErr(""); load(); }
    catch (e) { setErr(e.message); }
  };
  const deleteGroup = async () => {
    if (!confirm("¿Eliminar este grupo? Esta acción no se puede deshacer.")) return;
    try { await api(`/groups/${id}`, { method: "DELETE" }); navigate("/grupos"); } catch (e) { setErr(e.message); }
  };
  const submitActivity = async (e) => {
    e.preventDefault();
    if (!act.title || !act.date) { setErr("El título y la fecha son obligatorios."); return; }
    try { await api(`/groups/${id}/activities`, { method: "POST", body: act }); setAct({ title: "", description: "", location: "", date: "" }); setErr(""); load(); }
    catch (e) { setErr(e.message); }
  };
  const deleteActivity = async (aid) => {
    try { await api(`/groups/${id}/activities/${aid}`, { method: "DELETE" }); load(); } catch (e) { setErr(e.message); }
  };
  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try { await api(`/groups/${id}/comments`, { method: "POST", body: { body: comment } }); setComment(""); load(); }
    catch (e) { setErr(e.message); }
  };
  const deleteComment = async (cid) => {
    try { await api(`/groups/${id}/comments/${cid}`, { method: "DELETE" }); load(); } catch (e) { setErr(e.message); }
  };

  if (notFound) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="text-stone-600">Grupo no encontrado.</p>
        <Link to="/grupos" className="mt-4 inline-block text-emerald-700 hover:underline">Volver a explorar</Link>
      </section>
    );
  }
  if (!group) return <p className="px-4 py-20 text-center text-stone-400">Cargando…</p>;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        {editing ? (
          <form onSubmit={saveEdit} className="space-y-3">
            <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} placeholder="Nombre" className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
            <textarea value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} rows={2} placeholder="Descripción" className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
            <div className="grid gap-3 sm:grid-cols-2">
              <select value={edit.level} onChange={(e) => setEdit({ ...edit, level: e.target.value })} className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm capitalize outline-none focus:border-emerald-400">
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <input value={edit.community} onChange={(e) => setEdit({ ...edit, community: e.target.value })} placeholder="Comunidad" className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
            </div>
            <div className="flex gap-2">
              <button className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Guardar</button>
              <button type="button" onClick={() => setEditing(false)} className="rounded-full px-4 py-2 text-sm text-stone-500 hover:text-stone-800">Cancelar</button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">{group.hobby}</span>
                <LevelBadge level={group.level} />
              </div>
              {canManage && (
                <div className="flex gap-2">
                  <button onClick={startEdit} className="inline-flex items-center gap-1 rounded-full border border-stone-300 px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100"><Pencil size={13} /> Editar</button>
                  <button onClick={deleteGroup} className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"><Trash2 size={13} /> Eliminar</button>
                </div>
              )}
            </div>
            <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight">{group.name}</h1>
            <p className="mt-2 text-stone-600">{group.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-stone-500">
              <span className="inline-flex items-center gap-1.5"><MapPin size={16} className="text-orange-500" /> {group.community}</span>
              <span className="inline-flex items-center gap-1.5"><Users size={16} /> {group.members} miembro(s)</span>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {group.isMember ? (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"><Check size={16} /> Ya sos miembro</span>
                  <button onClick={handleLeave} className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"><LogOut size={15} /> Salir del grupo</button>
                </>
              ) : (
                <button onClick={handleJoin} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"><Plus size={16} /> Unirme al grupo</button>
              )}
            </div>
          </>
        )}
      </div>

      {err && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</p>}

      <h2 className="font-display mb-3 mt-8 flex items-center gap-2 text-2xl font-semibold"><Users size={20} className="text-emerald-700" /> Miembros</h2>
      <div className="flex flex-wrap gap-2">
        {group.memberList.map((m) => (
          <span key={m.id} className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">{m.name.charAt(0)}</span>
            {m.name}
          </span>
        ))}
      </div>

      <h2 className="font-display mb-3 mt-8 flex items-center gap-2 text-2xl font-semibold">
        <CalendarDays size={20} className="text-emerald-700" /> Actividades
      </h2>
      <div className="space-y-3">
        {group.activities.length === 0 && (
          <p className="rounded-xl border border-dashed border-stone-300 bg-white p-5 text-sm text-stone-400">
            Aún no hay actividades. {group.isMember ? "Creá la primera abajo." : "Unite para organizar una."}
          </p>
        )}
        {group.activities.map((a) => (
          <div key={a.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-semibold">{a.title}</h3>
              {(canManage || (user && a.createdBy === user.id)) && (
                <button onClick={() => deleteActivity(a.id)} className="text-stone-400 hover:text-rose-600" aria-label="Eliminar actividad"><Trash2 size={15} /></button>
              )}
            </div>
            {a.description && <p className="mt-1 text-sm text-stone-600">{a.description}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-stone-500">
              {a.location && <span className="inline-flex items-center gap-1"><MapPin size={13} /> {a.location}</span>}
              <span className="inline-flex items-center gap-1"><CalendarDays size={13} /> {new Date(a.date + "T00:00").toLocaleDateString("es-CR", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>
        ))}
      </div>

      {group.isMember && (
        <form onSubmit={submitActivity} className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="font-display mb-3 text-lg font-semibold">Crear actividad</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={act.title} onChange={(e) => setAct({ ...act, title: e.target.value })} placeholder="Título *" className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 sm:col-span-2" />
            <input value={act.location} onChange={(e) => setAct({ ...act, location: e.target.value })} placeholder="Lugar" className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
            <input type="date" value={act.date} onChange={(e) => setAct({ ...act, date: e.target.value })} className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400" />
            <textarea value={act.description} onChange={(e) => setAct({ ...act, description: e.target.value })} placeholder="Descripción" rows={2} className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 sm:col-span-2" />
          </div>
          <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"><Plus size={16} /> Agregar actividad</button>
        </form>
      )}

      <h2 className="font-display mb-3 mt-8 flex items-center gap-2 text-2xl font-semibold">
        <MessageCircle size={20} className="text-emerald-700" /> Conversación
      </h2>
      <div className="space-y-3">
        {group.comments.length === 0 && (
          <p className="rounded-xl border border-dashed border-stone-300 bg-white p-5 text-sm text-stone-400">
            Todavía no hay mensajes. {group.isMember ? "Iniciá la conversación abajo." : "Unite para participar."}
          </p>
        )}
        {group.comments.map((c) => (
          <div key={c.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold">{c.author}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">{c.date}</span>
                {(canManage || (user && c.userId === user.id)) && (
                  <button onClick={() => deleteComment(c.id)} className="text-stone-400 hover:text-rose-600" aria-label="Eliminar comentario"><X size={14} /></button>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm text-stone-700">{c.body}</p>
          </div>
        ))}
      </div>

      {group.isMember && (
        <form onSubmit={submitComment} className="mt-4 flex gap-2">
          <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Escribí un mensaje…"
            className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400" />
          <button className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Enviar</button>
        </form>
      )}
    </section>
  );
}
