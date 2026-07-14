"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Flame, Gift, Shield, Sparkles, Trophy, Users } from 'lucide-react';
import { MotionDiv } from "@/components/layout/Motion";

export default function ReferralClient() {
    const [copied, setCopied] = useState(false);
    const [referralCount, setReferralCount] = useState(0);
    const [referralCode, setReferralCode] = useState("");
    const [showConfetti, setShowConfetti] = useState(false);

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
    }, []);

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

    const handleSimulate = () => {
        const newCount = referralCount + 1;
        setReferralCount(newCount);
        localStorage.setItem("neo_referral_count", String(newCount));
        if (newCount === 1 || newCount === 5 || newCount === 10) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };

    const handleReset = () => {
        setReferralCount(0);
        localStorage.setItem("neo_referral_count", "0");
    };

    const milestones = [
        { count: 1, reward: "1 Hour Ad-Free Playback", desc: "Instantly silences overlay & banner ads on the video player.", icon: Flame, unlocked: referralCount >= 1 },
        { count: 5, reward: "AI Personalized recommendations", desc: "Unlock priority deep neural matching filters in discovery search.", icon: Sparkles, unlocked: referralCount >= 5 },
        { count: 10, reward: "Permanent VIP Ad-Free Status", desc: "Never see any advertisement again, plus secure faster stream servers.", icon: Trophy, unlocked: referralCount >= 10 },
    ];

    return (
        <main className="min-h-screen bg-black text-neutral-300 py-32 px-6 md:px-16 lg:px-24 relative overflow-hidden">
            {/* Glowing background shapes */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-600/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-red-600/5 blur-[120px] pointer-events-none" />

            {showConfetti && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="text-xl md:text-2xl font-black text-red-500 bg-red-950/80 border border-red-500/30 px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-md animate-bounce">
                        🎉 Milestone Achieved! Reward Unlocked!
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Hero Section */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <MotionDiv
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-red-500 border border-red-500/20 mb-6">
                            <Gift className="h-4 w-4" />
                            Viral Referral Program
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
                            Stream Together. <br />
                            <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">Unlock Premium Free.</span>
                        </h1>
                        <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
                            Share NetMirrors with friends and earn permanent VIP status, personalized custom recommendation profiles, and premium priority stream pipelines.
                        </p>
                    </MotionDiv>
                </div>

                {/* Dashboard layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Referral Link & Simulation (2 columns wide on desktop) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Invitation Generator Card */}
                        <div className="rounded-3xl border border-white/[0.08] bg-neutral-950/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Users className="h-48 w-48 text-white" />
                            </div>

                            <h2 className="text-xl md:text-2xl font-black text-white mb-4">
                                Invite Friends & Family
                            </h2>
                            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                                Copy your personal invite code or link below. When people visit or open NetMirrors, they will be registered under your cohort, earning you exclusive rewards.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-2">
                                        Your Referral Link
                                    </label>
                                    <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2 backdrop-blur-md">
                                        <input
                                            type="text"
                                            readOnly
                                            value={referralUrl}
                                            className="w-full bg-transparent px-3 text-sm text-neutral-300 outline-none select-all"
                                        />
                                        <button
                                            onClick={handleCopy}
                                            className={`flex items-center gap-1.5 rounded-xl px-5 py-3 text-xs font-bold transition-all cursor-pointer ${
                                                copied
                                                    ? "bg-green-600/20 text-green-400 border border-green-500/30"
                                                    : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
                                            }`}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="h-4 w-4" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4" />
                                                    Copy Link
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Simulation controls */}
                                <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-white">Simulate Viral Loop</p>
                                        <p className="text-xs text-neutral-500">Simulate friends visiting your link</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSimulate}
                                            className="flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer"
                                        >
                                            <Flame className="h-4 w-4 text-red-500" />
                                            Simulate Visit (+1)
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="rounded-xl border border-white/5 bg-transparent px-3 py-2.5 text-xs font-bold text-neutral-500 hover:text-white transition-colors cursor-pointer"
                                        >
                                            Reset stats
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Viral loop steps explanation */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { step: "01", title: "Get Link", desc: "Generate your unique invite url in one click." },
                                { step: "02", title: "Share Out", desc: "Post to your social channels or send directly." },
                                { step: "03", title: "Get Rewards", desc: "Instantly unlock VIP ad-free features." },
                            ].map((s) => (
                                <div key={s.step} className="rounded-2xl border border-white/[0.04] bg-neutral-900/40 p-5">
                                    <div className="text-red-500 text-xs font-black tracking-widest mb-2 uppercase">{s.step} / Step</div>
                                    <h3 className="text-sm font-bold text-white mb-1">{s.title}</h3>
                                    <p className="text-xs text-neutral-500 leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Milestone Rewards Panel */}
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-white/[0.08] bg-neutral-950/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Your Progress</h3>
                                    <Link href="/referral/analytics" className="text-xs text-red-500 hover:text-white transition-colors underline">
                                        View Analytics Dashboard
                                    </Link>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-white">{referralCount}</div>
                                    <div className="text-[10px] uppercase font-bold text-red-500">Active referrals</div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="relative h-2 w-full rounded-full bg-white/5 mb-8 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-500"
                                    style={{ width: `${Math.min((referralCount / 10) * 100, 100)}%` }}
                                />
                            </div>

                            {/* Milestones list */}
                            <div className="space-y-4">
                                {milestones.map((m) => (
                                    <div
                                        key={m.count}
                                        className={`p-4 rounded-2xl border transition-all ${
                                            m.unlocked
                                                ? "bg-red-600/10 border-red-500/30 text-white"
                                                : "bg-white/[0.02] border-white/5 text-neutral-500"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl shrink-0 ${
                                                m.unlocked ? "bg-red-600/20 text-red-500" : "bg-white/5 text-neutral-600"
                                            }`}>
                                                <m.icon className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-xs font-bold ${m.unlocked ? "text-white" : "text-neutral-400"}`}>
                                                        {m.reward}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-wider">
                                                        {m.count} {m.count === 1 ? "Friend" : "Friends"}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-neutral-500 leading-relaxed">
                                                    {m.desc}
                                                </p>
                                                {m.unlocked && (
                                                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-green-400 pt-1.5">
                                                        <Shield className="h-3 w-3" />
                                                        Claimed & Active
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ section */}
                <div className="mt-20 border-t border-white/10 pt-12">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div>
                            <h4 className="text-sm font-bold text-white mb-2">How do referrers earn rewards?</h4>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                When someone opens NetMirrors for the first time using your unique invite link, our system cookies them under your cohort. Any milestones you hit are unlocked instantly.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-2">Is the referral limit permanent?</h4>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                Yes! Once you reach 10 active referrals, your NetMirrors profile gains permanent VIP status, unlocking a lifetime of premium features and priority streaming servers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
