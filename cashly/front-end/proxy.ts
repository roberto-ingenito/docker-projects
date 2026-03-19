import { NextResponse, NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/signup"];
const PROTECTED_ROUTES = ["/dashboard", "/transactions", "/categories"];

// Ottieni il basePath dalla configurazione
const BASE_PATH = "/cashly";

function debugLog(data: Record<string, unknown>, request: NextRequest) {
  // fire and forget, non blocca il middleware
  fetch(`https://roberto-ingenito.ddns.net/cashly/api/middleware-log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, ts: Date.now() }),
  })
    .then((v) => {
      // console.log("risultato: ", v);
    })
    .catch((e) => {
      console.log("Errore: ", e);
    });
}

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

  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  debugLog(
    {
      pathname: request.nextUrl.pathname,
      hasToken: !!token,
      hasRefresh: !!refreshToken,
      isProtectedPage,
    },
    request,
  );

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
