/**
 * Common StyleSheet patterns for mobile applications
 */

import { StyleSheet } from 'react-native';
import { colors } from './colors';

/**
 * Common shadow styles for different elevations
 */
export const shadows = StyleSheet.create({
  small: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});

/**
 * Common spacing values
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/**
 * Common border radius values
 */
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

/**
 * Common font sizes
 */
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/**
 * Common font weights
 */
export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * Common layout patterns
 */
export const layout = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  containerPadded: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.bgPrimary,
  },
});

/**
 * Common card style
 */
export const card = StyleSheet.create({
  default: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.medium,
  },
});

/**
 * Common button styles
 */
export const button = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.gray100,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
});

/**
 * Common input styles
 */
export const input = StyleSheet.create({
  default: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  focused: {
    borderColor: colors.primary,
  },
  error: {
    borderColor: colors.error,
  },
});
