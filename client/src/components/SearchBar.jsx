export default function SearchBar({
  value,
  onChange,
  placeholder = "Search by name or brand...",
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2 text-sm text-white outline-none focus:ring-white/25"
    />
  );
}