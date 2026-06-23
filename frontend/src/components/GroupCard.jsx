import { Link } from "react-router-dom";
import { MapPin, Users, Check } from "lucide-react";
import LevelBadge from "./LevelBadge.jsx";

export default function GroupCard({ group, index = 0 }) {
  return (
    <Link
      to={`/grupos/${group.id}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className="reveal group flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">{group.hobby}</span>
        <LevelBadge level={group.level} />
      </div>
      <h3 className="font-display mt-3 text-xl font-semibold">{group.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{group.description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-sm text-stone-500">
        <span className="inline-flex items-center gap-1.5"><MapPin size={15} className="text-orange-500" />{group.community}</span>
        <span className="inline-flex items-center gap-1.5"><Users size={15} />{group.members}</span>
      </div>
      {group.isMember && (
        <span className="mt-3 inline-flex w-max items-center gap-1 rounded-full bg-emerald-700 px-2.5 py-0.5 text-xs font-semibold text-white">
          <Check size={13} /> Sos miembro
        </span>
      )}
    </Link>
  );
}
