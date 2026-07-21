import React from "react";

export default function HomeFAQ() {
    const faqs = [
        {
            question: "Where can I stream the best trending movies at home for free?",
            answer: "Neocinema is one of the best free movie streaming sites with no sign up required. We offer a massive, daily-updated library of the top trending movies and TV series in HD quality, completely free."
        },
        {
            question: "Is Neocinema a safe free movie streaming web app with no download?",
            answer: "Yes. Unlike many other platforms like FMovies or 123movies, Neocinema focuses on providing a clean, cinematic experience. It is a safe free movie streaming web app that requires zero downloads and zero registrations."
        },
        {
            question: "How do I find what new movies to watch online free this week?",
            answer: "Our homepage automatically updates daily with the newest releases. Our AI-powered discovery engine ranks the top HD movies to stream without paying, making it easy to find good movies to watch right now."
        },
        {
            question: "What is the best free alternative to JustWatch for streaming?",
            answer: "If you're tired of JustWatch only showing paid subscription services, Neocinema is the ultimate free alternative. We instantly connect you to free streams for almost any movie or series you search for."
        },
        {
            question: "Can I filter movies by multiple genres and sort them on Neocinema?",
            answer: "Yes! Neocinema allows you to select and combine multiple genres at the same time (e.g. Action + Comedy + Sci-Fi). You can combine these genre filters with release years, minimum/maximum ratings, or languages, and sort precisely by popularity, release date, or rating to discover exactly what you want."
        }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="relative z-20 px-6 py-16 md:px-16 md:py-24 bg-neutral-950/80 border-t border-white/5 pointer-events-auto mt-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="max-w-5xl mx-auto space-y-16">
                <div className="text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        The Best Free Movie Streaming Site <br className="hidden sm:block"/> No Sign Up Required
                    </h2>
                    <p className="text-neutral-400 font-medium md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Everything you need to know about streaming your favorite HD movies and TV shows securely on Neocinema.
                    </p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] hover:border-red-500/20 transition-all duration-300 group">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-4 tracking-wide group-hover:text-red-400 transition-colors">{faq.question}</h3>
                            <p className="text-sm md:text-base text-neutral-400 leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs md:text-sm text-neutral-600 max-w-4xl mx-auto leading-loose">
                    <p>Neocinema provides a semantic search and AI movie discovery engine to help you find the top rated series and best movies of the year. Watch movies online seamlessly. Our platform indexes third-party streaming providers to offer the best trending movies to stream at home for free.</p>
                </div>
            </div>
        </section>
    );
}
