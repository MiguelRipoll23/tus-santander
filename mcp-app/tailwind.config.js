// tailwind.config.js
module.exports = {
  darkMode: 'media', // Use system theme
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openai/apps-sdk-ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
