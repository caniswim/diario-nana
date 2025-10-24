/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B8DEF",
        "primary-foreground": "#ffffff",
        secondary: "#f4f4f5",
        "secondary-foreground": "#18181b",
        muted: "#f4f4f5",
        "muted-foreground": "#71717a",
        accent: "#f4f4f5",
        "accent-foreground": "#18181b",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        border: "#e4e4e7",
        input: "#e4e4e7",
        ring: "#5B8DEF",
        background: "#ffffff",
        foreground: "#0a0a0a",
        card: "#ffffff",
        "card-foreground": "#0a0a0a",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
}

