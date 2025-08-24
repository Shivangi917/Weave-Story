// Convert hex color to RGB array
export const hexToRgb = (hex) => {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

// Convert RGB to hex
export const rgbToHex = (r, g, b) =>
  "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

// Generate a pastel color from a base hex
export const toPastel = (hex, whiteRatio = 0.3) => {
  const [r, g, b] = hexToRgb(hex);
  const newR = Math.round(r * (1 - whiteRatio) + 255 * whiteRatio);
  const newG = Math.round(g * (1 - whiteRatio) + 255 * whiteRatio);
  const newB = Math.round(b * (1 - whiteRatio) + 255 * whiteRatio);
  return rgbToHex(newR, newG, newB);
};
