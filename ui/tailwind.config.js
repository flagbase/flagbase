// tailwind.config.js

module.exports = {
    content: ['./components/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
    plugins: [
        // ...
        require('@tailwindcss/forms'),
      ],
}
