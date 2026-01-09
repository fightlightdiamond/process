# Implementation Plan: Component Driven Design Refactoring

## Overview

Refactor ứng dụng Todo từ monolithic `TodoComponent` thành kiến trúc Component Driven Design với các presentational components (dumb) và container component (smart).

## Tasks

- [x] 1. Tạo TodoItemComponent (Presentational)

  - [x] 1.1 Tạo component với @Input todo và @Output events (toggle, delete, update, editInForm)
    - Tạo file `src/app/components/todo-item/todo-item.component.ts`
    - Sử dụng OnPush change detection
    - Không inject bất kỳ service nào
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 6.1, 6.2, 6.3_
  - [x] 1.2 Tạo template với checkbox, title, inline edit, action buttons
    - Tạo file `src/app/components/todo-item/todo-item.component.html`
    - Tạo file `src/app/components/todo-item/todo-item.component.css`
    - _Requirements: 2.2, 2.5_
  - [x] 1.3 Viết unit tests cho TodoItemComponent
    - Test rendering với các todo inputs khác nhau
    - Test event emissions
    - _Requirements: 2.2, 2.3, 2.4, 2.6, 2.7_
  - [x] 1.4 Viết property test cho TodoItem input/output consistency
    - **Property 2: TodoItem input/output consistency**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.6, 2.7**

- [x] 2. Tạo TodoFormComponent (Presentational)

  - [x] 2.1 Tạo component với @Input editingTodo và @Output events (submitTodo, cancelEdit)
    - Tạo file `src/app/components/todo-form/todo-form.component.ts`
    - Sử dụng OnPush change detection
    - Implement form validation (required, no whitespace)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 6.1, 6.2, 6.3_
  - [x] 2.2 Tạo template với input field, submit/cancel buttons, error messages
    - Tạo file `src/app/components/todo-form/todo-form.component.html`
    - Tạo file `src/app/components/todo-form/todo-form.component.css`
    - _Requirements: 1.2, 1.5_
  - [x] 2.3 Viết unit tests cho TodoFormComponent
    - Test form validation
    - Test event emissions
    - _Requirements: 1.3, 1.4, 1.5, 1.6_
  - [x] 2.4 Viết property test cho Form input/output consistency
    - **Property 1: Form input/output consistency**
    - **Validates: Requirements 1.2, 1.3, 1.6**

- [x] 3. Tạo TodoListComponent (Presentational)

  - [x] 3.1 Tạo component với @Input todos, loading và @Output events
    - Tạo file `src/app/components/todo-list/todo-list.component.ts`
    - Sử dụng OnPush change detection
    - Implement trackBy function
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 6.1, 6.2, 6.3_
  - [x] 3.2 Tạo template render TodoItemComponent và empty state
    - Tạo file `src/app/components/todo-list/todo-list.component.html`
    - Tạo file `src/app/components/todo-list/todo-list.component.css`
    - _Requirements: 3.2, 3.3_
  - [x] 3.3 Viết unit tests cho TodoListComponent
    - Test rendering với empty/non-empty arrays
    - Test event propagation
    - _Requirements: 3.2, 3.3, 3.4_
  - [x] 3.4 Viết property test cho TodoList rendering và event propagation
    - **Property 3: TodoList rendering and event propagation**
    - **Validates: Requirements 3.2, 3.4**

- [x] 4. Checkpoint - Verify presentational components

  - Ensure all presentational components compile without errors
  - Ensure all tests pass
  - Ask the user if questions arise

- [x] 5. Tạo TodoContainerComponent (Smart)

  - [x] 5.1 Tạo container component inject TodoFacade
    - Tạo file `src/app/components/todo-container/todo-container.component.ts`
    - Subscribe to todos$, loading$, error$ từ facade
    - Quản lý editingTodo state
    - _Requirements: 4.1, 4.2, 4.3, 4.6_
  - [x] 5.2 Tạo template compose các presentational components
    - Tạo file `src/app/components/todo-container/todo-container.component.html`
    - Tạo file `src/app/components/todo-container/todo-container.component.css`
    - Hiển thị loading indicator và error message
    - _Requirements: 4.4, 4.5, 5.1, 5.2, 5.4_
  - [x] 5.3 Implement event handlers gọi facade methods
    - Handle submitTodo (add/update)
    - Handle toggle, delete, update events
    - _Requirements: 4.4, 4.5_
  - [x] 5.4 Viết unit tests cho TodoContainerComponent
    - Test với mocked TodoFacade
    - Test event handling
    - _Requirements: 4.4, 4.5_
  - [x] 5.5 Viết property test cho Container event handling
    - **Property 4: Container event handling**
    - **Validates: Requirements 4.4, 4.5**

- [x] 6. Cập nhật AppComponent sử dụng TodoContainerComponent

  - [x] 6.1 Thay thế TodoComponent bằng TodoContainerComponent trong AppComponent
    - Cập nhật imports trong `src/app/app.component.ts`
    - Cập nhật template trong `src/app/app.component.html`
    - _Requirements: 4.1_

- [x] 7. Cleanup và verification

  - [x] 7.1 Xóa hoặc deprecate TodoComponent cũ
    - Có thể giữ lại để reference hoặc xóa hoàn toàn
  - [x] 7.2 Viết property test cho Presentational component purity
    - **Property 5: Presentational component purity**
    - **Validates: Requirements 5.3, 6.1, 6.2**

- [x] 8. Final checkpoint
  - Ensure all tests pass
  - Verify application works correctly
  - Ask the user if questions arise

## Notes

- Each presentational component uses OnPush change detection for performance
- Presentational components không inject services, chỉ sử dụng @Input/@Output
- Container component là nơi duy nhất kết nối với store/facade
- Property tests sử dụng fast-check library
