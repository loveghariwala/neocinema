"use client";

import { useEffect } from "react";

export default function Security() {
    useEffect(() => {
        // Prevent Right Click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Prevent Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
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

        // Clear console and print warning
        setTimeout(() => {
            console.clear();
            console.log("%cHold Up!", "color: red; font-size: 50px; font-weight: bold; -webkit-text-stroke: 1px black;");
            console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or 'hack' someone's account, it is a scam and will give them access to your account.", "font-size: 16px;");
        }, 1000);

        // Anti-Debugging Trap removed to prevent React DOM mutation errors during Lighthouse audits

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return null;
}
