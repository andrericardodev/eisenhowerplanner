import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "../actions";

type ForgotPasswordPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const { message } = await searchParams;

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we will send a secure reset link."
      message={message}
      footer={
        <Link className="font-semibold text-moss" href="/login">
          Back to sign in
        </Link>
      }
    >
      <form action={requestPasswordReset} className="grid gap-4">
        <Field label="Email">
          <Input name="email" type="email" autoComplete="email" required />
        </Field>
        <Button type="submit" className="w-full">
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}
