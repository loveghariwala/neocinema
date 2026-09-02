import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

export const metadata: Metadata = {
    title: "Disclaimer",
    description: "Neocinema Disclaimer. Read our disclaimers regarding content accuracy, third-party links, advertising, and limitations of liability.",
    alternates: { canonical: `${baseUrl}/disclaimer` },
    robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
    return (
        <main className="min-h-screen pt-28 pb-20 px-6 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 pb-2">Disclaimer</h1>
                <p className="text-neutral-500 text-sm mb-12">Last updated: June 18, 2026</p>

                <div className="prose prose-invert prose-neutral max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. General Information</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            The information provided on Neocinema (&quot;the Site&quot;), located at www.neocinematv.com, is for general informational and entertainment purposes only. All information on the Site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Content Accuracy</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            Neocinema aggregates movie and television series information from third-party sources, primarily The Movie Database (TMDB) API. While we strive to display accurate and up-to-date information, we cannot guarantee the accuracy of all metadata, ratings, descriptions, release dates, or other content displayed on our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Not a Streaming Service</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            Neocinema is a content discovery and information platform. We do not host, stream, or provide any copyrighted video content. Our platform helps users discover movies and TV shows and provides information about where content may be available through legitimate streaming services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Links</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            The Site may contain links to third-party websites or services. These links are provided for your convenience and do not signify our endorsement of such websites or services. We have no control over the content, privacy policies, or practices of any third-party websites.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Advertising Disclosure</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">
                            Neocinema may display advertisements provided by third-party advertising networks, including Google AdSense. These advertisements are clearly distinguishable from our editorial content. We may earn revenue from advertisements displayed on our Site. This advertising revenue helps us maintain and improve the free services we offer.
                        </p>
                        <p className="text-neutral-400 leading-relaxed mb-4">
                            Third-party ad networks may use cookies and similar technologies to serve ads based on your prior visits to our Site or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our Site and/or other sites on the Internet.
                        </p>
                        <p className="text-neutral-400 leading-relaxed">
                            You may opt out of personalized advertising by visiting{" "}
                            <a href="https://www.google.com/settings/ads" className="text-red-500 hover:text-red-400 transition-colors" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. AI-Generated Recommendations</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            Neocinema uses artificial intelligence and machine learning algorithms to provide content recommendations. These recommendations are generated automatically and do not represent editorial opinions or endorsements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            All movie posters, backdrop images, trailers, and related media displayed on Neocinema are the property of their respective copyright holders. This product uses the TMDB API but is not endorsed or certified by TMDB.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            Under no circumstances shall Neocinema or its creators be held liable for any damages arising out of the use or inability to use the materials on our Site. Because some jurisdictions do not allow limitations on implied warranties, these limitations may not apply to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
                        <p className="text-neutral-400 leading-relaxed">If you have any questions about this Disclaimer, please contact us at:</p>
                        <p className="text-neutral-400 mt-2">
                            <strong className="text-white">Email:</strong> contact@neocinematv.com<br />
                            <strong className="text-white">Website:</strong> www.neocinematv.com
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
