import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mountain } from "lucide-react";
import { useAuth } from "../store/store.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try { await register(form); navigate("/"); }
    catch (e) { setErr(e.message); }
  };

  return (
    <section className="mx-auto grid max-w-md place-items-center px-4 py-16">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 text-white"><Mountain size={22} /></span>
          <span className="font-display text-2xl font-semibold tracking-tight">HobbyConnect</span>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h1 className="font-display text-xl font-semibold">Crear cuenta</h1>
          {err && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</p>}
          <form onSubmit={submit} className="mt-4 space-y-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre completo" className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400" />
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Correo" className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400" />
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Contraseña (6+ caracteres)" className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400" />
            <button className="w-full rounded-full bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800">Crear cuenta</button>
          </form>
          <p className="mt-4 text-sm text-stone-500">¿Ya tenés cuenta? <Link to="/login" className="font-medium text-emerald-700 hover:underline">Ingresá</Link></p>
        </div>
      </div>
    </section>
  );
}
