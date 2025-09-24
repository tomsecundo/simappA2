module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  important: true, // Add this line to ensure Tailwind doesn't conflict with Bootstrap
  theme: {
    extend: {},
  },
  plugins: [],
};
