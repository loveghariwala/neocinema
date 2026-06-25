"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import Film from "lucide-react/dist/esm/icons/film";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import User from "lucide-react/dist/esm/icons/user";


import MovieCard from "@/components/cards/MovieCard";

interface PersonPageClientProps {
    data: any;
}

export default function PersonPageClient({ data }: PersonPageClientProps) {
    const router = useRouter();

    if (!data || !data.person) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-black text-white">
                <h2 className="text-xl font-bold">Cast member not found</h2>
                <button
                    onClick={() => router.back()}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-red-700"
                >
                    <ArrowLeft size={16} /> Go Back
                </button>
            </div>
        );
    }

    const { person, results } = data;
    const profileUrl = person.profilePath
        ? `https://image.tmdb.org/t/p/h632${person.profilePath}`
        : "/placeholder.jpg";

    return (
        <main className="min-h-screen bg-black px-6 pb-20 pt-28 md:px-16 text-white">
            {/* Back Button */}
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-black uppercase tracking-widest text-neutral-400 backdrop-blur-xl transition-all hover:border-red-600/40 hover:bg-red-600/20 hover:text-white"
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    Back
                </button>
            </div>

            {/* Profile Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-16 items-start">
                {/* Profile Image */}
                <div
                    className="relative aspect-[2/3] w-full max-w-sm mx-auto md:mx-0 overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl border border-white/5"
                >
                    {person.profilePath ? (
                        <Image
                            src={profileUrl}
                            alt={person.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <User size={64} className="text-neutral-700" />
                        </div>
                    )}
                </div>

                {/* Profile Details */}
                <div className="md:col-span-2 space-y-6">
                    <div
                    >
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-2">
                            {person.name}
                        </h1>
                        <p className="text-red-500 font-bold uppercase tracking-[0.2em] text-sm">
                            Cast Member
                        </p>
                    </div>

                    <div
                        className="flex flex-wrap gap-6 text-sm text-neutral-400"
                    >
                        {person.birthday && (
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-red-600" />
                                <span>Born: {new Date(person.birthday).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        )}
                        {person.placeOfBirth && (
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-red-600" />
                                <span>{person.placeOfBirth}</span>
                            </div>
                        )}
                    </div>

                    {person.biography && (
                        <div
                            className="space-y-3"
                        >
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-500">
                                Biography
                            </h3>
                            <p className="text-neutral-300 leading-relaxed text-sm md:text-base font-medium max-h-[250px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-neutral-800">
                                {person.biography}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Filmography Section */}
            <div className="border-t border-white/5 pt-12">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase">
                        Filmography
                    </h2>
                    <span className="text-sm text-neutral-500 font-bold uppercase tracking-wider">
                        ({results?.length || 0} Titles)
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-red-600/30 to-transparent" />
                </div>

                {results && results.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {results.map((item: any, i: number) => (
                            <div
                                key={`${item.tmdbId}-${i}`}
                            >
                                <MovieCard movie={item} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-white/5 bg-white/[0.02]">
                        <Film size={32} className="mb-3 text-neutral-600" />
                        <h3 className="text-lg font-bold text-white">No content found</h3>
                        <p className="text-neutral-500">We couldn't find any movie or TV series credits for this person.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
