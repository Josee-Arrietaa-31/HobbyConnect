import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HobbyCard from "../components/HobbyCard.jsx";
import { api } from "../api.js";

export default function FeaturedHobbies() {
  const [hobbies, setHobbies] = useState([]);

  useEffect(() => {
    api("/hobbies").then(setHobbies).catch(() => {});
  }, []);

  return (
    <section id="hobbies" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Hobbies destacados</h2>
          <p className="mt-1 text-stone-600">Explorá comunidades alrededor de lo que te apasiona.</p>
        </div>
        <Link to="/grupos" className="hidden items-center gap-1 text-sm font-medium text-emerald-700 hover:gap-2 sm:inline-flex">
          Ver todos <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {hobbies.map((h, i) => <HobbyCard key={h.id} hobby={h} index={i} />)}
      </div>
    </section>
  );
}
