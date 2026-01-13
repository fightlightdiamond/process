/**
 * Grid System Barrel Export
 * Exports all grid components, directives, utilities, and module
 * Requirements: 2.1 - THE Grid_System SHALL provide 12 columns for layout
 */

// Module
export { GridModule } from "./grid.module";

// Components
export { GridContainerComponent } from "./grid-container/grid-container.component";
export { GridRowComponent } from "./grid-row/grid-row.component";

// Directives
export { GridColDirective } from "./grid-col.directive";

// Configuration and Utilities
export {
  GridConfig,
  ColumnSpan,
  DEFAULT_GRID_CONFIG,
  calculateColumnWidth,
  calculateContentArea,
} from "./grid.config";
