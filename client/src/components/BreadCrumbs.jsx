import { NavLink } from "react-router-dom";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="text-sm text-white/60">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-2">
              {idx !== 0 && <span className="text-white/25">/</span>}
              {it.to && !isLast ? (
                <NavLink to={it.to} className="hover:text-white transition">
                  {it.label}
                </NavLink>
              ) : (
                <span className={isLast ? "text-white/80" : ""}>{it.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
