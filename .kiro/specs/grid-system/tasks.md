# Implementation Plan: Grid System

## Overview

Triển khai hệ thống Grid System chuẩn với 12 columns, margin 48px, gutter 24px, tích hợp PrimeFlex của PrimeNG.

## Tasks

- [x] 1. Setup CSS Variables và Global Styles
  - [x] 1.1 Tạo file `src/styles/grid-variables.css` với CSS variables
    - Định nghĩa --grid-margin: 48px
    - Định nghĩa --grid-gutter: 24px
    - Định nghĩa --grid-columns: 12
    - Định nghĩa breakpoint variables
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [x] 1.2 Import grid-variables.css vào styles.css
    - _Requirements: 5.4_

- [-] 2. Tạo Grid Configuration và Utilities
  - [x] 2.1 Tạo `src/app/shared/grid/grid.config.ts`
    - Định nghĩa GridConfig interface
    - Định nghĩa ColumnSpan interface
    - Export default grid configuration
    - Tạo hàm calculateColumnWidth(viewportWidth, config)
    - Tạo hàm calculateContentArea(viewportWidth, margin)
    - _Requirements: 2.2, 2.4, 1.3_
  - [ ]\* 2.2 Write property test cho calculateColumnWidth
    - **Property 1: Column Width Calculation**
    - **Validates: Requirements 2.2, 2.4**
  - [ ]\* 2.3 Write property test cho calculateContentArea
    - **Property 2: Content Area Calculation**
    - **Validates: Requirements 1.3**

- [-] 3. Tạo GridContainerComponent
  - [x] 3.1 Generate component `ng g c shared/grid/grid-container`
    - Template với div.grid-container và ng-content
    - Styles với margin 48px và centering
    - _Requirements: 1.1, 1.2_
  - [ ]\* 3.2 Write unit tests cho GridContainerComponent
    - Test component renders correctly
    - Test CSS classes applied
    - _Requirements: 1.1, 1.2_

- [x] 4. Tạo GridRowComponent
  - [x] 4.1 Generate component `ng g c shared/grid/grid-row`
    - Input properties: align, justify
    - Template sử dụng PrimeFlex grid class
    - _Requirements: 4.3_
  - [ ]\* 4.2 Write unit tests cho GridRowComponent
    - Test alignment classes
    - Test justify classes
    - _Requirements: 4.3_

- [x] 5. Tạo GridColDirective
  - [x] 5.1 Generate directive `ng g d shared/grid/grid-col`
    - Input: col, sm, md, lg, xl, offset
    - Apply PrimeFlex responsive classes dynamically
    - _Requirements: 2.1, 2.5, 3.2, 3.3, 4.1, 4.2_
  - [ ]\* 5.2 Write unit tests cho GridColDirective
    - Test column span classes
    - Test responsive breakpoint classes
    - Test offset classes
    - _Requirements: 2.1, 3.2, 4.1_

- [x] 6. Tạo Grid Override Styles
  - [x] 6.1 Tạo `src/styles/grid-overrides.css`
    - Override PrimeFlex gutter với --grid-gutter
    - Custom grid container styles
    - _Requirements: 2.3, 2.5_
  - [x] 6.2 Import grid-overrides.css vào styles.css
    - _Requirements: 2.3_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Export và Integration
  - [x] 8.1 Tạo `src/app/shared/grid/index.ts` barrel export
    - Export tất cả grid components và directives
    - _Requirements: 2.1_
  - [x] 8.2 Update SharedModule hoặc tạo GridModule
    - Declare và export grid components
    - _Requirements: 2.1_

- [x] 9. Demo và Documentation
  - [x] 9.1 Tạo demo page sử dụng grid system
    - Ví dụ 12-column layout
    - Ví dụ responsive layout
    - _Requirements: 2.1, 3.2_

- [x] 10. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Sử dụng PrimeFlex classes có sẵn trong PrimeNG
- fast-check đã được cài đặt trong project cho property-based testing
