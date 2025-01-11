import { LINE_COLORS, LINE_DARK_STRENGTH } from "../constants/LineConstants.js";

export const getLineBackgroundColor = (
  label,
  type = "array",
  darker = false
) => {
  // Get the base color or the default color
  let rgbColor = LINE_COLORS[label] || LINE_COLORS.default;

  if (darker) {
    rgbColor = rgbColor.map((color) => Math.max(0, color - LINE_DARK_STRENGTH));
  }

  // Return based on the type
  return type === "string" ? `rgb(${rgbColor.join(",")})` : rgbColor;
};

export const getLineBackgroundColors = (label) => {
  // Generate both the primary and darkened background colors
  const color1 = getLineBackgroundColor(label);
  const color2 = getLineBackgroundColor(label, "array", true);

  // Format as RGB strings
  return [`rgb(${color1.join(",")})`, `rgb(${color2.join(",")})`];
};

export const getLineTextColor = (label) => {
  // Return text color based on label
  return ["18", "17"].includes(label) ? "black" : "white";
};
