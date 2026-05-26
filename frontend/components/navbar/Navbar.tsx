"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Sparkles, Film, Tv, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Handle scroll to transition navbar background
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Call once initially
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "search", href: "/search", icon: Sparkles },
        { name: "Movies", href: "/movies", icon: Film },
        { name: "Series", href: "/series", icon: Tv },
        { name: "Watchlist", href: "/watchlist", icon: Heart },
    ];

    return (
        <>
            <header
                className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${isScrolled
                    ? "bg-black/90 backdrop-blur-md border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3"
                    : "bg-transparent border-b border-transparent py-5"
                    }`}
            >
                <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 md:px-16">
                    <Link href="/" className="group flex items-center gap-3">
                        <img src="/neocinema_logo.png" alt="NeoCinema Logo" className="h-12 w-12 object-contain" />
                        <h1 className="text-2xl font-black tracking-tighter text-white transition-all group-hover:scale-105">
                            NEO<span className="text-red-600">CINEMA</span>
                        </h1>
                    </Link>

                    {/* DESKTOP LINKS */}
                    <nav className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm cursor-pointer font-bold text-glow transition-all hover:text-red-600 hover:text-glow ${isActive ? "text-red-600 font-bold text-glow" : "text-white"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* MOBILE HAMBURGER BUTTON */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10 md:hidden"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>

            {/* MOBILE DRAWER */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-x-0 top-[72px] bottom-0 z-40 bg-black/98 backdrop-blur-3xl md:hidden flex flex-col items-center justify-center p-8 gap-6 border-t border-white/5"
                    >
                        <nav className="flex flex-col items-center gap-6 w-full max-w-sm">
                            {navLinks.map((link, idx) => {
                                const isActive = pathname === link.href;
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="w-full"
                                    >
                                        <Link
                                            href={link.href}
                                            className={`flex items-center justify-center gap-4 w-full rounded-2xl border py-4 text-lg font-black transition-all ${isActive
                                                ? "bg-red-600/10 border-red-600/30 text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.15)]"
                                                : "bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            <link.icon size={20} className={isActive ? "text-red-500 animate-pulse" : "text-neutral-500"} />
                                            {link.name.toUpperCase()}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>

                        {/* Additional aesthetic branding inside mobile drawer */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 text-center"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600">
                                NeoCinema
                            </span>
                            <p className="text-[9px] text-neutral-600 font-bold mt-1 uppercase tracking-widest">
                                AI-Powered Cinematic Experience
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}