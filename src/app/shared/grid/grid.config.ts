/**
 * Grid System Configuration
 * Based on 1366px standard viewport with 12 columns, 48px margin, 24px gutter
 */

/**
 * Grid configuration interface defining the core grid parameters
 */
export interface GridConfig {
  margin: number; // 48px default
  gutter: number; // 24px default
  columns: number; // 12 default
  breakpoints: {
    xs: number; // 0
    sm: number; // 576
    md: number; // 768
    lg: number; // 992
    xl: number; // 1200
    xxl: number; // 1400
  };
}

/**
 * Column span interface for responsive column definitions
 */
export interface ColumnSpan {
  default?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

/**
 * Default grid configuration
 */
export const DEFAULT_GRID_CONFIG: GridConfig = {
  margin: 48,
  gutter: 24,
  columns: 12,
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  },
};

/**
 * Calculates the width of a single column based on viewport width and grid configuration
 *
 * Formula: (viewportWidth - 2 * margin - (columns - 1) * gutter) / columns
 *
 * @param viewportWidth - The current viewport width in pixels
 * @param config - Grid configuration (uses default if not provided)
 * @returns The calculated column width in pixels
 */
export function calculateColumnWidth(
  viewportWidth: number,
  config: GridConfig = DEFAULT_GRID_CONFIG
): number {
  const { margin, gutter, columns } = config;

  // Ensure positive values
  const safeMargin = Math.abs(margin);
  const safeGutter = Math.abs(gutter);
  const safeColumns = Math.max(1, Math.abs(columns));

  const contentArea = viewportWidth - 2 * safeMargin;
  const totalGutterSpace = (safeColumns - 1) * safeGutter;
  const totalColumnSpace = contentArea - totalGutterSpace;

  return totalColumnSpace / safeColumns;
}

/**
 * Calculates the content area width based on viewport width and margin
 *
 * Formula: viewportWidth - 2 * margin
 *
 * @param viewportWidth - The current viewport width in pixels
 * @param margin - The margin value in pixels (uses default if not provided)
 * @returns The calculated content area width in pixels
 */
export function calculateContentArea(
  viewportWidth: number,
  margin: number = DEFAULT_GRID_CONFIG.margin
): number {
  // Ensure positive margin value
  const safeMargin = Math.abs(margin);
  return viewportWidth - 2 * safeMargin;
}
