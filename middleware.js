import { NextResponse } from "next/server";

const SUPPORTED_LANGS = ["en", "fr", "es", "de"];
const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const lang = segments[1];
  if (SUPPORTED_LANGS.includes(lang)) {
    return NextResponse.next();
  }

  const nextUrl = request.nextUrl.clone();
  const suffix = pathname === "/" ? "" : pathname;
  nextUrl.pathname = `/en${suffix}`;
  return NextResponse.redirect(nextUrl);
}
