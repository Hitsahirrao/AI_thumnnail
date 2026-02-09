import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const navlinks = [
        {
            href: "#creations",
            text: "Creations",
        },
        {
            href: "#about",
            text: "About",
        },
        {
            href: "#testimonials",
            text: "Testimonials",
        },
        {
            href: "#contact",
            text: "Contact",
        },
    ];
    return (
        <>
            <motion.nav className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link to='/'>
                    <img src="\src\assets\logo.svg" alt="logo" className="h-8.5 w-auto"/>
                </Link>

                <div className="hidden lg:flex items-center gap-8 transition duration-500">
                    <Link to='/' className="hover:text-slate-300 transition">
                        Home
                    </Link>
                    <Link to='/generate' className="hover:text-slate-300 transition">
                        Generate
                    </Link>
                    <Link to='/my-generation' className="hover:text-slate-300 transition">
                        My Generations
                    </Link>
                    <Link to='#' className="hover:text-slate-300 transition">
                        Contact
                    </Link>
                </div>
                
                <div className="hidden lg:block space-x-3">
                    <button onClick={()=> navigate('/login')} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md active:scale-95">
                        Get started
                    </button>
                </div>
                <button onClick={() => setIsMenuOpen(true)} className="lg:hidden active:scale-90 transition">
                    <MenuIcon className="size-6.5" />
                </button>
            </motion.nav>
            <div className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-transform duration-400 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col items-center gap-8">
                    <Link onClick={() => setIsMenuOpen(false)} to='/'>
                        Home
                    </Link>
                    <Link onClick={() => setIsMenuOpen(false)} to='/generate'>
                        Generate
                    </Link>
                    <Link onClick={() => setIsMenuOpen(false)} to='/my-generation' >
                        My Generations
                    </Link>
                    <Link onClick={() => setIsMenuOpen(false)} to='#'>
                        Contact
                    </Link>
                    <Link onClick={() => setIsMenuOpen(false)} to='/login'>
                        Login
                    </Link>
                </div>
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="active:ring-2 active:ring-white aspect-square w-10 h-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex"
                    aria-label="Close menu"
                >
                    <XIcon />
                </button>
            </div>
        </>
    );
}