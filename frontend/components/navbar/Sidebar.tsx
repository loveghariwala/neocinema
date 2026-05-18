"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Search,
    Film,
    Tv,
    History,
    Heart,
    Settings,
    LogOut,
    Sparkles
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Sparkles, label: "Discover", href: "/search" },
        { icon: Film, label: "Movies", href: "/movies" },
        { icon: Tv, label: "Series", href: "/series" },
    ];

    const userItems = [
        { icon: History, label: "History", href: "/history" },
        { icon: Heart, label: "Watchlist", href: "/watchlist" },
    ];

    return (
        <aside className="fixed left-0 top-10 z-50 hidden h-screen w-24 flex-col items-center border-r border-white/5 bg-black/40 py-8 backdrop-blur-2xl lg:flex">
            <Link href="/" className="mb-12 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 border border-white/10 shadow-[0_0_20px_rgba(220,38,38,0.25)] transition-all group-hover:scale-110">
                    <img src="/neocinema_logo.png" alt="NeoCinema Logo" className="h-9 w-9 object-contain rounded-xl" />
                </div>
            </Link>

            <nav className="flex flex-1 flex-col gap-8">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${pathname === item.href
                                ? "bg-red-600/10 text-red-600"
                                : "text-neutral-500 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <item.icon size={24} />
                        <span className="absolute left-full ml-4 whitespace-nowrap rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                            {item.label}
                        </span>
                        {pathname === item.href && (
                            <div className="absolute -left-6 h-8 w-1 rounded-r-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                        )}
                    </Link>
                ))}

                <div className="h-px w-8 bg-white/10" />

                {userItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="group relative flex h-12 w-12 items-center justify-center rounded-2xl text-neutral-500 transition-all hover:bg-white/5 hover:text-white"
                    >
                        <item.icon size={24} />
                        <span className="absolute left-full ml-4 whitespace-nowrap rounded-lg bg-neutral-800 px-3 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </nav>

            <div className="flex flex-col gap-6">
                <button className="group relative flex h-12 w-12 items-center justify-center rounded-2xl text-neutral-500 transition-all hover:bg-white/5 hover:text-white">
                    <Settings size={24} />
                </button>
                <button className="group relative flex h-12 w-12 items-center justify-center rounded-2xl text-red-600/50 transition-all hover:bg-red-600 hover:text-white">
                    <LogOut size={24} />
                </button>
            </div>
        </aside>
    );
}
