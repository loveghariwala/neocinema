import { Metadata } from "next";
import { Mail, MapPin, Globe, Code } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the NeoCinema team for support, feedback, or DMCA requests.",
    alternates: { canonical: "/contact" },
    robots: { index: true, follow: true },
};

export default function ContactPage() {
    const cards = [
        { icon: Mail, title: "Email", subtitle: "For general inquiries", value: "contact@neocinematv.com", href: "mailto:contact@neocinematv.com" },
        { icon: MapPin, title: "Location", subtitle: "Where we're based", value: "India", href: null },
        { icon: Globe, title: "Website", subtitle: "Visit our platform", value: "www.neocinematv.com", href: "/" },
        { icon: Code, title: "GitHub", subtitle: "Report bugs or contribute", value: "@loveghariwala", href: "https://github.com/loveghariwala" },
    ];

    return (
        <main className="min-h-screen pt-28 pb-20 px-6 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 pb-2">Contact Us</h1>
                <p className="text-neutral-400 text-lg mb-12 max-w-2xl">
                    Have a question, feedback, or business inquiry? We&apos;d love to hear from you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {cards.map((card) => (
                        <div key={card.title} className="rounded-3xl border border-white/10 bg-neutral-950/50 p-8 backdrop-blur-xl relative overflow-hidden group hover:border-red-500/30 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-red-500 group-hover:bg-red-500/20 transition-all duration-500">
                                    <card.icon size={28} />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">{card.title}</h2>
                                <p className="text-neutral-400 text-sm mb-4">{card.subtitle}</p>
                                {card.href ? (
                                    <Link href={card.href} className="text-red-500 font-bold hover:text-red-400 transition-colors">{card.value}</Link>
                                ) : (
                                    <p className="text-white font-bold">{card.value}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-3xl border border-white/10 bg-neutral-950/50 p-8 md:p-12 backdrop-blur-xl">
                    <h2 className="text-2xl font-bold text-white mb-4">DMCA / Copyright Notices</h2>
                    <p className="text-neutral-400 leading-relaxed mb-4">
                        NeoCinema respects intellectual property rights. If you believe content on our platform infringes your copyright, please send a DMCA takedown notice to our email with a description of the copyrighted work, the infringing URL, and your contact information.
                    </p>
                    <p className="text-neutral-400">
                        Send notices to: <a href="mailto:contact@neocinematv.com" className="text-red-500 font-bold hover:text-red-400">contact@neocinematv.com</a>
                    </p>
                </div>
            </div>
        </main>
    );
}
