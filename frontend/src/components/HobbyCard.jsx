import { Link } from "react-router-dom";
import { hobbyIcon } from "../data/seed.js";

export default function HobbyCard({ hobby, index = 0 }) {
  const Icon = hobbyIcon(hobby.name);
  return (
    <Link
      to={`/grupos?hobbyId=${hobby.id}`}
      style={{ animationDelay: `${index * 50}ms` }}
      className="reveal group flex flex-col items-start gap-3 rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon size={24} />
      </span>
      <div>
        <div className="font-display font-semibold leading-snug">{hobby.name}</div>
        <div className="text-sm text-stone-500">{hobby.groups} grupo(s)</div>
      </div>
    </Link>
  );
}
