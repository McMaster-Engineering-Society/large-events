/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@large-event/web-components/dist/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#007bff',
        'brand-blue-dark': '#0056b3',
        'error-red': '#dc3545',
        'border-gray': '#ddd',
        'text-gray': '#666',
        'text-dark': '#333',
        'bg-gray': '#f5f5f5',
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}