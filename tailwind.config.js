/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      muted: 'var(--muted)',
      'muted-foreground': 'var(--muted-foreground)',
       primary: "#2563eb", // or whatever shade of blue or main color
        "primary-foreground": "#ffffff",
        // optional for other variants
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        accent: "#f3f4f6",
        "accent-foreground": "#1f2937",
    },
    },
  },
  plugins: [],
}

