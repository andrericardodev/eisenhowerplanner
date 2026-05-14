import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/routing";
import { updatePassword } from "../actions";

type ResetPasswordPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ message?: string }>;
};

export default async function ResetPasswordPage({ params, searchParams }: ResetPasswordPageProps) {
  const { locale } = await params;
  const { message } = await searchParams;
  const t = await getTranslations("Auth");

  return (
    <AuthCard
      title={t("resetPassword.title")}
      subtitle={t("resetPassword.subtitle")}
      message={message}
      footer={t("resetPassword.footer")}
    >
      <form action={updatePassword} className="grid gap-4">
        <input type="hidden" name="locale" value={locale} />
        <Field label={t("newPassword")}>
          <Input name="password" type="password" autoComplete="new-password" minLength={6} required />
        </Field>
        <Button type="submit" className="w-full">
          {t("resetPassword.submit")}
        </Button>
      </form>
    </AuthCard>
  );
}
