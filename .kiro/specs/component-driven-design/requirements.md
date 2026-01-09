# Requirements Document

## Introduction

Refactor ứng dụng Todo hiện tại theo mô hình "Component Driven Design" (CDD). Mục tiêu là tách biệt rõ ràng giữa các Presentational Components (dumb components) và Container Components (smart components), giúp code dễ test, tái sử dụng và bảo trì hơn.

## Glossary

- **Container_Component**: Component chứa logic nghiệp vụ, kết nối với store/services, truyền data xuống presentational components qua @Input và nhận events qua @Output
- **Presentational_Component**: Component chỉ nhận data qua @Input và emit events qua @Output, không có logic nghiệp vụ, không inject services
- **Todo_System**: Hệ thống quản lý Todo bao gồm tất cả components, services và store
- **Smart_Component**: Tên gọi khác của Container Component
- **Dumb_Component**: Tên gọi khác của Presentational Component

## Requirements

### Requirement 1: Tách TodoFormComponent

**User Story:** As a developer, I want to have a separate TodoFormComponent, so that the form logic is isolated and reusable.

#### Acceptance Criteria

1. THE Todo_System SHALL have a standalone TodoFormComponent as a Presentational_Component
2. WHEN TodoFormComponent receives an editingTodo via @Input, THE TodoFormComponent SHALL populate the form with the todo's title
3. WHEN user submits a valid form, THE TodoFormComponent SHALL emit a submitTodo event with the title string
4. WHEN user clicks cancel during edit mode, THE TodoFormComponent SHALL emit a cancelEdit event
5. WHEN form validation fails, THE TodoFormComponent SHALL display appropriate error messages
6. THE TodoFormComponent SHALL validate that title is not empty or whitespace-only

### Requirement 2: Tách TodoItemComponent

**User Story:** As a developer, I want to have a separate TodoItemComponent, so that each todo item's display and interactions are encapsulated.

#### Acceptance Criteria

1. THE Todo_System SHALL have a standalone TodoItemComponent as a Presentational_Component
2. WHEN TodoItemComponent receives a todo via @Input, THE TodoItemComponent SHALL display the todo's title and completed status
3. WHEN user clicks the checkbox, THE TodoItemComponent SHALL emit a toggle event with the todo id
4. WHEN user clicks the delete button, THE TodoItemComponent SHALL emit a delete event with the todo id
5. WHEN user double-clicks the title, THE TodoItemComponent SHALL enter inline edit mode
6. WHEN user saves inline edit, THE TodoItemComponent SHALL emit an update event with id and new title
7. WHEN user clicks the edit button, THE TodoItemComponent SHALL emit an editInForm event with the todo object

### Requirement 3: Tách TodoListComponent

**User Story:** As a developer, I want to have a separate TodoListComponent, so that the list rendering logic is isolated.

#### Acceptance Criteria

1. THE Todo_System SHALL have a standalone TodoListComponent as a Presentational_Component
2. WHEN TodoListComponent receives todos array via @Input, THE TodoListComponent SHALL render a TodoItemComponent for each todo
3. WHEN TodoListComponent receives an empty todos array, THE TodoListComponent SHALL display an empty state message
4. WHEN TodoItemComponent emits any event, THE TodoListComponent SHALL re-emit the event to parent component
5. THE TodoListComponent SHALL use trackBy function for optimal rendering performance

### Requirement 4: Tạo TodoContainerComponent

**User Story:** As a developer, I want to have a TodoContainerComponent as the smart component, so that all business logic is centralized.

#### Acceptance Criteria

1. THE Todo_System SHALL have a TodoContainerComponent as a Container_Component
2. THE TodoContainerComponent SHALL inject TodoFacade to interact with the store
3. WHEN TodoContainerComponent initializes, THE TodoContainerComponent SHALL subscribe to todos$, loading$, and error$ from facade
4. WHEN TodoFormComponent emits submitTodo, THE TodoContainerComponent SHALL call appropriate facade method (add or update)
5. WHEN TodoListComponent emits toggle/delete/update events, THE TodoContainerComponent SHALL call corresponding facade methods
6. THE TodoContainerComponent SHALL manage the editingTodo state and pass it to TodoFormComponent

### Requirement 5: Hiển thị Loading và Error States

**User Story:** As a developer, I want loading and error states to be properly displayed, so that users have feedback during async operations.

#### Acceptance Criteria

1. WHEN loading$ is true, THE TodoContainerComponent SHALL display a loading indicator
2. WHEN error$ has a value, THE TodoContainerComponent SHALL display an error message
3. THE Presentational_Components SHALL NOT directly subscribe to any observables
4. THE Container_Component SHALL pass loading and error states to child components via @Input if needed

### Requirement 6: Đảm bảo tính tái sử dụng của Presentational Components

**User Story:** As a developer, I want presentational components to be fully reusable, so that they can be used in different contexts.

#### Acceptance Criteria

1. THE Presentational_Components SHALL NOT inject any services
2. THE Presentational_Components SHALL communicate only via @Input and @Output
3. THE Presentational_Components SHALL use OnPush change detection strategy
4. THE Presentational_Components SHALL be fully testable without mocking services
