import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth-card";
import { AuthPasswordInput } from "@/components/auth-password-input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
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
          <AuthPasswordInput
            name="password"
            autoComplete="new-password"
            placeholder={t("newPasswordPlaceholder")}
            minLength={6}
            showLabel={t("showPassword")}
            hideLabel={t("hidePassword")}
            required
          />
        </Field>
        <Button type="submit" className="h-11 w-full">
          {t("resetPassword.submit")}
        </Button>
      </form>
    </AuthCard>
  );
}
