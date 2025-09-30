import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

    const token = request.cookies.get('token');

    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');

    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/accounts') ||
        request.nextUrl.pathname.startsWith('/transactions') ||
        request.nextUrl.pathname.startsWith('/categories');

    if (!token && isDashboard) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/accounts/:path*',
        '/transactions/:path*',
        '/categories/:path*',
        '/login',
        '/signup',
    ],
};