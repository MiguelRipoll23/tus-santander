import { LINE_COLORS } from "../constants/LineConstants.js";

export const getLineBackgroundColor = (
  label,
  type = "array",
  darkStrength = 0
) => {
  // Get the base color or the default color
  const baseColor = LINE_COLORS[label] || LINE_COLORS.default;

  // Apply darkStrength adjustment
  const adjustedColor = baseColor.map((value) =>
    Math.max(value - darkStrength, 0)
  );

  // Return based on the type
  return type === "string" ? `rgb(${adjustedColor.join(",")})` : adjustedColor;
};

export const getLineBackgroundColors = (label) => {
  // Generate both the primary and darkened background colors
  const color1 = getLineBackgroundColor(label);
  const color2 = getLineBackgroundColor(label, "array", 30);

  // Format as RGB strings
  return [`rgb(${color1.join(",")})`, `rgb(${color2.join(",")})`];
};

export const getLineTextColor = (label) => {
  // Return text color based on label
  return ["18", "17"].includes(label) ? "black" : "white";
};
