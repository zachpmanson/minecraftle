export const COLORS = {
  SUCCESS_COLOR: "hsla(92, 100%, 37%, 0.859)",
  NEAR_SUCCESS_COLOR: "#caa905",
  WRONG_COLOR: "rgb(83, 83, 83)",
};

export const HICONTRAST_COLORS = {
  ...COLORS,
  SUCCESS_COLOR: "#f5793a",
  NEAR_SUCCESS_COLOR: "#85c0f9",
};
export const CACHE_VERSION = "20251215_";

export const DEFAULT_OPTIONS = {
  highContrast: false,
};

export const PUBLIC_DIR = process.env.NEXT_PUBLIC_PUBLIC_DIR || "";
