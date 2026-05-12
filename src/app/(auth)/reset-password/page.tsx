import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updatePassword } from "../actions";

type ResetPasswordPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { message } = await searchParams;

  return (
    <AuthCard
      title="Choose a new password"
      subtitle="Use a password you have not used for this account before."
      message={message}
      footer="Your session is verified by the reset link."
    >
      <form action={updatePassword} className="grid gap-4">
        <Field label="New password">
          <Input name="password" type="password" autoComplete="new-password" minLength={6} required />
        </Field>
        <Button type="submit" className="w-full">
          Update password
        </Button>
      </form>
    </AuthCard>
  );
}
