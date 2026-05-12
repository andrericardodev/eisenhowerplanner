import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isLocale, localizePath, routing, type Locale } from "@/i18n/routing";

function getPathLocale(pathname: string): Locale {
  const locale = pathname.split("/")[1];
  return isLocale(locale) ? locale : routing.defaultLocale;
}

function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  return isLocale(segments[1]) ? `/${segments.slice(2).join("/")}` : pathname;
}

export async function updateSession(request: NextRequest, response = NextResponse.next({ request })) {
  const locale = getPathLocale(request.nextUrl.pathname);
  const pathname = stripLocale(request.nextUrl.pathname);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password");
  const isProtectedRoute = pathname.startsWith("/dashboard");

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = localizePath("/login", locale);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = localizePath("/dashboard", locale);
    return NextResponse.redirect(url);
  }

  return response;
}
