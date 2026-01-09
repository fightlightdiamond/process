# Design Document: Component Driven Design Refactoring

## Overview

Refactor ứng dụng Todo từ một monolithic component (`TodoComponent`) thành kiến trúc Component Driven Design với sự phân tách rõ ràng giữa Container Components (smart) và Presentational Components (dumb).

### Kiến trúc hiện tại

```
AppComponent
└── TodoComponent (monolithic - chứa tất cả logic)
```

### Kiến trúc mới

```
AppComponent
└── TodoContainerComponent (smart - business logic)
    ├── TodoFormComponent (dumb - form UI)
    ├── TodoListComponent (dumb - list rendering)
    │   └── TodoItemComponent (dumb - item UI)
    └── Loading/Error indicators
```

## Architecture

```mermaid
graph TB
    subgraph "Container Layer (Smart)"
        TC[TodoContainerComponent]
    end

    subgraph "Presentation Layer (Dumb)"
        TF[TodoFormComponent]
        TL[TodoListComponent]
        TI[TodoItemComponent]
    end

    subgraph "State Management"
        FAC[TodoFacade]
        STORE[TodoStore]
    end

    TC -->|@Input: editingTodo| TF
    TC -->|@Input: todos, loading| TL
    TL -->|@Input: todo| TI

    TF -->|@Output: submitTodo, cancelEdit| TC
    TL -->|@Output: toggle, delete, update, editInForm| TC
    TI -->|@Output: toggle, delete, update, editInForm| TL

    TC -->|inject| FAC
    FAC -->|dispatch/select| STORE
```

## Components and Interfaces

### 1. TodoFormComponent (Presentational)

```typescript
// Inputs
@Input() editingTodo: Todo | null = null;

// Outputs
@Output() submitTodo = new EventEmitter<string>();
@Output() cancelEdit = new EventEmitter<void>();

// Internal state
todoForm: FormGroup;
```

**Responsibilities:**

- Render form với input và buttons
- Validate input (required, no whitespace)
- Emit events khi submit hoặc cancel
- Hiển thị error messages cho validation

### 2. TodoItemComponent (Presentational)

```typescript
// Inputs
@Input({ required: true }) todo!: Todo;

// Outputs
@Output() toggle = new EventEmitter<string>();
@Output() delete = new EventEmitter<string>();
@Output() update = new EventEmitter<{ id: string; title: string }>();
@Output() editInForm = new EventEmitter<Todo>();

// Internal state
isEditing: boolean = false;
editTitle: string = '';
```

**Responsibilities:**

- Render todo item với checkbox, title, action buttons
- Handle inline editing (double-click)
- Emit events cho toggle, delete, update, editInForm

### 3. TodoListComponent (Presentational)

```typescript
// Inputs
@Input() todos: Todo[] = [];
@Input() loading: boolean = false;

// Outputs
@Output() toggle = new EventEmitter<string>();
@Output() delete = new EventEmitter<string>();
@Output() update = new EventEmitter<{ id: string; title: string }>();
@Output() editInForm = new EventEmitter<Todo>();
```

**Responsibilities:**

- Render danh sách TodoItemComponent
- Hiển thị empty state khi không có todos
- Re-emit events từ TodoItemComponent
- Sử dụng trackBy cho performance

### 4. TodoContainerComponent (Container/Smart)

```typescript
// Observables from facade
todos$: Observable<Todo[]>;
loading$: Observable<boolean>;
error$: Observable<string | null>;

// Local state
editingTodo: Todo | null = null;

// Injected
constructor(private facade: TodoFacade) {}
```

**Responsibilities:**

- Kết nối với TodoFacade
- Quản lý editingTodo state
- Handle events từ child components
- Gọi facade methods tương ứng

## Data Models

Sử dụng lại models hiện có:

```typescript
// src/app/models/todo.model.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Form input/output consistency

_For any_ valid todo object passed as editingTodo input, THE TodoFormComponent SHALL populate the form with the todo's title, AND _for any_ valid form submission (non-empty, non-whitespace string), THE TodoFormComponent SHALL emit a submitTodo event containing the trimmed title string, AND _for any_ whitespace-only string, THE TodoFormComponent SHALL reject the submission.
**Validates: Requirements 1.2, 1.3, 1.6**

### Property 2: TodoItem input/output consistency

_For any_ valid todo object passed as input, THE TodoItemComponent SHALL correctly display the todo's title and completed status, AND when user interactions occur (toggle, delete, update, editInForm), THE TodoItemComponent SHALL emit events containing the correct todo id and/or data.
**Validates: Requirements 2.2, 2.3, 2.4, 2.6, 2.7**

### Property 3: TodoList rendering and event propagation

_For any_ non-empty todos array passed to TodoListComponent, THE TodoListComponent SHALL render exactly one TodoItemComponent for each todo in the array, AND _for any_ event emitted by a child TodoItemComponent, THE TodoListComponent SHALL re-emit the event to its parent.
**Validates: Requirements 3.2, 3.4**

### Property 4: Container event handling

_For any_ event emitted by child presentational components (submitTodo, toggle, delete, update), THE TodoContainerComponent SHALL call the corresponding facade method with correct parameters.
**Validates: Requirements 4.4, 4.5**

### Property 5: Presentational component purity

_For any_ presentational component (TodoFormComponent, TodoItemComponent, TodoListComponent), THE component SHALL NOT inject any services, SHALL NOT directly subscribe to observables, and SHALL only communicate via @Input and @Output decorators.
**Validates: Requirements 5.3, 6.1, 6.2**

## Error Handling

- **Form validation errors**: Hiển thị inline error messages trong TodoFormComponent
- **API errors**: Hiển thị error message từ error$ observable trong TodoContainerComponent
- **Empty state**: Hiển thị friendly message khi không có todos

## Testing Strategy

### Unit Tests (Presentational Components)

- Test TodoFormComponent với các input combinations
- Test TodoItemComponent events và rendering
- Test TodoListComponent với empty/non-empty arrays
- Không cần mock services vì presentational components không inject services

### Property-Based Tests

- Property 1: Form submission với random valid strings
- Property 2: TodoItem events với random todo data
- Property 3: TodoList rendering với random todo arrays
- Property 5: Verify no service injection

### Integration Tests

- Test TodoContainerComponent với mocked TodoFacade
- Test full component tree rendering

### Testing Framework

- Jasmine/Karma (Angular default)
- fast-check cho property-based testing
