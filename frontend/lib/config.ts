export function getAIServiceUrl(): string {
    let url = process.env.AI_SERVICE_URL || process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";
    if (url) {
        url = url.trim();
        // Remove trailing slash if any
        if (url.endsWith("/")) {
            url = url.slice(0, -1);
        }
        // Prepend protocol if missing
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            // If it's localhost or an IP, default to http, otherwise default to https
            if (url.startsWith("localhost") || url.startsWith("127.0.0.1") || url.startsWith("192.168.")) {
                url = `http://${url}`;
            } else {
                url = `https://${url}`;
            }
        }
    }
    return url;
}
