import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Known aggressive bots, scrapers, and spam crawlers
const BLOCKED_BOT_AGENTS = [
    'bingbot',
    'msnbot',
    'bingpreview',
    'ahrefsbot',
    'semrushbot',
    'bytespider',
    'petalbot',
    'mj12bot',
    'dotbot',
    'serpstatbot',
    'seznambot',
    'claudebot',
    'gptbot',
    'ccbot',
];

export function middleware(request: NextRequest) {
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

    // Check if the User-Agent contains any blocked bot keyword
    const isBlocked = BLOCKED_BOT_AGENTS.some((bot) => userAgent.includes(bot));

    if (isBlocked) {
        return new NextResponse('Access Denied', { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    // Matcher to catch all page & API routes
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
