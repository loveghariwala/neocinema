"use client";

import { useState, useEffect } from "react";
import { Check, Copy, Gift, Share2, Sparkles, Users, X } from 'lucide-react';

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
    const [copied, setCopied] = useState(false);
    const [referralCount, setReferralCount] = useState(0);
    const [referralCode, setReferralCode] = useState("");

    // Initialize state
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedCount = localStorage.getItem("neo_referral_count");
            if (savedCount) {
                setReferralCount(parseInt(savedCount, 10));
            }
            let code = localStorage.getItem("neo_referral_code");
            if (!code) {
                code = Math.random().toString(36).substring(2, 8).toUpperCase();
                localStorage.setItem("neo_referral_code", code);
            }
            setReferralCode(code);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const referralUrl = typeof window !== "undefined"
        ? `${window.location.origin}/referral?ref=${referralCode}`
        : `https://www.neocinematv.com/referral?ref=${referralCode}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    const handleSimulateReferral = () => {
        const newCount = referralCount + 1;
        setReferralCount(newCount);
        if (typeof window !== "undefined") {
            localStorage.setItem("neo_referral_count", String(newCount));
        }
    };

    const handleReset = () => {
        setReferralCount(0);
        if (typeof window !== "undefined") {
            localStorage.setItem("neo_referral_count", "0");
        }
    };

    const milestones = [
        { count: 1, reward: "1 Hour Ad-Free Stream", icon: Sparkles, desc: "Remove video overlay ads for 1 hour" },
        { count: 5, reward: "AI Personalized Playlists", icon: Gift, desc: "Unlock bespoke cinematic recommendations" },
        { count: 10, reward: "Permanent VIP Ad-Free Status", icon: Users, desc: "Total ad removal & VIP server priorities" }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            {/* Modal Box */}
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.08] bg-neutral-950/95 p-6 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.9)] backdrop-blur-3xl transition-all duration-300">
                {/* Glowing Aura Effect */}
                <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-red-600/10 blur-[60px]" />
                <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-red-600/10 blur-[60px]" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                        <Gift className="text-red-500 h-6 w-6 animate-pulse" />
                        <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                            Neocinema Referral Program
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 border border-white/10 bg-white/5 text-neutral-400 hover:text-white transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Subtitle / Call-to-action */}
                <p className="text-neutral-400 text-sm md:text-base mb-6 relative z-10 leading-relaxed">
                    Invite your friends to Neocinema. When they visit or sign up via your link, you both unlock premium perks and custom theme layouts!
                </p>

                {/* Referral Link Copy Area */}
                <div className="mb-8 relative z-10">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-2">
                        Your Unique Invite Link
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-md">
                        <input
                            type="text"
                            readOnly
                            value={referralUrl}
                            className="w-full bg-transparent px-3 text-xs md:text-sm text-neutral-300 outline-none select-all"
                        />
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${copied
                                    ? "bg-green-600/20 text-green-400 border border-green-500/30"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                                }`}
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3 w-3" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3 w-3" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Quick Social Share Buttons */}
                <div className="mb-8 relative z-10">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-3">
                        Quick Share
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(`Check out Neocinema! Discover movies, trailers & where to watch with AI recommendations: ${referralUrl}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <span className="font-bold text-green-500 text-center">WhatsApp</span>
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Discover movies & series with AI-powered recommendations! Check it out:`)}&url=${encodeURIComponent(referralUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <span className="font-bold text-sky-400 text-center">Twitter</span>
                        </a>
                        <a
                            href={`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent("Discover movies, trailers & cast info on Neocinema!")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <span className="font-bold text-sky-500 text-center">Telegram</span>
                        </a>
                        <a
                            href={`mailto:?subject=Discover Movies on Neocinema&body=Hey, check out Neocinema for movie discovery, trailers & recommendations: ${referralUrl}`}
                            className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <span className="font-bold text-red-500 text-center">Email</span>
                        </a>
                    </div>
                </div>

                {/* Milestone Progress Bar */}
                <div className="mb-6 relative z-10 border-t border-white/5 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-white">Your Referrals</h3>
                            <p className="text-[11px] text-neutral-400">Simulated Milestone Progress</p>
                        </div>
                        <div className="rounded-full bg-red-500/10 px-3 py-1 border border-red-500/20 text-xs font-black text-red-500">
                            {referralCount} Referred
                        </div>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="relative h-2 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-500"
                            style={{ width: `${Math.min((referralCount / 10) * 100, 100)}%` }}
                        />
                    </div>

                    {/* Milestones Map */}
                    <div className="mt-4 space-y-2">
                        {milestones.map((m) => {
                            const isReached = referralCount >= m.count;
                            return (
                                <div
                                    key={m.count}
                                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${isReached
                                            ? "bg-red-600/10 border-red-500/30 text-white"
                                            : "bg-white/[0.01] border-white/5 text-neutral-500"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isReached ? "bg-red-600/20 text-red-500" : "bg-white/5 text-neutral-600"
                                            }`}>
                                            <m.icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className={`text-xs font-bold ${isReached ? "text-white" : "text-neutral-400"}`}>
                                                {m.reward}
                                            </p>
                                            <p className="text-[10px] text-neutral-500">{m.desc}</p>
                                        </div>
                                    </div>
                                    <div className="text-[11px] font-black uppercase tracking-wider">
                                        {isReached ? "Unlocked" : `${m.count} Left`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Simulation controls to show the viral loop easily */}
                <div className="flex items-center justify-between gap-3 relative z-10 border-t border-white/5 pt-4">
                    <button
                        onClick={handleSimulateReferral}
                        className="flex-grow flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer"
                    >
                        <Share2 className="h-3.5 w-3.5" />
                        Simulate Invite Click (+1)
                    </button>
                    <button
                        onClick={handleReset}
                        className="rounded-xl border border-white/5 bg-transparent px-3 py-2.5 text-xs font-bold text-neutral-500 hover:text-white transition-colors cursor-pointer"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
