import { NavLink } from "react-router-dom";

export default function BrandLogo() {
  return (
    <NavLink to="/" className="group inline-flex items-center gap-3">
      
      <span className="text-2xl font-extrabold tracking-tight leading-none">
        <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
          Compa
        </span>
        <span className="text-white">riq</span>
      </span>

      
      <span className="hidden sm:block h-[2px] w-10 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 opacity-60 group-hover:opacity-90 transition" />
    </NavLink>
  );
}










