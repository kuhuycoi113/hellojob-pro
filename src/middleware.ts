import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, redirectToHome, redirectToLogin } from "next-firebase-auth-edge";
import { authConfig } from "@/lib/firebase-server";
import { logout } from "../api";

// Các route yêu cầu đăng nhập
const PROTECTED_PATHS = ["/ho-so-cua-toi"];

const PUBLIC_PATHS = [
  // "/register",
  "/xac-thuc",
  "/xac-thuc-so-dien-thoai",
  "/tim-viec-lam",
  "/",
  // "/danh-sach-viec-lam",
  // "/danh-sach-ung-vien",
  // "/reset-password",
  // "/short-link",
  // "/don-hang-excel",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nếu là route yêu cầu đăng nhập
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: authConfig.apiKey,
    cookieName: authConfig.cookieName,
    cookieSerializeOptions: authConfig.cookieSerializeOptions,
    cookieSignatureKeys: authConfig.cookieSignatureKeys,
    serviceAccount: authConfig.serviceAccount,
    handleValidToken: async ({ token, decodedToken }, headers) => {
      // if (["/xac-thuc", "/xac-thuc-so-dien-thoai"].includes(request.nextUrl.pathname)) {
      //   return redirectToHome(request);
      // }
      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    handleInvalidToken: async (reason) => {
      const publicPaths = Object.assign([], PUBLIC_PATHS);
      return redirectToLogin(request, {
        path: "/xac-thuc",
        publicPaths: publicPaths,
      });
    },
    handleError: async (error) => {
      await logout();
      console.error("Unhandled authentication error", { error });
      return redirectToLogin(request, {
        path: "/xac-thuc",
        publicPaths: PUBLIC_PATHS,
      });
    },
  });

  // Các route khác đều public
  // return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/((?!_next|favicon.ico|api|.*\\.).*)",
    "/api/login",
    "/api/logout",
    "/danh-sach-viec-lam",
    "/viec-lam/(.*)",
    "/danh-sach-ung-vien",
    "/ho-so-cua-toi",
    "/don-hang-excel",
  ],
};