import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt-BR", "es"],
  defaultLocale: "en",
  localePrefix: "always"
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: string): value is Locale {
  return routing.locales.includes(value as Locale);
}

export function localizePath(pathname: string, locale: Locale) {
  return `/${locale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
