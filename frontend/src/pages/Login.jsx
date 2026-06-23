import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mountain } from "lucide-react";
import { useAuth } from "../store/store.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "demo@hobbyconnect.cr", password: "demo1234" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try { await login(form); navigate("/"); }
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
          <h1 className="font-display text-xl font-semibold">Iniciar sesión</h1>
          {err && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</p>}
          <form onSubmit={submit} className="mt-4 space-y-3">
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Correo" className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400" />
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Contraseña" className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400" />
            <button className="w-full rounded-full bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800">Ingresar</button>
          </form>
          <p className="mt-4 text-sm text-stone-500">¿No tenés cuenta? <Link to="/registro" className="font-medium text-emerald-700 hover:underline">Registrate</Link></p>
          <div className="mt-3 space-y-1 text-xs text-stone-400">
            <p>Usuario: demo@hobbyconnect.cr / demo1234</p>
            <p>Admin: admin@hobbyconnect.cr / admin1234</p>
          </div>
        </div>
      </div>
    </section>
  );
}
