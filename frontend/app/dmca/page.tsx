import { Metadata } from "next";

export const metadata: Metadata = {
    title: "DMCA Copyright Policy & Takedown Notice",
    description: "NeoCinema DMCA Copyright Policy. Submit copyright infringement complaints and takedown notices directly to our designated agent.",
    alternates: { canonical: "/dmca" },
    robots: { index: true, follow: true },
};

export default function DmcaPage() {
    return (
        <main className="min-h-screen pt-28 pb-20 px-6 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 pb-2">
                    DMCA Copyright Policy
                </h1>
                <p className="text-neutral-500 text-sm mb-12">Last updated: July 23, 2026</p>

                <div className="prose prose-invert prose-neutral max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Digital Millennium Copyright Act (DMCA) Notice</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">
                            NeoCinema (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects the intellectual property rights of content creators, copyright owners, and trademark holders. In accordance with the Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512, we will respond expeditiously to clear notices of alleged copyright infringement submitted to our Designated DMCA Agent.
                        </p>
                        <p className="text-neutral-400 leading-relaxed font-bold bg-white/5 p-4 rounded-xl border border-white/10">
                            Please Note: NeoCinema is strictly an informational discovery platform, similar to IMDb or TMDB. We do not host, store, upload, or transmit any video files, movies, or TV shows on our servers. All metadata, cast information, and official trailers are aggregated using legitimate, official third-party APIs (such as TMDB, Watchmode, and YouTube). We only link to legal, authorized streaming providers.
                        </p>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-white mb-3">Designated DMCA Agent Contact</h2>
                        <p className="text-neutral-300 mb-4">
                            To submit a formal copyright infringement complaint or takedown request, please email our designated agent directly:
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-red-600/10 border border-red-500/20 rounded-xl p-4">
                            <span className="font-bold text-white text-lg">Email Contact:</span>
                            <a
                                href="mailto:jainapoorva300@gmail.com?subject=DMCA%20Takedown%20Notice"
                                className="text-red-500 hover:text-red-400 font-mono font-bold text-lg underline transition-colors"
                            >
                                jainapoorva300@gmail.com
                            </a>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Requirements for Submitting a Takedown Notice</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">
                            To ensure swift processing of your copyright complaint, your written notification must include substantially the following information as required under 17 U.S.C. § 512(c)(3):
                        </p>
                        <ul className="list-disc list-inside text-neutral-400 space-y-3 ml-4">
                            <li><strong className="text-white">Physical or Electronic Signature:</strong> A physical or electronic signature of a person authorized to act on behalf of the copyright holder.</li>
                            <li><strong className="text-white">Identification of Copyrighted Work:</strong> Clear identification of the copyrighted work claimed to have been infringed (or a representative list if multiple works are covered).</li>
                            <li><strong className="text-white">Exact URLs / Location:</strong> Specific URLs on NeoCinema (e.g., <code className="text-red-400">https://www.neocinematv.com/movies/12345</code>) where the allegedly infringing material or link is located.</li>
                            <li><strong className="text-white">Contact Information:</strong> Information reasonably sufficient to permit us to contact you, including your full legal name, physical address, telephone number, and email address.</li>
                            <li><strong className="text-white">Good Faith Statement:</strong> A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                            <li><strong className="text-white">Perjury Statement:</strong> A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Takedown & Response Process</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            Upon receipt of a valid and complete DMCA notice at <strong className="text-white">jainapoorva300@gmail.com</strong>, we will take immediate steps to remove or disable access to the specified material within 24 to 48 hours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Counter-Notification Procedure</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            If you believe your content was removed or disabled by mistake or misidentification, you may submit a formal counter-notification to our designated agent pursuant to 17 U.S.C. § 512(g)(3).
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
