"use client";

import { useState, useEffect } from "react";
import { Download, Smartphone, X, CheckCircle2, Share } from "lucide-react";

export default function InstallAppBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent || "";
        const mobile = /android|iphone|ipad|ipod/i.test(ua);
        setIsAndroid(/android/i.test(ua));

        // Check if already running in standalone mode (installed PWA)
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Listen for Chrome/Android/Desktop PWA install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);

            const dismissedAt = localStorage.getItem("neocinema_pwa_dismissed");
            if (!dismissedAt || Date.now() - parseInt(dismissedAt) > 24 * 60 * 60 * 1000) {
                setShowBanner(true);
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // Fallback timer for mobile/desktop browsers
        const timer = setTimeout(() => {
            const dismissedAt = localStorage.getItem("neocinema_pwa_dismissed");
            if (!isStandalone && (!dismissedAt || Date.now() - parseInt(dismissedAt) > 24 * 60 * 60 * 1000)) {
                setShowBanner(true);
            }
        }, 3000);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            clearTimeout(timer);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setIsInstalled(true);
                setShowBanner(false);
            }
            setDeferredPrompt(null);
        } else {
            // Show guide for manual Add to Home Screen on Android Chrome / Edge / Samsung Internet
            setShowGuide(true);
        }
    };

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem("neocinema_pwa_dismissed", Date.now().toString());
    };

    if (isInstalled || (!showBanner && !showGuide)) return null;

    return (
        <>
            {/* ─── Floating Bottom Banner for Android ──────────────────────────── */}
            {showBanner && !showGuide && (
                <div className="fixed bottom-4 left-4 right-4 z-[999] max-w-md mx-auto rounded-2xl bg-neutral-900/95 border border-red-500/30 p-4 shadow-[0_20px_50px_rgba(220,38,38,0.3)] backdrop-blur-2xl transition-all duration-500 animate-in slide-in-from-bottom-5">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-950 border border-white/10 p-1 shadow-inner">
                                <img src="/icon.png" alt="Neocinema Icon" className="h-full w-full object-contain rounded-lg" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                    <span>Neocinema App</span>
                                    <span className="text-[9px] font-black bg-red-600/30 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full uppercase">Quick Shortcut</span>
                                </h3>
                                <p className="text-xs text-neutral-400 font-medium">Add shortcut to home screen for 1-click watch</p>
                            </div>
                        </div>

                        <button
                            onClick={handleDismiss}
                            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                            aria-label="Close banner"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="mt-3.5 flex items-center gap-2">
                        <button
                            onClick={handleInstallClick}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 transition-all active:scale-95 touch-manipulation cursor-pointer"
                        >
                            <Download size={15} />
                            <span>Add Shortcut To Phone</span>
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-bold transition-all"
                        >
                            Later
                        </button>
                    </div>
                </div>
            )}

            {/* ─── Android Manual Shortcut Guide Modal ──────────────────────── */}
            {showGuide && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-white/10 p-6 shadow-2xl space-y-5 relative">
                        <button
                            onClick={() => setShowGuide(false)}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center space-y-2">
                            <div className="mx-auto h-16 w-16 rounded-2xl bg-red-600/10 border border-red-500/20 p-2 flex items-center justify-center text-red-500">
                                <Smartphone size={32} />
                            </div>
                            <h3 className="text-lg font-black text-white">Save Neocinema on Android</h3>
                            <p className="text-xs text-neutral-400">Follow 2 fast steps to add the app icon directly to your phone screen:</p>
                        </div>

                        <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/5 text-xs text-neutral-300 font-medium">
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-xs">1</span>
                                <p>Tap the <strong>3 dots (⋮)</strong> menu in Chrome browser at top right.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-xs">2</span>
                                <p>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowGuide(false)}
                            className="w-full py-3 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-900/40"
                        >
                            <CheckCircle2 size={16} />
                            <span>Got It</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
