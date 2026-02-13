import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <motion.nav
        className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <Link to="/">
          <img src="\src\assets\logo.svg" alt="logo" className="h-8.5 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center gap-8 transition duration-500">
          <Link to="/" className="hover:text-slate-300 transition">Home</Link>
          <Link to="/generate" className="hover:text-slate-300 transition">Generate</Link>

          {isLoggedIn ? (
            <Link to="/my-generation" className="hover:text-slate-300 transition">
              My Generations
            </Link>
          ) : (
            <Link to="/about" className="hover:text-slate-300 transition">
              About
            </Link>
          )}

          <Link to="/#contact" className="hover:text-slate-300 transition">
            Contact US
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="relative group">
              <button className="rounded-full size-8 bg-white/20 border-2 border-white/10">
                {user?.name?.charAt(0).toUpperCase()}
              </button>
              <div className="absolute hidden group-hover:block top-6 right-0 pt-4">
                <button
                  onClick={() => logout()}
                  className="bg-white/20 border-2 border-white/10 px-5 py-1.5 rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md active:scale-95"
            >
              Get Started
            </button>
          )}

          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden active:scale-90 transition">
            <MenuIcon className="size-6.5" />
          </button>
        </div>

        
      </motion.nav>

      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-transform duration-400 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          <Link onClick={() => setIsMenuOpen(false)} to="/">Home</Link>
          <Link onClick={() => setIsMenuOpen(false)} to="/generate">Generate</Link>

          {isLoggedIn ? (
            <Link onClick={() => setIsMenuOpen(false)} to="/my-generation">My Generations</Link>
          ) : (
            <Link onClick={() => setIsMenuOpen(false)} to="/about">About</Link>
          )}

          <Link onClick={() => setIsMenuOpen(false)} to="/#contact">Contact us</Link>

          {isLoggedIn ? (
            <button onClick={() => { setIsMenuOpen(false); logout(); }}>Logout</button>
          ) : (
            <Link onClick={() => setIsMenuOpen(false)} to="/login">Login</Link>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen(false)}
          className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md flex"
        >
          <XIcon />
        </button>
      </div>
    </>
  );
}
