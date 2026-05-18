import Link from "next/link";
import SearchBar from "../search/SearchBar";

export default function Navbar() {
    return (
        <header className="fixed left-0 top-0 z-50 w-full glass-panel border-b-0">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-4 md:px-16">
                <Link href="/" className="group flex items-center gap-3">
                    <img src="/neocinema_logo.png" alt="NeoCinema Logo" className="h-10 w-10 object-contain rounded-xl" />
                    <h1 className="text-2xl font-black tracking-tighter text-white transition-all group-hover:scale-105">
                        NEO<span className="text-red-600">CINEMA</span>
                    </h1>
                </Link>

                {/* LINKS */}
                <nav className="hidden items-center gap-8 md:flex">
                    {[
                        { name: "Home", href: "/" },
                        { name: "Discover", href: "/search" },
                        { name: "Movies", href: "/movies" },
                        { name: "Series", href: "/series" },
                        { name: "Watchlist", href: "/watchlist" },
                    ].map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-neutral-400 transition-all hover:text-white hover:text-glow"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* SEARCH */}
                {/* <div className="flex items-center gap-4">
                    <SearchBar />
                    <button className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-red-700 hover:red-glow">
                        Login
                    </button>
                </div> */}
            </div>
        </header>
    );
}