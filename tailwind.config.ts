import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF9F6",
        ink: "#202020",
        muted: "#717171",
        accent: "#B28C64",
        line: "#E8E5DF",
      },
      boxShadow: {
        soft: "0 24px 70px rgba(56, 43, 29, 0.10)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
