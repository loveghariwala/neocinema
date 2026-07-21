/**
 * Neocinema Fallback Layer
 * 
 * Implements the "FastAPI first, Next.js fallback" pattern.
 * Every external-data call goes through this: it tries FastAPI first,
 * and if that fails (network error, timeout, non-OK status), it
 * automatically falls back to the direct TMDB service in Next.js.
 * 
 * Also tracks FastAPI health status to avoid wasting time on a known-dead
 * service (circuit breaker pattern with auto-recovery).
 */

import { getAIServiceUrl } from "@/lib/config";

// ─── Circuit Breaker State ─────────────────────────────────────────────────
// If FastAPI fails N times in a row, skip it entirely for a cooldown period.
// This prevents slow responses when FastAPI is completely down.

let consecutiveFailures = 0;
let circuitOpenUntil = 0;

const MAX_FAILURES = 3;          // After 3 failures, open the circuit
const COOLDOWN_MS = 30 * 1000;   // Try FastAPI again after 30 seconds
const FASTAPI_TIMEOUT_MS = 8000; // 8 second timeout for FastAPI calls

function isCircuitOpen(): boolean {
    if (consecutiveFailures < MAX_FAILURES) return false;
    if (Date.now() > circuitOpenUntil) {
        // Allow one probe request (half-open state)
        consecutiveFailures = MAX_FAILURES - 1;
        return false;
    }
    return true;
}

function recordSuccess(): void {
    consecutiveFailures = 0;
}

function recordFailure(): void {
    consecutiveFailures++;
    if (consecutiveFailures >= MAX_FAILURES) {
        circuitOpenUntil = Date.now() + COOLDOWN_MS;
        console.warn(
            `[Neocinema Fallback] Circuit OPEN — skipping FastAPI for ${COOLDOWN_MS / 1000}s after ${consecutiveFailures} consecutive failures`
        );
    }
}

// ─── FastAPI Fetch Helper ──────────────────────────────────────────────────

async function fetchFromFastAPI(endpoint: string, options?: RequestInit): Promise<Response> {
    const aiServiceUrl = getAIServiceUrl();
    const url = `${aiServiceUrl}${endpoint}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FASTAPI_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeout);
        return response;
    } catch (error) {
        clearTimeout(timeout);
        throw error;
    }
}

// ─── Main Fallback Function ────────────────────────────────────────────────

/**
 * Try FastAPI first, fallback to Next.js TMDB service.
 * 
 * @param fastApiEndpoint  - Full endpoint path (e.g. "/api/ai/discover/movies?page=1")
 * @param fallbackFn       - Async function that calls tmdbService directly
 * @param fetchOptions     - Optional fetch options for the FastAPI request
 * @returns The API response data (from either FastAPI or the fallback)
 */
export async function withFallback<T>(
    fastApiEndpoint: string,
    fallbackFn: () => Promise<T>,
    fetchOptions?: RequestInit,
): Promise<{ data: T; source: "fastapi" | "nextjs" }> {
    // If circuit is open, skip FastAPI entirely
    if (!isCircuitOpen()) {
        try {
            const response = await fetchFromFastAPI(fastApiEndpoint, fetchOptions);

            if (response.ok) {
                const data = await response.json();
                recordSuccess();
                return { data, source: "fastapi" };
            }

            // Non-OK but the service responded — still a failure for fallback purposes
            console.warn(`[Neocinema Fallback] FastAPI returned ${response.status} for ${fastApiEndpoint}`);
            recordFailure();
        } catch (error: any) {
            const reason = error?.name === "AbortError" ? "timeout" : error?.message || "unknown";
            console.warn(`[Neocinema Fallback] FastAPI failed for ${fastApiEndpoint}: ${reason}`);
            recordFailure();
        }
    } else {
        console.info(`[Neocinema Fallback] Circuit open — skipping FastAPI for ${fastApiEndpoint}`);
    }

    // Fallback to Next.js TMDB service
    try {
        const data = await fallbackFn();
        return { data, source: "nextjs" };
    } catch (fallbackError) {
        console.error(`[Neocinema Fallback] Both FastAPI and TMDB fallback failed for ${fastApiEndpoint}:`, fallbackError);
        throw fallbackError;
    }
}

/**
 * Get current fallback health status (useful for debugging / admin endpoints).
 */
export function getFallbackStatus() {
    return {
        consecutiveFailures,
        circuitOpen: isCircuitOpen(),
        circuitOpenUntil: circuitOpenUntil > 0 ? new Date(circuitOpenUntil).toISOString() : null,
        maxFailures: MAX_FAILURES,
        cooldownMs: COOLDOWN_MS,
    };
}
