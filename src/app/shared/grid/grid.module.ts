import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GridContainerComponent } from "./grid-container/grid-container.component";
import { GridRowComponent } from "./grid-row/grid-row.component";
import { GridColDirective } from "./grid-col.directive";

/**
 * GridModule - Module for the Grid System
 *
 * This module provides all grid-related components and directives.
 * Can be imported in feature modules that need grid functionality.
 *
 * Requirements: 2.1 - THE Grid_System SHALL provide 12 columns for layout
 *
 * Usage:
 * ```typescript
 * import { GridModule } from '@shared/grid';
 *
 * @NgModule({
 *   imports: [GridModule],
 *   // ...
 * })
 * export class FeatureModule {}
 * ```
 *
 * For standalone components, import individual components directly:
 * ```typescript
 * import { GridContainerComponent, GridRowComponent, GridColDirective } from '@shared/grid';
 *
 * @Component({
 *   imports: [GridContainerComponent, GridRowComponent, GridColDirective],
 *   // ...
 * })
 * export class MyComponent {}
 * ```
 */
@NgModule({
  imports: [
    CommonModule,
    // Import standalone components
    GridContainerComponent,
    GridRowComponent,
    GridColDirective,
  ],
  exports: [
    // Export for use in other modules
    GridContainerComponent,
    GridRowComponent,
    GridColDirective,
  ],
})
export class GridModule {}
