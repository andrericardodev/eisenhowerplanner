"use client";

import { useI18n } from "@/lib/i18n/context";

export function DashboardIntro() {
  const { t } = useI18n();

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("pageTitle")}</h1>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{t("pageDescription")}</p>
    </div>
  );
}
