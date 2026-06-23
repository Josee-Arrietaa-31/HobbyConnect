export default function Stat({ value, label }) {
  return (
    <div>
      <div className="font-display text-3xl font-semibold text-emerald-800">{value}</div>
      <div className="text-sm text-stone-500">{label}</div>
    </div>
  );
}
