import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limiting state (persists per Cloudflare Worker isolate)
let requestCount = 0;
let lastReset = Date.now();

export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || '';
    
    // Only apply rate limiting to Googlebot to protect server CPU
    if (userAgent.toLowerCase().includes('googlebot')) {
        const now = Date.now();
        
        // Reset the counter every 10 seconds
        if (now - lastReset > 10000) { 
            requestCount = 0;
            lastReset = now;
        }
        
        requestCount++;
        
        // Allow maximum 2 requests per 10 seconds per worker isolate
        // If it exceeds this, return 429 Too Many Requests to force Googlebot to slow down
        if (requestCount > 2) {
            return new NextResponse('Too Many Requests', { 
                status: 429,
                headers: { 
                    'Retry-After': '60', // Tell Googlebot to back off for at least 60 seconds
                    'Content-Type': 'text/plain'
                }
            });
        }
    }
    
    return NextResponse.next();
}

export const config = {
    // Only run middleware on heavy dynamic routes to save processing time
    matcher: ['/movies/:path*', '/series/:path*'],
};
