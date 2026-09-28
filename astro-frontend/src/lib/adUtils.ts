/**
 * Adsterra Anti-Adblock Pop-under Trigger
 * Controls anti-adblock pop-under script injection on movie card click,
 * with single-trigger session frequency capping.
 */

const POPUNDER_STORAGE_KEY = "neocinema_card_popunder_done";
const POPUNDER_SCRIPT_SRC = "https://scarleterror.com/c2/8d/3a/c28d3aac5fc463198cc00359f362b421.js";

let isScriptInjected = false;

/**
 * Pre-loads the pop-under script on card hover / touch so it's ready when clicked.
 */
export function prepareCardPopunder() {
    if (typeof window === "undefined") return;
    try {
        if (sessionStorage.getItem(POPUNDER_STORAGE_KEY)) return;
        if (isScriptInjected || document.querySelector(`script[src="${POPUNDER_SCRIPT_SRC}"]`)) {
            isScriptInjected = true;
            return;
        }

        const script = document.createElement("script");
        script.src = POPUNDER_SCRIPT_SRC;
        script.async = true;
        script.dataset.cfasync = "false";
        document.head.appendChild(script);
        isScriptInjected = true;
    } catch {
        // Handle private browsing or restrictive storage environments safely
    }
}

/**
 * Handles movie card click to ensure pop-under triggers only once per session.
 */
export function handleCardClickPopunder() {
    if (typeof window === "undefined") return;
    try {
        if (sessionStorage.getItem(POPUNDER_STORAGE_KEY)) return;

        // If not already prepared on hover, inject now
        prepareCardPopunder();

        // Mark as triggered in this session so it won't fire again
        sessionStorage.setItem(POPUNDER_STORAGE_KEY, "true");
    } catch {
        // Handle storage errors safely
    }
}
