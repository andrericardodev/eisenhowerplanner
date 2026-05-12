import { NextResponse, type NextRequest } from "next/server";
import { isLocale, localizePath, routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? localizePath("/dashboard", routing.defaultLocale);

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  const nextUrl = new URL(next, requestUrl.origin);
  const locale = nextUrl.pathname.split("/")[1];

  if (!isLocale(locale)) {
    nextUrl.pathname = localizePath(nextUrl.pathname, routing.defaultLocale);
  }

  return NextResponse.redirect(nextUrl);
}
