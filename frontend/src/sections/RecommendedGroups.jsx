import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import GroupCard from "../components/GroupCard.jsx";
import { api } from "../api.js";

export default function RecommendedGroups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    api("/groups").then((data) => setGroups(data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <section id="grupos" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Grupos recomendados</h2>
            <p className="mt-1 text-stone-600">Algunos grupos para empezar a compartir.</p>
          </div>
          <Link to="/grupos" className="hidden items-center gap-1 text-sm font-medium text-emerald-700 hover:gap-2 sm:inline-flex">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => <GroupCard key={g.id} group={g} index={i} />)}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl bg-emerald-700 px-8 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-display text-2xl font-semibold text-white">¿No encontrás tu grupo?</h3>
            <p className="mt-1 text-emerald-100">Creá uno y reuní a personas de tu nivel y comunidad.</p>
          </div>
          <Link to="/crear" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-emerald-800 transition hover:bg-emerald-50">
            <Plus size={18} /> Crear un grupo
          </Link>
        </div>
      </div>
    </section>
  );
}
