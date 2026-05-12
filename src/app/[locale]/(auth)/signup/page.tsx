import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth-card";
import { GoogleButton } from "@/components/google-button";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { signUp } from "../actions";

type SignupPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ message?: string }>;
};

export default async function SignupPage({ params, searchParams }: SignupPageProps) {
  const { locale } = await params;
  const { message } = await searchParams;
  const t = await getTranslations("Auth");

  return (
    <AuthCard
      title={t("signup.title")}
      subtitle={t("signup.subtitle")}
      message={message}
      footer={
        <>
          {t("signup.hasAccount")}{" "}
          <Link className="font-semibold text-moss" href="/login">
            {t("signup.signIn")}
          </Link>
        </>
      }
    >
      <form action={signUp} className="grid gap-4">
        <input type="hidden" name="locale" value={locale} />
        <Field label={t("email")}>
          <Input name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label={t("password")}>
          <Input name="password" type="password" autoComplete="new-password" minLength={6} required />
        </Field>
        <Button type="submit" className="w-full">
          {t("signup.submit")}
        </Button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-ink/40">
        <span className="h-px flex-1 bg-ink/10" />
        {t("or")}
        <span className="h-px flex-1 bg-ink/10" />
      </div>
      <GoogleButton />
    </AuthCard>
  );
}
