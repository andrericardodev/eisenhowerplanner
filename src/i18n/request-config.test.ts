import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import ptBR from "../../messages/pt-BR.json";
import { resolveRequestConfig } from "./request-config";

describe("resolveRequestConfig", () => {
  it("loads messages for a supported request locale", async () => {
    await expect(resolveRequestConfig(Promise.resolve("pt-BR"))).resolves.toEqual({
      locale: "pt-BR",
      messages: ptBR
    });
  });

  it("loads Spanish messages when Spanish is requested", async () => {
    await expect(resolveRequestConfig(Promise.resolve("es"))).resolves.toEqual({
      locale: "es",
      messages: es
    });
  });

  it("falls back to English for missing or unsupported locales", async () => {
    await expect(resolveRequestConfig(Promise.resolve(undefined))).resolves.toEqual({
      locale: "en",
      messages: en
    });

    await expect(resolveRequestConfig(Promise.resolve("fr"))).resolves.toEqual({
      locale: "en",
      messages: en
    });
  });
});
