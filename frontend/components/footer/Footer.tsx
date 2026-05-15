import Link from "next/link";
import { Send, Code, Camera, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-background pt-20 pb-10 px-6 md:px-16">
            <div className="mx-auto max-w-[1600px]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="group">
                            <h2 className="text-3xl font-black tracking-tighter text-white mb-6">
                                NEO<span className="text-red-600">CINEMA</span>
                            </h2>
                        </Link>
                        <p className="text-neutral-500 text-sm leading-relaxed mb-8">
                            Experience the future of cinematic discovery. Our AI-powered platform brings you the best movies and series tailored to your taste.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="rounded-full bg-white/5 p-3 text-neutral-400 transition-all hover:bg-red-600 hover:text-white">
                                <Send size={18} />
                            </a>
                            <a href="#" className="rounded-full bg-white/5 p-3 text-neutral-400 transition-all hover:bg-red-600 hover:text-white">
                                <Camera size={18} />
                            </a>
                            <a href="#" className="rounded-full bg-white/5 p-3 text-neutral-400 transition-all hover:bg-red-600 hover:text-white">
                                <Code size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Navigation</h3>
                        <ul className="space-y-4">
                            {["Home", "Discover", "Movies", "Series", "Watchlist"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-neutral-500 text-sm hover:text-white transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Categories</h3>
                        <ul className="space-y-4">
                            {["Action", "Drama", "Sci-Fi", "Comedy", "Horror"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-neutral-500 text-sm hover:text-white transition-colors">{item}</Link>
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
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-red-600 transition-colors flex-1"
                            />
                            <button className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-red-700 transition-colors">
                                <Mail size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
                    <p className="text-neutral-600 text-xs">
                        &copy; {new Date().getFullYear()} NeoCinema. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-neutral-600 text-xs hover:text-white">Privacy Policy</Link>
                        <Link href="#" className="text-neutral-600 text-xs hover:text-white">Terms of Service</Link>
                        <Link href="#" className="text-neutral-600 text-xs hover:text-white">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
