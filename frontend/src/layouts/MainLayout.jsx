import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 p-6 border-r border-slate-800">
        <h2 className="text-xl font-bold mb-6">⚡ Smart City</h2>

        <nav className="flex flex-col gap-5 mt-6 text-sm">
          <Link to="/" className="block text-slate-400 hover:text-white">
            Dashboard
          </Link>

          <NavLink
            to="/prediction"
            className={({ isActive }) =>
              isActive
                ? "text-white font-semibold"
                : "text-slate-400 hover:text-white"
            }
          >
            Prediction
          </NavLink>

          <Link
            to="/renewables"
            className="block text-slate-400 hover:text-white"
          >
            Renewables
          </Link>

          <Link to="/zones" className="block text-slate-400 hover:text-white">
            Zones
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
