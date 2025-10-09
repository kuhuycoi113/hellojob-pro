
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, redirectToHome, redirectToLogin } from "next-firebase-auth-edge";
import { authConfig } from "@/lib/firebase-server";
import { logout } from "../api";

const PUBLIC_PATHS = ["/login"];

export async function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_DEVELOMENT) {
    return NextResponse.next({
      request
    });
  } else {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: authConfig.apiKey,
    cookieName: authConfig.cookieName,
    cookieSerializeOptions: authConfig.cookieSerializeOptions,
    cookieSignatureKeys: authConfig.cookieSignatureKeys,
    serviceAccount: authConfig.serviceAccount,
    handleValidToken: async ({ token, decodedToken }, headers) => {
      // Authenticated user should not be able to access /login, /register and /reset-password routes
      // if (["/login"].includes(request.nextUrl.pathname)) {
      //   return redirectToHome(request);
      // }
      // headers.set('x-url', request.url);
      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    handleInvalidToken: async (reason) => {
      // await logout();
      return redirectToLogin(request, {
        path: "/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
    handleError: async (error) => {
      await logout();
      console.error("Unhandled authentication error", { error });
      return redirectToLogin(request, {
        path: "/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
  });
  }
}

export const config = {
  matcher: ["/", "/((?!_next|favicon.ico|api|.*\\.).*)", "/api/login", "/api/logout"],
};
