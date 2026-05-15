import type { ReactNode } from "react";
import { Grid3X3 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AuthCardProps = {
  title: string;
  subtitle: string;
  message?: string;
  children: ReactNode;
  footer: ReactNode;
  activeQuadrant?: "do-now" | "schedule" | "delegate" | "eliminate";
};

const quadrants = [
  {
    id: "do-now",
    titleKey: "showcase.doNow",
    subtitleKey: "showcase.doNowSubtitle",
    className: "border-quadrant-do/20 bg-quadrant-do-bg text-quadrant-do"
  },
  {
    id: "schedule",
    titleKey: "showcase.schedule",
    subtitleKey: "showcase.scheduleSubtitle",
    className: "border-quadrant-schedule/20 bg-quadrant-schedule-bg text-quadrant-schedule"
  },
  {
    id: "delegate",
    titleKey: "showcase.delegate",
    subtitleKey: "showcase.delegateSubtitle",
    className: "border-quadrant-delegate/20 bg-quadrant-delegate-bg text-quadrant-delegate"
  },
  {
    id: "eliminate",
    titleKey: "showcase.eliminate",
    subtitleKey: "showcase.eliminateSubtitle",
    className: "border-quadrant-eliminate/20 bg-quadrant-eliminate-bg text-quadrant-eliminate"
  }
] as const;

export async function AuthCard({
  title,
  subtitle,
  message,
  children,
  footer,
  activeQuadrant = "do-now"
}: AuthCardProps) {
  const t = await getTranslations("Auth");

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <section className="hidden min-h-screen w-1/2 flex-col justify-between border-r border-border bg-primary/5 p-10 lg:flex xl:p-12">
        <Link href="/" className="flex w-fit items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Grid3X3 className="size-5" />
          </span>
          <span className="text-xl font-semibold tracking-tight text-foreground">{t("brand")}</span>
        </Link>

        <div className="max-w-md space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {quadrants.map((quadrant) => (
              <div
                key={quadrant.id}
                className={cn(
                  "rounded-lg border p-4 shadow-sm transition",
                  quadrant.className,
                  quadrant.id === activeQuadrant && "ring-2 ring-primary/20"
                )}
              >
                <p className="text-sm font-semibold">{t(quadrant.titleKey)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t(quadrant.subtitleKey)}</p>
              </div>
            ))}
          </div>
          <p className="text-lg leading-8 text-muted-foreground">{t("showcase.description")}</p>
        </div>

        <p className="text-sm text-muted-foreground">{t("showcase.footer")}</p>
      </section>

      <section className="flex min-h-screen w-full flex-col px-5 py-5 sm:px-8 lg:w-1/2 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Grid3X3 className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">{t("brand")}</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</p>
            </div>

            {message ? (
              <div className="mt-6 rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-foreground">
                {message}
              </div>
            ) : null}

            <div className="mt-8">{children}</div>
            <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
