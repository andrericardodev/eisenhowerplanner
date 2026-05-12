import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "./middleware";

const getUser = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser
    }
  }))
}));

function createRequest(pathname: string) {
  return new NextRequest(`http://localhost:3000${pathname}`);
}

describe("updateSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
  });

  it("redirects anonymous users from localized protected routes to the localized login", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const response = await updateSession(createRequest("/pt-BR/dashboard"));

    expect(response.headers.get("location")).toBe("http://localhost:3000/pt-BR/login");
  });

  it("redirects authenticated users away from localized auth routes to the localized dashboard", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const response = await updateSession(createRequest("/es/login"));

    expect(response.headers.get("location")).toBe("http://localhost:3000/es/dashboard");
  });

  it("falls back to the default locale for unlocalized protected routes", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const response = await updateSession(createRequest("/dashboard"));

    expect(response.headers.get("location")).toBe("http://localhost:3000/en/login");
  });

  it("returns the provided response when no redirect is needed", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    const existingResponse = NextResponse.next();
    existingResponse.headers.set("x-intl", "preserved");

    const response = await updateSession(createRequest("/pt-BR/dashboard"), existingResponse);

    expect(response.headers.get("x-intl")).toBe("preserved");
    expect(createServerClient).toHaveBeenCalledWith(
      "http://localhost:54321",
      "anon-key",
      expect.objectContaining({
        cookies: expect.any(Object)
      })
    );
  });

  it("wires Supabase cookie reads and writes through the request and response", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    const request = createRequest("/pt-BR/dashboard");
    request.cookies.set("existing", "cookie-value");
    const existingResponse = NextResponse.next();

    await updateSession(request, existingResponse);

    const config = vi.mocked(createServerClient).mock.calls.at(-1)?.[2] as
      | {
          cookies: {
            getAll: () => ReturnType<NextRequest["cookies"]["getAll"]>;
            setAll: (cookies: Array<{ name: string; value: string; options?: { path?: string } }>) => void;
          };
        }
      | undefined;

    expect(config?.cookies.getAll()).toEqual([
      expect.objectContaining({ name: "existing", value: "cookie-value" })
    ]);

    config?.cookies.setAll([{ name: "sb-session", value: "token", options: { path: "/" } }]);

    expect(request.cookies.get("sb-session")?.value).toBe("token");
    expect(existingResponse.cookies.get("sb-session")?.value).toBe("token");
  });
});
