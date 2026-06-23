import { Link } from "react-router-dom";
import { Compass, Plus, Sparkles } from "lucide-react";
import Stat from "../components/Stat.jsx";

export default function Hero() {
  return (
    <section id="inicio" className="hero-bg relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="reveal mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Sparkles size={13} /> Tu gente, tu nivel, tu hobby
          </span>
          <h1 className="font-display mt-5 text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Encontrá personas que comparten tu pasión.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
            HobbyConnect reúne a personas geográficamente dispersas para coordinar, documentar y disfrutar su hobby,
            con gente de un nivel de desempeño e interés similar.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/grupos" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-800 sm:w-auto">
              <Compass size={18} /> Explorar grupos
            </Link>
            <Link to="/crear" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-base font-semibold text-stone-800 transition hover:border-emerald-300 hover:bg-stone-50 sm:w-auto">
              <Plus size={18} /> Crear un grupo
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-6">
            <Stat value="40+" label="grupos activos" />
            <Stat value="10" label="hobbies" />
            <Stat value="15" label="comunidades" />
          </div>
        </div>
      </div>
    </section>
  );
}
