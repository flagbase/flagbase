/* eslint-disable @typescript-eslint/no-var-requires */
// tailwind.config.js
const tailwindforms = require('@tailwindcss/forms');

module.exports = {
  content: ['./src/components/**/*.{js,jsx,ts,tsx}'],
  plugins: [tailwindforms],
};
