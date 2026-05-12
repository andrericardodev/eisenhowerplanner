import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { GoogleButton } from "@/components/google-button";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "../actions";

type LoginPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { message } = await searchParams;

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to manage your personal and work priorities."
      message={message}
      footer={
        <>
          No account?{" "}
          <Link className="font-semibold text-moss" href="/signup">
            Create one
          </Link>
        </>
      }
    >
      <form action={signIn} className="grid gap-4">
        <Field label="Email">
          <Input name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Password">
          <Input name="password" type="password" autoComplete="current-password" required />
        </Field>
        <div className="flex justify-end">
          <Link className="text-sm font-medium text-moss" href="/forgot-password">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full">
          Sign in
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
