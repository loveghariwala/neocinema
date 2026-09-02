import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

export const metadata: Metadata = {
    title: "Cookie Policy",
    description: "Neocinema Cookie Policy. Learn how we use cookies, tracking technologies, and how to manage your cookie preferences.",
    alternates: { canonical: `${baseUrl}/cookies` },
    robots: { index: true, follow: true },
};

export default function CookiePolicyPage() {
    return (
        <main className="min-h-screen pt-28 pb-20 px-6 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 pb-2">Cookie Policy</h1>
                <p className="text-neutral-500 text-sm mb-12">Last updated: June 18, 2026</p>

                <div className="prose prose-invert prose-neutral max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used to make websites work more efficiently, provide a better user experience, and supply reporting information. Cookies set by the website owner (in this case, Neocinema) are called &quot;first-party cookies.&quot; Cookies set by parties other than the website owner are called &quot;third-party cookies.&quot;
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">We use cookies for the following purposes:</p>

                        <h3 className="text-lg font-bold text-white mb-2">2.1 Essential Cookies</h3>
                        <p className="text-neutral-400 leading-relaxed mb-4">
                            These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas. The website cannot function properly without these cookies.
                        </p>

                        <h3 className="text-lg font-bold text-white mb-2">2.2 Analytics Cookies</h3>
                        <p className="text-neutral-400 leading-relaxed mb-4">
                            We use Google Analytics and Vercel Analytics to understand how visitors interact with our website. These cookies collect information such as the number of visitors, pages viewed, time spent on pages, and traffic sources. This data helps us improve our website and provide a better user experience.
                        </p>

                        <h3 className="text-lg font-bold text-white mb-2">2.3 Advertising Cookies</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            We use Google AdSense to display advertisements on our website. Google and its partners may use cookies to serve ads based on your prior visits to our website or other websites on the Internet. These cookies enable Google to display personalized advertisements that are relevant to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Cookies</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">The following third-party services may set cookies when you visit our Site:</p>
                        <ul className="list-disc list-inside text-neutral-400 space-y-2 ml-4">
                            <li><strong className="text-white">Google Analytics</strong> — Used for website traffic analysis and performance monitoring.</li>
                            <li><strong className="text-white">Google AdSense</strong> — Used to serve relevant advertisements and track ad performance.</li>
                            <li><strong className="text-white">Vercel Analytics</strong> — Used for website performance insights and monitoring.</li>
                            <li><strong className="text-white">Cloudflare</strong> — Used for security, performance, and DNS services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Managing Cookies</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">
                            You can control and manage cookies in various ways. Please note that removing or blocking cookies may impact your user experience and some features may no longer be fully accessible.
                        </p>
                        <ul className="list-disc list-inside text-neutral-400 space-y-2 ml-4">
                            <li><strong className="text-white">Browser Settings:</strong> Most browsers allow you to control cookies through their settings. You can set your browser to refuse cookies, delete cookies, or alert you when a cookie is being set.</li>
                            <li><strong className="text-white">Google Ads Settings:</strong> You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" className="text-red-500 hover:text-red-400" target="_blank" rel="noopener noreferrer">google.com/settings/ads</a>.</li>
                            <li><strong className="text-white">NAI Opt-Out:</strong> Visit <a href="https://optout.networkadvertising.org/" className="text-red-500 hover:text-red-400" target="_blank" rel="noopener noreferrer">optout.networkadvertising.org</a> to opt out of third-party vendor cookies.</li>
                            <li><strong className="text-white">DAA Opt-Out:</strong> Visit <a href="https://optout.aboutads.info/" className="text-red-500 hover:text-red-400" target="_blank" rel="noopener noreferrer">optout.aboutads.info</a> for the Digital Advertising Alliance opt-out tool.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Changes to This Policy</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                        <p className="text-neutral-400 leading-relaxed">If you have any questions about our use of cookies, please contact us at:</p>
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
