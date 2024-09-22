import { type Config } from "tailwindcss";
import daisyui from "daisyui";
import themes from "daisyui/src/theming/themes.js";

// /** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./**/*.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    require("@tailwindcss/typography"),
    daisyui,
  ],
  corePlugins: {
    preflight: false, // https://tailwindcss.com/docs/preflight#disabling-preflight
  },
  theme: {
    extend: {},
  },
  daisyui: {
    // themes: Object.entries(themes).map(([k, v]) => ({ [k]: v })),
    // themes: Object.keys(themes),
  },
} satisfies Config;

