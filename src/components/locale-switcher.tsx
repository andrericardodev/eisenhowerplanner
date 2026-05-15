"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  "pt-BR": "PT",
  es: "ES"
};

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");

  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`), "") || "/";

  return (
    <nav className="flex rounded-md border border-border bg-card/85 p-1 shadow-sm" aria-label={t("label")}>
      {routing.locales.map((option) => (
        <a
          key={option}
          href={`/${option}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
          hrefLang={option}
          className={cn(
            "inline-flex h-8 min-w-9 items-center justify-center rounded px-2 text-xs font-bold text-muted-foreground transition hover:text-foreground",
            option === locale && "bg-primary text-primary-foreground hover:text-primary-foreground"
          )}
        >
          {localeLabels[option]}
        </a>
      ))}
    </nav>
  );
}
