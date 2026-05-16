import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const exchangeCodeForSession = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      exchangeCodeForSession
    }
  }))
}));

describe("auth callback", () => {
  it("redirects to the default dashboard when no next path is provided", async () => {
    const response = await GET(new Request("http://localhost:3000/auth/callback") as never);

    expect(response.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("exchanges the auth code and preserves a localized next path", async () => {
    const response = await GET(
      new Request("http://localhost:3000/auth/callback?code=abc&next=/pt-BR/dashboard") as never
    );

    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc");
    expect(response.headers.get("location")).toBe("http://localhost:3000/pt-BR/dashboard");
  });

  it("keeps unprefixed next paths on the default locale", async () => {
    const response = await GET(
      new Request("http://localhost:3000/auth/callback?next=/reset-password") as never
    );

    expect(response.headers.get("location")).toBe("http://localhost:3000/reset-password");
  });
});
