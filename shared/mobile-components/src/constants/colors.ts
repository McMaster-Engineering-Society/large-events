/**
 * Shared color palette for mobile applications
 * Based on Tailwind CSS color system
 */

export const colors = {
  // Primary colors
  primary: '#3b82f6',       // blue-500
  primaryDark: '#2563eb',   // blue-600
  primaryLight: '#60a5fa',  // blue-400

  // Secondary colors
  secondary: '#8b5cf6',     // purple-500
  secondaryDark: '#7c3aed', // purple-600
  secondaryLight: '#a78bfa',// purple-400

  // Accent colors
  success: '#10b981',       // green-500
  warning: '#f59e0b',       // amber-500
  error: '#ef4444',         // red-500
  info: '#3b82f6',          // blue-500

  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Text colors
  textPrimary: '#111827',   // gray-900
  textSecondary: '#6b7280', // gray-500
  textTertiary: '#9ca3af',  // gray-400
  textInverse: '#ffffff',

  // Background colors
  bgPrimary: '#ffffff',
  bgSecondary: '#f9fafb',   // gray-50
  bgTertiary: '#f3f4f6',    // gray-100

  // Border colors
  border: '#e5e7eb',        // gray-200
  borderDark: '#d1d5db',    // gray-300

  // Team colors (examples)
  teamA: '#ef4444',         // red-500
  teamB: '#3b82f6',         // blue-500
  teamC: '#10b981',         // green-500
  teamD: '#8b5cf6',         // purple-500
} as const;

export type ColorKey = keyof typeof colors;

/**
 * Get access level color
 */
export function getAccessLevelColor(accessLevel: string): string {
  switch (accessLevel) {
    case 'web_admin':
      return colors.error;
    case 'web_user':
      return colors.info;
    case 'both':
      return colors.success;
    default:
      return colors.gray500;
  }
}
