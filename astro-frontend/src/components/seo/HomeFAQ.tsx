import React from "react";

export default function HomeFAQ() {
    const faqs = [
        {
            question: "What is Neocinema?",
            answer: "Neocinema is an AI-powered movie and TV series discovery platform. Browse trending movies, view trailers, explore cast & crew details, read ratings, and find where to watch any title on official streaming services."
        },
        {
            question: "How does Neocinema help me find what to watch?",
            answer: "Our AI recommendation engine analyzes genres, ratings, and trends to suggest movies and series you'll love. You can also use our advanced multi-genre filter to combine genres, release years, and ratings to discover exactly what you're looking for."
        },
        {
            question: "Can I filter movies by multiple genres on Neocinema?",
            answer: "Yes! Neocinema allows you to select and combine multiple genres at the same time (e.g. Action + Comedy + Sci-Fi). You can combine these genre filters with release years, minimum/maximum ratings, or languages, and sort precisely by popularity, release date, or rating to discover exactly what you want."
        },
        {
            question: "Where does Neocinema get its movie data?",
            answer: "We use TMDB (The Movie Database) for comprehensive movie and TV series information including cast, crew, trailers, ratings, and release details. We also integrate with Watchmode to show you where to watch titles on official platforms like Netflix, Prime Video, and more."
        },
        {
            question: "Does Neocinema have trailers?",
            answer: "Yes! Every movie and series page features official trailers from YouTube, so you can preview content before deciding what to watch. We also show where each title is available to stream legally."
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
                        Discover Your Next Favorite <br className="hidden sm:block" /> Movie or Series
                    </h2>
                    <p className="text-neutral-400 font-medium md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Everything you need to know about discovering movies, TV shows, and anime on Neocinema.
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
                    <p>Neocinema is an AI-powered movie discovery engine that helps you find trending movies, TV series, and anime. Explore cast details, watch trailers, read ratings, and discover where to watch on official streaming platforms.</p>
                </div>
            </div>
        </section>
    );
}
