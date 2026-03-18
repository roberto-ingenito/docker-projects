import { NextResponse, NextRequest } from "next/server";
import { getJwtToken, getRefreshToken } from "./app/actions";

const AUTH_ROUTES = ["/login", "/signup"];
const PROTECTED_ROUTES = ["/dashboard", "/transactions", "/categories"];

// Ottieni il basePath dalla configurazione
const BASE_PATH = "/cashly";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect da root a dashboard
  if (pathname === "/") {
    const url = new URL(`${BASE_PATH}/dashboard`, request.url);
    return NextResponse.redirect(url);
  }

  // Check route type
  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedPage = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // Early return se non è né auth né protected
  if (!isAuthPage && !isProtectedPage) {
    return NextResponse.next();
  }

  const token = await getJwtToken();
  const refreshToken = await getRefreshToken();

  // Redirect non autenticati dalle pagine protette
  if (!token && !refreshToken && isProtectedPage) {
    const url = new URL(`${BASE_PATH}/login`, request.url);
    return NextResponse.redirect(url);
  }

  // Redirect autenticati dalle pagine di auth
  // Permettiamo l'accesso se abbiamo almeno il refresh token,
  // così il client può provare a rinfrescare il JWT.
  if ((token || refreshToken) && isAuthPage) {
    const url = new URL(`${BASE_PATH}/dashboard`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", //
    "/dashboard/:path*",
    "/transactions/:path*",
    "/categories/:path*",
    "/login",
    "/signup",
  ],
};
