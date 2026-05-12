"use client";

import { Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";

export function GoogleButton() {
  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }

  return (
    <Button type="button" variant="secondary" className="w-full" onClick={signInWithGoogle}>
      <Chrome className="h-4 w-4" />
      Continue with Google
    </Button>
  );
}
