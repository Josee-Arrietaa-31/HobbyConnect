import { LEVEL_STYLES } from "../data/seed.js";

export default function LevelBadge({ level }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${LEVEL_STYLES[level]}`}>
      {level}
    </span>
  );
}
