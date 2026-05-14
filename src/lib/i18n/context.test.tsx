import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { I18nProvider, useI18n } from "@/lib/i18n/context";

function LocaleConsumer() {
  const { locale, t } = useI18n();

  return React.createElement("span", null, `${locale}:${t("newTask")}`);
}

describe("I18nProvider", () => {
  it("provides the default Portuguese locale and translations", () => {
    const html = renderToString(React.createElement(I18nProvider, null, React.createElement(LocaleConsumer)));

    expect(html).toContain("pt:Nova Tarefa");
  });

  it("throws when useI18n is used outside the provider", () => {
    expect(() => renderToString(React.createElement(LocaleConsumer))).toThrow(
      "useI18n must be used within I18nProvider"
    );
  });
});
