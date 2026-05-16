import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt-BR", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed"
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: string): value is Locale {
  return routing.locales.includes(value as Locale);
}

export function localizePath(pathname: string, locale: Locale) {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (locale === routing.defaultLocale) {
    return normalizedPathname;
  }

  return `/${locale}${normalizedPathname}`;
}
