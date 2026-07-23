import Link from "next/link";
import { Camera, Code, Mail, Send } from 'lucide-react';


export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-background pt-20 pb-10 px-6 md:px-16">
            <div className="mx-auto max-w-[1600px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 xl:gap-10 mb-20">
                    <div>
                        <Link href="/" className="group">
                            <h2 className="text-3xl font-black tracking-tighter text-white mb-6">
                                NET<span className="text-red-600">MIRRORS</span>
                            </h2>
                        </Link>
                        <p className="text-neutral-500 text-sm leading-relaxed mb-8 text-justify">
                            Experience the future of cinematic discovery. Our AI-powered platform brings you the best movies and series tailored to your taste.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" aria-label="Send Message" className="rounded-full bg-white/5 p-3 text-neutral-400 transition-all hover:bg-red-600 hover:text-white">
                                <Send size={18} />
                            </a>
                            <a href="#" aria-label="View Instagram" className="rounded-full bg-white/5 p-3 text-neutral-400 transition-all hover:bg-red-600 hover:text-white">
                                <Camera size={18} />
                            </a>
                            <a href="#" aria-label="View GitHub Code" className="rounded-full bg-white/5 p-3 text-neutral-400 transition-all hover:bg-red-600 hover:text-white">
                                <Code size={18} />
                            </a>
                        </div>
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
                                { name: "FMovies Alternative", href: "/best-fmovies-alternative-2026" },
                                { name: "Duta Movie 21", href: "/duta-movie-21-alternative" },
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

                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Newsletter</h3>
                        <p className="text-neutral-500 text-sm mb-4">Stay updated with the latest releases.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                aria-label="Email address for newsletter"
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-red-600 transition-colors flex-1 w-full min-w-0"
                            />
                            <button aria-label="Subscribe to newsletter" className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-red-700 transition-colors">
                                <Mail size={18} />
                            </button>
                        </div>
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
