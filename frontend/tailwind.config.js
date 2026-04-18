export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          800: "#1e293b",
          900: "#0f172a"
        },
        ink: {
          primary: "#ffffff",
          secondary: "#94a3b8",
          muted: "#64748b"
        },
        accent: "#38bdf8",
        amber: "#f59e0b",
        success: "#22c55e",
        danger: "#ef4444"
      }
    }
  },
  plugins: [],
}