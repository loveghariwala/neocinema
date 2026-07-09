import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "NetMirrors Terms of Service. Read our terms and conditions governing the use of our movie and TV series discovery platform.",
    alternates: { canonical: "/terms" },
    robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen pt-28 pb-20 px-6 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 pb-2">
                    Terms of Service
                </h1>
                <p className="text-neutral-500 text-sm mb-12">Last updated: June 18, 2026</p>

                <div className="prose prose-invert prose-neutral max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            By accessing or using NetMirrors (&quot;the Site&quot;), located at www.neocinematv.com, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these Terms, you may not access the Site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            NetMirrors is a movie and television series discovery platform that provides information about films, TV shows, cast members, and related content. Our platform uses AI-powered recommendations and semantic search to help users discover entertainment content. We aggregate publicly available metadata from sources including The Movie Database (TMDB) API.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Intellectual Property</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">
                            The Site and its original content (excluding content provided by third-party APIs), features, and functionality are owned by NetMirrors and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                        <p className="text-neutral-400 leading-relaxed">
                            Movie and TV show metadata, images, and descriptions are provided by The Movie Database (TMDB). This product uses the TMDB API but is not endorsed or certified by TMDB. All movie posters, backdrop images, and related media are the property of their respective copyright holders.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. User Conduct</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">You agree not to:</p>
                        <ul className="list-disc list-inside text-neutral-400 space-y-2 ml-4">
                            <li>Use the Site for any unlawful purpose or in violation of any applicable laws</li>
                            <li>Attempt to gain unauthorized access to our systems or data</li>
                            <li>Interfere with or disrupt the integrity or performance of the Site</li>
                            <li>Scrape, crawl, or use automated means to access the Site without permission</li>
                            <li>Reproduce, duplicate, or copy any portion of the Site without express written permission</li>
                            <li>Use the Site to transmit malware, viruses, or other harmful code</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Warranties</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            The Site is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. We do not warrant that the Site will be uninterrupted, secure, or error-free. We make no warranties about the accuracy or completeness of the content on the Site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            In no event shall NetMirrors, its directors, employees, partners, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation loss of profits, data, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Third-Party Content</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            Our Site may contain links to third-party websites or services that are not owned or controlled by NetMirrors. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that NetMirrors shall not be liable for any damage or loss caused by the use of any such content, goods, or services available through any third-party websites.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. DMCA / Copyright</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            We respect the intellectual property rights of others. If you believe that any content on our Site infringes upon your copyright, please contact us with the following information: a description of the copyrighted work, the URL where the infringing material is located, and your contact information. We will respond to valid DMCA notices promptly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Terms</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in India.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            If you have any questions about these Terms, please contact us at:
                        </p>
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
