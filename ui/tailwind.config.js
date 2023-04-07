// tailwind.config.js
const tailwindforms = require('@tailwindcss/forms');

module.exports = {
  content: ['./components/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  plugins: [tailwindforms],
};
