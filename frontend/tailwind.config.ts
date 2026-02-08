import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7ff",
          100: "#d9e9ff",
          500: "#1f6feb",
          700: "#1556b6",
          900: "#103b7a"
        }
      }
    }
  },
  plugins: []
};

export default config;
