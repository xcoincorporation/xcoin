import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: "#1B1B1B",
        carbon: "#2C2C2C",
        silver: "#D9D9D9",
        steel: "#4A7D9A",
        gold: "#B98B2E",
      },
    },
  },
  plugins: [],
};
export default config;
