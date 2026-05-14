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
    <nav className="flex rounded-md border border-ink/10 bg-white p-1" aria-label={t("label")}>
      {routing.locales.map((option) => (
        <a
          key={option}
          href={`/${option}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
          hrefLang={option}
          className={cn(
            "inline-flex h-8 min-w-9 items-center justify-center rounded px-2 text-xs font-bold text-ink/65",
            option === locale && "bg-graphite text-white"
          )}
        >
          {localeLabels[option]}
        </a>
      ))}
    </nav>
  );
}
