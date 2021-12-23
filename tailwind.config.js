module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "holy-purple": "#362d76",
        "holy-purple-dark": "#302664",
        "holy-purple-soft": "#483f82",
        "holy-purple-softer": "#5a5390",
        "holy-purple-softertext": "#7c75af",
        "holy-purple-bright": "#b6abff",
      },
      animation: {
        show: "showUp 3s ease-in-out infinite",
      },
      keyframes: {
        showUp: {
          "0%": { opacity: 0, transform: "translate(0, .3em)" },
          "50%": { opacity: 1, transform: "translate(0, 0)" },
          "89%": { opacity: 1 },
          "90%": { opacity: 0.5 },
          "100%": { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
