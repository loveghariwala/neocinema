import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

    // Block Bingbot, msnbot, and BingPreview crawlers
    if (
        userAgent.includes('bingbot') ||
        userAgent.includes('msnbot') ||
        userAgent.includes('bingpreview')
    ) {
        return new NextResponse('Access Denied', { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
