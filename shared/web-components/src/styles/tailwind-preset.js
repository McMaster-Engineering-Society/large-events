/**
 * Shared Tailwind CSS preset for Large Event Platform
 * Import this in your tailwind.config.js to use the shared design system
 *
 * IMPORTANT: To use classes from @large-event/web-components, add the package
 * to your Tailwind content configuration:
 *
 * @example
 * ```js
 * // tailwind.config.js
 * module.exports = {
 *   presets: [require('@large-event/web-components/tailwind-preset')],
 *   content: [
 *     './src/**\/*.{js,ts,jsx,tsx}',
 *     './node_modules/@large-event/web-components/dist/**\/*.js',
 *   ],
 * }
 * ```
 */
module.exports = {
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
};
