import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("combines class names and ignores falsy values", () => {
    expect(cn("flex", false && "hidden", null, undefined, "items-center")).toBe(
      "flex items-center"
    );
  });

  it("resolves conflicting Tailwind classes with the last class winning", () => {
    expect(cn("px-2 text-sm", "px-4", "text-lg")).toBe("px-4 text-lg");
  });
});
