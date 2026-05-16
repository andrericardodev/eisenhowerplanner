import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Grid3X3,
  GripVertical,
  Layers,
  Lock,
  Plus,
  Sparkles,
  Target,
  Users,
  GraduationCap
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LandingPageProps = {
  t: (key: LandingTranslationKey) => string;
};

type LandingTranslationKey =
  | "login"
  | "heroHeadline"
  | "heroSubheadline"
  | "startForFree"
  | "seeHowItWorks"
  | "problemTitle"
  | "problemSubtitle"
  | "problemDescription"
  | "solutionTitle"
  | "solutionDescription"
  | "howItWorksTitle"
  | "step1Title"
  | "step1Description"
  | "step2Title"
  | "step2Description"
  | "step3Title"
  | "step3Description"
  | "step4Title"
  | "step4Description"
  | "featuresTitle"
  | "feature1Title"
  | "feature1Description"
  | "feature2Title"
  | "feature2Description"
  | "feature3Title"
  | "feature3Description"
  | "feature4Title"
  | "feature4Description"
  | "feature5Title"
  | "feature5Description"
  | "whoTitle"
  | "whoProfessionals"
  | "whoProfessionalsDesc"
  | "whoFreelancers"
  | "whoFreelancersDesc"
  | "whoStudents"
  | "whoStudentsDesc"
  | "whoBusyPeople"
  | "whoBusyPeopleDesc"
  | "betaTitle"
  | "betaDescription"
  | "finalCtaTitle"
  | "finalCtaDescription"
  | "createFreeAccount"
  | "footerRights";

const buttonBase =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const primaryButton = `${buttonBase} bg-primary text-primary-foreground hover:bg-primary/90`;
const secondaryButton = `${buttonBase} border border-border bg-card text-foreground hover:bg-secondary`;
const headerCtaButton = `${buttonBase} bg-[#16a34a] text-white hover:bg-[#15803d] focus-visible:ring-[#16a34a]`;

export function LandingPage({ t }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader t={t} />
      <main>
        <HeroSection t={t} />
        <ProblemSection t={t} />
        <SolutionSection t={t} />
        <HowItWorksSection t={t} />
        <FeaturesSection t={t} />
        <WhoSection t={t} />
        <BetaSection t={t} />
        <FinalCtaSection t={t} />
      </main>
      <LandingFooter t={t} />
    </div>
  );
}

function LandingHeader({ t }: LandingPageProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Grid3X3 className="size-5" />
          </div>
          <span className="truncate text-base font-semibold tracking-tight sm:text-lg">Eisenhower Planner</span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>
          <Link href="/login" className={cn(secondaryButton, "h-10 px-4")}>
            {t("login")}
          </Link>
          <Link href="/signup" className={cn(headerCtaButton, "h-10 px-4")}>
            {t("startForFree")}
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroSection({ t }: LandingPageProps) {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(var(--secondary))_0%,rgb(var(--background))_58%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("heroHeadline")}
          </h1>
          <p className="mt-6 text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
            {t("heroSubheadline")}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className={cn(primaryButton, "w-full px-8 sm:w-auto")}>
              {t("startForFree")}
              <ArrowRight className="size-4" />
            </Link>
            <a href="#how-it-works" className={cn(secondaryButton, "w-full px-8 sm:w-auto")}>
              {t("seeHowItWorks")}
            </a>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-5xl sm:mt-16">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  const quadrants = [
    { title: "Do Now", color: "bg-quadrant-do", bg: "bg-quadrant-do-bg/70", text: "text-quadrant-do", widths: ["w-3/4", "w-1/2"] },
    {
      title: "Schedule",
      color: "bg-quadrant-schedule",
      bg: "bg-quadrant-schedule-bg/70",
      text: "text-quadrant-schedule",
      widths: ["w-2/3"]
    },
    {
      title: "Delegate",
      color: "bg-quadrant-delegate",
      bg: "bg-quadrant-delegate-bg/70",
      text: "text-quadrant-delegate",
      widths: ["w-4/5"]
    },
    {
      title: "Eliminate",
      color: "bg-quadrant-eliminate",
      bg: "bg-quadrant-eliminate-bg/70",
      text: "text-quadrant-eliminate",
      widths: ["w-1/2"]
    }
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-2 shadow-2xl shadow-primary/10 ring-1 ring-border/30">
      <div className="rounded-lg bg-muted/40 p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-quadrant-do" />
            <span className="size-3 rounded-full bg-quadrant-schedule" />
            <span className="size-3 rounded-full bg-quadrant-delegate" />
            <span className="size-3 rounded-full bg-quadrant-eliminate" />
          </div>
          <div className="flex gap-2">
            <span className="h-6 w-14 rounded bg-card sm:w-16" />
            <span className="h-6 w-16 rounded bg-primary/25 sm:w-20" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {quadrants.map((quadrant) => (
            <div key={quadrant.title} className={cn("min-h-28 rounded-lg p-3 sm:p-4", quadrant.bg)}>
              <div className="mb-3 flex items-center gap-2">
                <span className={cn("size-2 rounded-full", quadrant.color)} />
                <span className={cn("truncate text-xs font-semibold sm:text-sm", quadrant.text)}>{quadrant.title}</span>
              </div>
              <div className="space-y-2">
                {quadrant.widths.map((width) => (
                  <div key={width} className="rounded-md bg-card p-2 shadow-sm">
                    <div className={cn("h-2 rounded bg-foreground/10", width)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProblemSection({ t }: LandingPageProps) {
  return (
    <section className="border-t border-border bg-muted/35 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("problemTitle")}
        </h2>
        <p className="mt-3 text-xl font-semibold text-primary sm:text-2xl">{t("problemSubtitle")}</p>
        <p className="mt-6 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {t("problemDescription")}
        </p>
      </div>
    </section>
  );
}

function SolutionSection({ t }: LandingPageProps) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="size-7" />
        </div>
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("solutionTitle")}
        </h2>
        <p className="mt-6 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {t("solutionDescription")}
        </p>
      </div>
    </section>
  );
}

function HowItWorksSection({ t }: LandingPageProps) {
  const steps = [
    { icon: Plus, title: t("step1Title"), description: t("step1Description") },
    { icon: Target, title: t("step2Title"), description: t("step2Description") },
    { icon: Layers, title: t("step3Title"), description: t("step3Description") },
    { icon: GripVertical, title: t("step4Title"), description: t("step4Description") }
  ];

  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-border bg-muted/35 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("howItWorksTitle")}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <step.icon className="size-6" />
              </div>
              {index < steps.length - 1 ? (
                <div className="absolute left-1/2 top-6 hidden h-px w-full translate-x-6 bg-border lg:block" />
              ) : null}
              <span className="mb-2 block text-sm font-semibold text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ t }: LandingPageProps) {
  const features = [
    { icon: Grid3X3, title: t("feature1Title"), description: t("feature1Description") },
    { icon: Briefcase, title: t("feature2Title"), description: t("feature2Description") },
    { icon: GripVertical, title: t("feature3Title"), description: t("feature3Description") },
    { icon: Lock, title: t("feature4Title"), description: t("feature4Description") },
    { icon: CheckCircle2, title: t("feature5Title"), description: t("feature5Description") }
  ];

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("featuresTitle")}
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-lg border border-border bg-card p-6 transition hover:bg-secondary/60">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoSection({ t }: LandingPageProps) {
  const personas = [
    { icon: Briefcase, title: t("whoProfessionals"), description: t("whoProfessionalsDesc") },
    { icon: Users, title: t("whoFreelancers"), description: t("whoFreelancersDesc") },
    { icon: GraduationCap, title: t("whoStudents"), description: t("whoStudentsDesc") },
    { icon: Clock, title: t("whoBusyPeople"), description: t("whoBusyPeopleDesc") }
  ];

  return (
    <section className="border-t border-border bg-muted/35 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("whoTitle")}
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {personas.map((persona) => (
            <div key={persona.title} className="text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-card text-primary shadow-sm ring-1 ring-border">
                <persona.icon className="size-6" />
              </div>
              <h3 className="font-semibold text-foreground">{persona.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{persona.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BetaSection({ t }: LandingPageProps) {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-lg border border-primary/20 bg-primary/5 p-8 text-center sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          <Sparkles className="size-4" />
          Beta
        </span>
        <h2 className="mt-4 text-xl font-semibold text-foreground sm:text-2xl">{t("betaTitle")}</h2>
        <p className="mt-3 leading-7 text-muted-foreground">{t("betaDescription")}</p>
      </div>
    </section>
  );
}

function FinalCtaSection({ t }: LandingPageProps) {
  return (
    <section className="border-t border-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("finalCtaTitle")}
        </h2>
        <p className="mt-4 text-muted-foreground">{t("finalCtaDescription")}</p>
        <div className="mt-8">
          <Link href="/signup" className={cn(primaryButton, "px-8")}>
            {t("createFreeAccount")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function LandingFooter({ t }: LandingPageProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/35 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Grid3X3 className="size-4" />
            </div>
            <span className="font-semibold">Eisenhower Planner</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/login" className="text-muted-foreground transition hover:text-foreground">
              {t("login")}
            </Link>
          </nav>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          &copy; {currentYear} Eisenhower Planner. {t("footerRights")}
        </div>
      </div>
    </footer>
  );
}
