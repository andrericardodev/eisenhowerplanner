import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { routing } from "@/i18n/routing";
import { config, middleware } from "./middleware";

const mocks = vi.hoisted(() => {
  const intlMiddleware = vi.fn();

  return {
    intlMiddleware,
    createIntlMiddleware: vi.fn(() => intlMiddleware),
    updateSession: vi.fn()
  };
});

vi.mock("next-intl/middleware", () => ({
  default: mocks.createIntlMiddleware
}));

vi.mock("@/lib/supabase/middleware", () => ({
  updateSession: mocks.updateSession
}));

function createRequest(pathname: string) {
  return new NextRequest(`http://localhost:3000${pathname}`);
}

describe("middleware", () => {
  beforeEach(() => {
    mocks.intlMiddleware.mockClear();
    mocks.updateSession.mockClear();
    mocks.intlMiddleware.mockReturnValue(new Response(null, { headers: { "x-intl": "true" } }));
    mocks.updateSession.mockImplementation(async (_request, response) => response ?? new Response(null));
  });

  it("configures next-intl with the app routing", () => {
    expect(mocks.createIntlMiddleware).toHaveBeenCalledWith(routing);
  });

  it("bypasses locale middleware for auth callbacks", async () => {
    await middleware(createRequest("/auth/callback?next=/pt-BR/dashboard"));

    expect(mocks.intlMiddleware).not.toHaveBeenCalled();
    expect(mocks.updateSession).toHaveBeenCalledWith(expect.any(NextRequest));
  });

  it("runs locale middleware before updating Supabase session for app routes", async () => {
    const request = createRequest("/pt-BR/login");
    const response = await middleware(request);

    expect(mocks.intlMiddleware).toHaveBeenCalledWith(request);
    expect(mocks.updateSession).toHaveBeenCalledWith(request, expect.any(Response));
    expect(response.headers.get("x-intl")).toBe("true");
  });
});

describe("middleware config", () => {
  it("matches app routes while excluding framework assets and file requests", () => {
    expect(config.matcher).toEqual(["/((?!api|_next|_vercel|.*\\..*).*)"]);
  });
});
