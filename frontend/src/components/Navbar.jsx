import { Link, useNavigate } from "react-router-dom";
import { Mountain, LogOut, Shield } from "lucide-react";
import { useAuth } from "../store/store.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user && user.role === "admin";

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-stone-50/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-white"><Mountain size={20} /></span>
          <span className="font-display text-xl font-semibold tracking-tight">HobbyConnect</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 md:flex">
          <Link to="/" className="hover:text-emerald-700">Inicio</Link>
          <Link to="/grupos" className="hover:text-emerald-700">Explorar</Link>
          <Link to="/crear" className="hover:text-emerald-700">Crear grupo</Link>
          {user && <Link to="/perfil" className="hover:text-emerald-700">Perfil</Link>}
          {isAdmin && <Link to="/admin" className="inline-flex items-center gap-1 font-semibold text-orange-700 hover:text-orange-800"><Shield size={15} /> Admin</Link>}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-stone-500 sm:block">Hola, {user.name.split(" ")[0]}</span>
              <button onClick={() => { logout(); navigate("/"); }}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100">
                <LogOut size={15} /> Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 sm:block">Ingresar</Link>
              <Link to="/registro" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
