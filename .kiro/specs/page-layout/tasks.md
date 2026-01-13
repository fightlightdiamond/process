# Implementation Plan: Page Layout System

## Overview

Implement a standardized page layout framework for the Angular application with fixed-height header, navigation, breadcrumb, and footer areas, plus a flexible main content area. The implementation follows Component Driven Design principles with presentational components and content projection.

## Tasks

- [x] 1. Set up layout models and constants
  - Create layout configuration interface and default values
  - Create NavItem and BreadcrumbItem interfaces
  - Export from shared module
  - _Requirements: 6.1, 7.5_

- [x] 2. Implement PageLayoutComponent
  - [x] 2.1 Create PageLayoutComponent with content projection slots
    - Create component with @Input properties for configuration
    - Implement template with ng-content selectors for each area
    - Add conditional rendering for optional areas (breadcrumb, action)
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 2.2 Implement CSS with custom properties and flexbox layout
    - Define CSS custom properties for all height values
    - Implement flexbox layout for vertical stacking
    - Add overflow handling for main content area
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 4.4, 4.5, 5.1, 7.5_

  - [x] 2.3 Write property test for fixed-height areas
    - **Property 1: Fixed-height areas maintain specified heights**
    - **Validates: Requirements 1.1, 2.1, 3.1, 4.4, 4.5, 5.1**

  - [x] 2.4 Write property test for optional area hiding
    - **Property 5: Optional areas can be hidden via inputs**
    - **Validates: Requirements 7.3, 7.4**

- [x] 3. Implement HeaderComponent
  - [x] 3.1 Create HeaderComponent as presentational component
    - Create standalone component with OnPush change detection
    - Add @Input for title and logoUrl
    - Add @Output for logoClick event
    - Implement template with logo and title display
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 3.2 Write unit tests for HeaderComponent
    - Test rendering with different inputs
    - Test logoClick event emission
    - _Requirements: 1.1, 1.3_

- [x] 4. Implement NavigationComponent
  - [x] 4.1 Create NavigationComponent as presentational component
    - Create standalone component with OnPush change detection
    - Add @Input for items array and activeRoute
    - Add @Output for navigate event
    - Implement template with navigation items
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.2 Write unit tests for NavigationComponent
    - Test rendering with different nav items
    - Test active state highlighting
    - Test navigate event emission
    - _Requirements: 2.1, 2.3_

- [x] 5. Implement BreadcrumbComponent
  - [x] 5.1 Create BreadcrumbComponent as presentational component
    - Create standalone component with OnPush change detection
    - Add @Input for items array
    - Add @Output for navigate event
    - Implement template with breadcrumb trail
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 5.2 Write unit tests for BreadcrumbComponent
    - Test rendering with different breadcrumb items
    - Test navigate event emission
    - _Requirements: 3.1, 3.3_

- [x] 6. Implement FooterComponent
  - [x] 6.1 Create FooterComponent as presentational component
    - Create standalone component with OnPush change detection
    - Add @Input for copyright and links
    - Implement template with copyright and link display
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 6.2 Write unit tests for FooterComponent
    - Test rendering with different inputs
    - Test link rendering
    - _Requirements: 5.1, 5.3_

- [x] 7. Checkpoint - Ensure all component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement layout height calculations
  - [x] 8.1 Add responsive height handling to PageLayoutComponent
    - Implement main content area height calculation
    - Add viewport resize handling
    - Ensure fixed areas maintain heights
    - _Requirements: 4.1, 6.1, 6.2, 6.3_

  - [x] 8.2 Write property test for height calculations
    - **Property 3: Main content area fills remaining space**
    - **Validates: Requirements 4.1, 4.3, 6.1, 6.2**

  - [x] 8.3 Write property test for responsive height maintenance
    - **Property 2: Fixed heights maintained across viewport widths**
    - **Validates: Requirements 1.4, 2.4, 3.4, 5.4, 6.3**

- [x] 9. Implement content projection verification
  - [x] 9.1 Add content projection slots and selectors
    - Verify all ng-content selectors work correctly
    - Add fallback content for empty slots if needed
    - _Requirements: 7.2_

  - [x] 9.2 Write property test for content projection
    - **Property 4: Content projection renders in correct slots**
    - **Validates: Requirements 7.2**
    - **Status: COMPLETED** - Fixed template compilation errors by filtering unsafe characters

- [x] 10. Integration and exports
  - [x] 10.1 Create barrel exports for layout components
    - Create index.ts for layout components
    - Export all components and models
    - _Requirements: 7.1_

  - [x] 10.2 Update shared module exports
    - Add layout components to shared exports
    - _Requirements: 7.1_

- [x] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All components use OnPush change detection for performance
- CSS custom properties enable easy theming and customization
