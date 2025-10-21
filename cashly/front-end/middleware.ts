import { NextResponse, NextRequest } from 'next/server'
import { getJwtToken } from './app/actions';

const AUTH_ROUTES = ['/login', '/signup'];
const PROTECTED_ROUTES = ['/dashboard', '/accounts', '/transactions', '/categories'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/") {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Check route type con un singolo controllo
    const isAuthPage = AUTH_ROUTES.some(route => pathname.startsWith(route));
    const isProtectedPage = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    // Early return se non è né auth né protected
    if (!isAuthPage && !isProtectedPage) {
        return NextResponse.next();
    }

    const token = await getJwtToken();

    // Redirect non autenticati dalle pagine protette
    if (!token && isProtectedPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect autenticati dalle pagine di auth
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/accounts/:path*',
        '/transactions/:path*',
        '/categories/:path*',
        '/login',
        '/signup',
    ],
};