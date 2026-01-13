# Design Document: Grid System

## Overview

Thiết kế hệ thống Grid System chuẩn cho Angular application, tận dụng PrimeFlex của PrimeNG. Hệ thống dựa trên màn hình chuẩn 1366px với 12 columns, margin 48px và gutter 24px.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Viewport (1366px)                       │
├────┬───────────────────────────────────────────────────┬────┤
│    │                 Content Area (1270px)              │    │
│ 48 │  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐           │ 48 │
│ px │  │84│24│84│24│84│24│84│24│84│24│84│24│...        │ px │
│    │  └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘           │    │
│    │     12 Columns + 11 Gutters                       │    │
└────┴───────────────────────────────────────────────────┴────┘
```

### Grid Calculation (1366px standard)

- Total viewport: 1366px
- Margins: 48px × 2 = 96px
- Content area: 1366 - 96 = 1270px
- Gutters: 24px × 11 = 264px
- Total column space: 1270 - 264 = 1006px
- Column width: 1006 / 12 ≈ 84px

## Components and Interfaces

### 1. Grid Container Component

```typescript
// grid-container.component.ts
@Component({
  selector: "app-grid-container",
  template: `
    <div class="grid-container">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .grid-container {
        width: 100%;
        max-width: calc(100% - var(--grid-margin) * 2);
        margin-left: auto;
        margin-right: auto;
        padding-left: var(--grid-margin);
        padding-right: var(--grid-margin);
      }
    `,
  ],
})
export class GridContainerComponent {}
```

### 2. Grid Row Component

```typescript
// grid-row.component.ts
@Component({
  selector: "app-grid-row",
  template: `
    <div class="grid" [ngClass]="rowClasses">
      <ng-content></ng-content>
    </div>
  `,
})
export class GridRowComponent {
  @Input() align: "start" | "center" | "end" = "start";
  @Input() justify: "start" | "center" | "end" | "between" | "around" = "start";
}
```

### 3. Grid Column Directive

```typescript
// grid-col.directive.ts
@Directive({
  selector: "[appGridCol]",
})
export class GridColDirective {
  @Input() col: number = 12; // Default span
  @Input() sm: number; // ≥576px
  @Input() md: number; // ≥768px
  @Input() lg: number; // ≥992px
  @Input() xl: number; // ≥1200px
  @Input() offset: number;
}
```

## Data Models

### Grid Configuration Interface

```typescript
interface GridConfig {
  margin: number; // 48px
  gutter: number; // 24px
  columns: number; // 12
  breakpoints: {
    xs: number; // 0
    sm: number; // 576
    md: number; // 768
    lg: number; // 992
    xl: number; // 1200
    xxl: number; // 1400
  };
}
```

### Column Span Interface

```typescript
interface ColumnSpan {
  default?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}
```

## CSS Variables & Styles

### Global CSS Variables

```css
:root {
  /* Grid System Variables */
  --grid-margin: 48px;
  --grid-gutter: 24px;
  --grid-columns: 12;

  /* Breakpoints */
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-xxl: 1400px;
}
```

### PrimeFlex Integration

Sử dụng PrimeFlex classes với custom overrides:

```css
/* Override PrimeFlex gutter */
.grid {
  margin-right: calc(var(--grid-gutter) / -2);
  margin-left: calc(var(--grid-gutter) / -2);
}

.grid > [class*="col"] {
  padding-right: calc(var(--grid-gutter) / 2);
  padding-left: calc(var(--grid-gutter) / 2);
}
```

## Usage Examples

### Basic 12-Column Layout

```html
<app-grid-container>
  <div class="grid">
    <div class="col-12 md:col-6 lg:col-4">Column 1</div>
    <div class="col-12 md:col-6 lg:col-4">Column 2</div>
    <div class="col-12 md:col-12 lg:col-4">Column 3</div>
  </div>
</app-grid-container>
```

### With Custom Components

```html
<app-grid-container>
  <app-grid-row align="center" justify="between">
    <div appGridCol [col]="12" [md]="6" [lg]="3">Item 1</div>
    <div appGridCol [col]="12" [md]="6" [lg]="3">Item 2</div>
    <div appGridCol [col]="12" [md]="6" [lg]="3">Item 3</div>
    <div appGridCol [col]="12" [md]="6" [lg]="3">Item 4</div>
  </app-grid-row>
</app-grid-container>
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Column Width Calculation

_For any_ viewport width and grid configuration (margin, gutter, columns), the column width should equal:
`(viewportWidth - 2 * margin - (columns - 1) * gutter) / columns`

**Validates: Requirements 2.2, 2.4**

### Property 2: Content Area Calculation

_For any_ viewport width and margin value, the content area width should equal:
`viewportWidth - 2 * margin`

**Validates: Requirements 1.3**

### Property 3: Grid Configuration Invariants

_For any_ valid grid configuration:

- margin must be a positive number
- gutter must be a positive number
- columns must be a positive integer (default 12)
- All breakpoint values must be in ascending order (xs < sm < md < lg < xl < xxl)

**Validates: Requirements 3.1, 5.1, 5.2, 5.3**

## Error Handling

| Error Scenario                  | Handling Strategy                    |
| ------------------------------- | ------------------------------------ |
| Invalid column span (>12 or <1) | Clamp to valid range [1, 12]         |
| Missing breakpoint value        | Fall back to next smaller breakpoint |
| Invalid CSS variable            | Use default values                   |
| Negative margin/gutter          | Use absolute value                   |

## Testing Strategy

### Unit Tests

- Test GridConfig default values
- Test column width calculation function
- Test content area calculation
- Test breakpoint ordering validation

### Property-Based Tests

- Use fast-check library (already in project)
- Test column width formula with random viewport widths
- Test content area formula with random margins
- Test grid configuration invariants

### Integration Tests

- Test GridContainerComponent renders with correct styles
- Test responsive behavior at different breakpoints
- Test PrimeFlex class integration
