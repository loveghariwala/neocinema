"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Sparkles, Film, Tv, Library } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "Collections", href: "/collections", icon: Library },
        { name: "Discover", href: "/search", icon: Sparkles },
        { name: "Movies", href: "/movies", icon: Film },
        { name: "Series", href: "/series", icon: Tv },
    ];

    return (
        <>
            <header
                className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
                    isScrolled
                        ? "py-2"
                        : "py-4"
                }`}
            >
                {/* Glassmorphism background layer */}
                <div
                    className={`absolute inset-0 transition-all duration-500 ${
                        isScrolled
                            ? "bg-black/70 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                            : "bg-transparent border-b border-transparent"
                    }`}
                />

                <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 md:px-12">
                    {/* ─── LOGO ─────────────────────────────────── */}
                    <Link href="/" className="group flex items-center gap-3 z-10">
                        <div className="relative">
                            <img
                                src="/neocinema_logo.png"
                                alt="NeoCinema Logo"
                                className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                            {/* Glow ring on hover */}
                            <div className="absolute inset-0 rounded-full bg-red-600/0 transition-all duration-500 group-hover:bg-red-600/20 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] group-hover:scale-150" />
                        </div>
                        <h1 className="text-xl font-black tracking-tighter text-white transition-all">
                            NEO<span className="text-red-600">CINEMA</span>
                        </h1>
                    </Link>

                    {/* ─── DESKTOP NAV — Floating pill ────────── */}
                    <nav className="hidden lg:flex items-center">
                        <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-1.5 py-1.5 backdrop-blur-xl">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold transition-all duration-300 ${
                                            isActive
                                                ? "text-white"
                                                : "text-neutral-400 hover:text-white"
                                        }`}
                                    >
                                        {/* Active indicator background */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-active-pill"
                                                className="absolute inset-0 rounded-full bg-red-600/90 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 30,
                                                }}
                                            />
                                        )}
                                        <link.icon size={15} className="relative z-10" />
                                        <span className="relative z-10">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* ─── MOBILE HAMBURGER ────────────────────── */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 lg:hidden"
                        aria-label="Toggle Menu"
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={20} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </header>

            {/* ─── MOBILE FULLSCREEN DRAWER ─────────────── */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Drawer panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-x-0 top-[64px] z-50 lg:hidden"
                        >
                            <div className="mx-4 mt-2 rounded-3xl border border-white/[0.08] bg-neutral-950/95 p-4 shadow-[0_24px_64px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
                                <nav className="flex flex-col gap-1.5">
                                    {navLinks.map((link, idx) => {
                                        const isActive = pathname === link.href;
                                        return (
                                            <motion.div
                                                key={link.name}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.06 }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all ${
                                                        isActive
                                                            ? "bg-red-600/10 text-red-500 shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]"
                                                            : "text-neutral-400 hover:bg-white/5 hover:text-white"
                                                    }`}
                                                >
                                                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                                        isActive
                                                            ? "bg-red-600/20 text-red-500"
                                                            : "bg-white/5 text-neutral-500"
                                                    }`}>
                                                        <link.icon size={18} />
                                                    </div>
                                                    <span className="tracking-wide">{link.name}</span>
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="mobile-active"
                                                            className="ml-auto h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                                                        />
                                                    )}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </nav>

                                {/* Branding footer */}
                                <div className="mt-4 border-t border-white/5 pt-4 text-center">
                                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-neutral-600">
                                        AI-Powered Cinema
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}