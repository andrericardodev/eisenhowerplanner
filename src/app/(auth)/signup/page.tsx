import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { GoogleButton } from "@/components/google-button";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUp } from "../actions";

type SignupPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { message } = await searchParams;

  return (
    <AuthCard
      title="Create your account"
      subtitle="Email confirmation is required before your workspace opens."
      message={message}
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-semibold text-moss" href="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form action={signUp} className="grid gap-4">
        <Field label="Email">
          <Input name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Password">
          <Input name="password" type="password" autoComplete="new-password" minLength={6} required />
        </Field>
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-ink/40">
        <span className="h-px flex-1 bg-ink/10" />
        or
        <span className="h-px flex-1 bg-ink/10" />
      </div>
      <GoogleButton />
    </AuthCard>
  );
}
