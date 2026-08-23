import type { RgbColor, ColorOutputType } from "../types/line";
import { LINE_COLORS, LINE_DARK_STRENGTH } from "../constants/LineConstants";

export function getLineBackgroundColor(
  label: string,
  type: "string",
  darker?: boolean
): string;
export function getLineBackgroundColor(
  label: string,
  type?: "array",
  darker?: boolean
): RgbColor;
export function getLineBackgroundColor(
  label: string,
  type: ColorOutputType = "array",
  darker = false
): string | RgbColor {
  let rgbColor: RgbColor = LINE_COLORS[label] ?? LINE_COLORS["default"];

  if (darker) {
    // map on a 3-element tuple always returns 3 elements
    rgbColor = rgbColor.map((c) =>
      Math.max(0, c - LINE_DARK_STRENGTH)
    ) as RgbColor;
  }

  return type === "string" ? `rgb(${rgbColor.join(",")})` : rgbColor;
}

export function getLineBackgroundColors(label: string): [string, string] {
  const color1 = getLineBackgroundColor(label);
  const color2 = getLineBackgroundColor(label, "array", true);
  return [
    `rgb(${color1.join(",")})`,
    `rgb(${color2.join(",")})`,
  ] as [string, string];
}

export function getLineTextColor(label: string): string {
  return ["18", "17"].includes(label) ? "black" : "white";
}
