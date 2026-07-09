import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "NetMirrors' Privacy Policy. Learn how we collect, use, and protect your personal information when you use our movie and TV series discovery platform.",
    alternates: { canonical: "/privacy" },
    robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen pt-28 pb-20 px-6 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 pb-2">
                    Privacy Policy
                </h1>
                <p className="text-neutral-500 text-sm mb-12">Last updated: June 18, 2026</p>

                <div className="prose prose-invert prose-neutral max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            Welcome to NetMirrors (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at www.neocinematv.com (the &quot;Site&quot;).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                        <h3 className="text-lg font-bold text-white mb-2">2.1 Information Automatically Collected</h3>
                        <p className="text-neutral-400 leading-relaxed mb-4">
                            When you visit our Site, we may automatically collect certain information about your device, including:
                        </p>
                        <ul className="list-disc list-inside text-neutral-400 space-y-2 ml-4">
                            <li>Browser type and version</li>
                            <li>Operating system</li>
                            <li>IP address (anonymized)</li>
                            <li>Pages visited and time spent on pages</li>
                            <li>Referring website addresses</li>
                            <li>Device type (desktop, mobile, tablet)</li>
                        </ul>

                        <h3 className="text-lg font-bold text-white mt-6 mb-2">2.2 Cookies and Tracking Technologies</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            We use cookies and similar tracking technologies (such as Google Analytics) to track activity on our Site and hold certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">We use the information we collect to:</p>
                        <ul className="list-disc list-inside text-neutral-400 space-y-2 ml-4">
                            <li>Operate and maintain our Site</li>
                            <li>Improve, personalize, and expand our Site</li>
                            <li>Understand and analyze how you use our Site</li>
                            <li>Develop new features and functionality</li>
                            <li>Monitor and analyze usage patterns and trends</li>
                            <li>Detect and prevent technical issues</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">We use the following third-party services:</p>
                        <ul className="list-disc list-inside text-neutral-400 space-y-2 ml-4">
                            <li><strong className="text-white">Google Analytics:</strong> For website traffic analysis. Google&apos;s privacy policy can be found at google.com/policies/privacy.</li>
                            <li><strong className="text-white">Vercel Analytics:</strong> For performance monitoring and usage insights.</li>
                            <li><strong className="text-white">The Movie Database (TMDB):</strong> For movie and TV series metadata. TMDB&apos;s terms can be found at themoviedb.org/terms-of-use.</li>
                            <li><strong className="text-white">Cloudflare:</strong> For DNS and security services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Advertising</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">
                            We may use third-party advertising companies, including Google AdSense, to serve ads when you visit our Site. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
                        </p>
                        <p className="text-neutral-400 leading-relaxed mb-4">
                            Google, as a third-party vendor, uses cookies to serve ads on our Site. Google&apos;s use of the DART cookie enables it to serve ads to our users based on previous visits to our Site and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
                        </p>
                        <p className="text-neutral-400 leading-relaxed">
                            You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-red-500 hover:text-red-400 transition-colors" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. Additionally, you can opt out of third-party vendor cookies by visiting the <a href="https://optout.networkadvertising.org/" className="text-red-500 hover:text-red-400 transition-colors" target="_blank" rel="noopener noreferrer">Network Advertising Initiative opt-out page</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            We retain automatically collected data for a reasonable period of time for analytical purposes. Analytics data is typically retained for 26 months in Google Analytics before being automatically deleted.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">Depending on your location, you may have the following rights:</p>
                        <ul className="list-disc list-inside text-neutral-400 space-y-2 ml-4">
                            <li>The right to access the personal data we hold about you</li>
                            <li>The right to request correction of inaccurate data</li>
                            <li>The right to request deletion of your data</li>
                            <li>The right to opt-out of cookies and tracking</li>
                            <li>The right to data portability</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Children&apos;s Privacy</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Privacy Policy</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
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
