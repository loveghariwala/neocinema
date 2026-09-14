import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-background pt-20 pb-10 px-6 md:px-16">
            <div className="mx-auto max-w-[1600px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 mb-20">
                    <div>
                        <Link href="/" className="group">
                            <span className="block text-3xl font-black tracking-tighter text-white mb-6">
                                NEO<span className="text-red-600">CINEMA</span>
                            </span>
                        </Link>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Discover movies, TV series and anime. Browse trailers, cast details and where to watch legally.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Navigation</h3>
                        <ul className="space-y-4">
                            {[
                                { name: "Home", href: "/" },
                                { name: "Discover", href: "/search" },
                                { name: "Movies", href: "/movies" },
                                { name: "Series", href: "/series" },
                                { name: "Blog", href: "/blog" },
                                { name: "About Us", href: "/about" },
                                { name: "Contact", href: "/contact" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-neutral-500 text-sm hover:text-white transition-colors">{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Top Categories</h3>
                        <ul className="space-y-4">
                            {[
                                { name: "Action Movies Free", href: "/watch/action-movies-free" },
                                { name: "Horror Movies Free", href: "/watch/horror-movies-free" },
                                { name: "Sci-Fi Movies Free", href: "/watch/sci-fi-movies-free" },
                                { name: "Bollywood Movies HD", href: "/watch/bollywood-movies-free" },
                                { name: "Korean Dramas Free", href: "/watch/korean-dramas-free" },
                                { name: "New Movies 2026", href: "/watch/new-movies-2026" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-neutral-500 text-sm hover:text-white transition-colors">{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Legal</h3>
                        <ul className="space-y-4">
                            {[
                                { name: "DMCA Policy", href: "/dmca" },
                                { name: "Privacy Policy", href: "/privacy" },
                                { name: "Terms of Service", href: "/terms" },
                                { name: "Cookie Policy", href: "/cookies" },
                                { name: "Disclaimer", href: "/disclaimer" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-neutral-500 text-sm hover:text-white transition-colors">{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
                    <p className="text-neutral-600 text-xs">
                        &copy; {new Date().getFullYear()} Neocinema. All rights reserved.
                    </p>
                    <div className="flex flex-wrap gap-4 md:gap-6">
                        <Link href="/privacy" className="text-neutral-600 text-xs hover:text-white">Privacy Policy</Link>
                        <Link href="/terms" className="text-neutral-600 text-xs hover:text-white">Terms of Service</Link>
                        <Link href="/cookies" className="text-neutral-600 text-xs hover:text-white">Cookie Policy</Link>
                        <Link href="/disclaimer" className="text-neutral-600 text-xs hover:text-white">Disclaimer</Link>
                        <Link href="/about" className="text-neutral-600 text-xs hover:text-white">About Us</Link>
                        <Link href="/contact" className="text-neutral-600 text-xs hover:text-white">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
