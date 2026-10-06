import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const css = readFileSync("app/globals.css", "utf8");
function variables(block: string) {
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[\da-f]+);/gi)].map((match) => [
      match[1],
      match[2],
    ]),
  );
}
const light = variables(css.match(/:root\s*\{([^}]+)\}/)![1]);
const dark = {
  ...light,
  ...variables(css.match(/:root\[data-theme="dark"\]\s*\{([^}]+)\}/)![1]),
};
function luminance(hex: string) {
  let value = hex.slice(1);
  if (value.length === 3) value = [...value].map((c) => c + c).join("");
  const linear = [0, 2, 4].map((i) => {
    const channel = parseInt(value.slice(i, i + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const first = luminance(a),
    second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}
it.each([
  ["light", light],
  ["dark", dark],
] as const)("keeps text and chart tokens readable in %s", (_, palette) => {
  const textPairs = [
    ["ink", "canvas"],
    ["ink", "surface"],
    ["muted", "surface"],
    ["muted", "surface-alt"],
    ["on-accent", "button-bg"],
    ["on-accent", "button-hover"],
    ["selection-text", "selection"],
    ["warning-text", "warning-bg"],
    ["focus-text", "focus-bg"],
    ["focus-muted", "focus-bg"],
    ["focus-muted", "focus-input"],
    ["focus-button-text", "focus-button"],
    ...["blue", "green", "purple", "orange", "danger"].map((hue) => [
      hue,
      `${hue}-soft`,
    ]),
  ];
  for (const [text, bg] of textPairs)
    expect(
      contrast(palette[text], palette[bg]),
      `${text} on ${bg}`,
    ).toBeGreaterThanOrEqual(4.5);
  expect(
    contrast(palette["chart-bar"], palette.surface),
  ).toBeGreaterThanOrEqual(3);
});
