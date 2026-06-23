import { Link } from "react-router-dom";
import { Mountain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-white"><Mountain size={20} /></span>
              <span className="font-display text-xl font-semibold tracking-tight">HobbyConnect</span>
            </div>
            <p className="mt-3 text-sm text-stone-500">La plataforma para reunir a personas que comparten un hobby y un nivel similar.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <div className="font-semibold text-stone-800">Plataforma</div>
              <ul className="mt-3 space-y-2 text-stone-500">
                <li><Link to="/grupos" className="hover:text-emerald-700">Explorar</Link></li>
                <li><Link to="/crear" className="hover:text-emerald-700">Crear grupo</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-stone-800">Cuenta</div>
              <ul className="mt-3 space-y-2 text-stone-500">
                <li><a href="#" className="hover:text-emerald-700">Ingresar</a></li>
                <li><a href="#" className="hover:text-emerald-700">Registrarse</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-stone-800">Proyecto</div>
              <ul className="mt-3 space-y-2 text-stone-500">
                <li><a href="#" className="hover:text-emerald-700">Acerca de</a></li>
                <li><a href="#" className="hover:text-emerald-700">Contacto</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-stone-200 pt-6 text-center text-xs text-stone-400">
          © 2026 HobbyConnect · Proyecto Final — Administración de Proyectos, ITCR
        </div>
      </div>
    </footer>
  );
}
