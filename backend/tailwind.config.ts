import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "transparent-black": "rgba(0, 0, 0, 0.5)",
        "inv-background": "#c6c6c6",
        "slot-background": "#8b8b8b",
        "slot-background-hover": "#9f9f9f",
        "slot-shadow": "rgba(55, 55, 55, 0.7)",
        "slot-inset": "#fefefe",
      },
    },
  },
  plugins: [],
};
export default config;
