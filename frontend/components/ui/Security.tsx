"use client";

import { useEffect } from "react";
import DisableDevtool from 'disable-devtool';

export default function Security() {
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            return;
        }

        if (typeof window !== "undefined") {
            // Actively block devtools, network tab, and console inspection
            DisableDevtool();
        }

        // Prevent Right Click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Prevent Keyboard Shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
                (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) ||
                (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) ||
                (e.ctrlKey && (e.key === "U" || e.key === "u")) ||
                (e.metaKey && e.altKey && (e.key === "I" || e.key === "i")) || // Mac
                (e.metaKey && e.altKey && (e.key === "J" || e.key === "j")) || // Mac
                (e.metaKey && e.altKey && (e.key === "U" || e.key === "u"))    // Mac
            ) {
                e.preventDefault();
            }
        };

        // Aggressively clear and lockout console
        setTimeout(() => {
            console.clear();
            const noop = () => { };
            Object.keys(console).forEach((method) => {
                if (typeof (console as any)[method] === "function") {
                    (console as any)[method] = noop;
                }
            });
        }, 100);

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return null;
}
