import { describe, expect, it } from "vitest";
import { isLocale, localizePath, routing } from "./routing";

describe("routing", () => {
  it("defines English as the default locale with initial global locales", () => {
    expect(routing.defaultLocale).toBe("en");
    expect(routing.locales).toEqual(["en", "pt-BR", "es"]);
    expect(routing.localePrefix).toBe("always");
  });
});

describe("isLocale", () => {
  it.each(["en", "pt-BR", "es"])("accepts supported locale %s", (locale) => {
    expect(isLocale(locale)).toBe(true);
  });

  it.each(["pt", "en-US", "fr", ""])("rejects unsupported locale %s", (locale) => {
    expect(isLocale(locale)).toBe(false);
  });
});

describe("localizePath", () => {
  it("prefixes absolute paths with the provided locale", () => {
    expect(localizePath("/dashboard", "pt-BR")).toBe("/pt-BR/dashboard");
  });

  it("prefixes relative paths with the provided locale", () => {
    expect(localizePath("login", "es")).toBe("/es/login");
  });
});
