# Design Document: RxJS Todo CRUD

## Overview

Ứng dụng CRUD Todo sử dụng Angular với RxJS để quản lý state một cách reactive. Architecture theo pattern Service-based State Management với BehaviorSubject làm core. UI sử dụng PrimeNG components để có giao diện đẹp và chuyên nghiệp.

## Architecture

```mermaid
graph TB
    subgraph Components
        TC[TodoComponent]
        TF[Todo Form]
        TL[Todo List]
        TI[Todo Item]
    end

    subgraph Service Layer
        TS[TodoService]
        BS[BehaviorSubject<Todo[]>]
    end

    TC --> TF
    TC --> TL
    TL --> TI

    TF -->|add| TS
    TI -->|toggle/update/delete| TS
    TS --> BS
    BS -->|todos$| TC
```

## Components and Interfaces

### Todo Interface

```typescript
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

### TodoService

Service chịu trách nhiệm quản lý state của todos:

```typescript
class TodoService {
  private todosSubject: BehaviorSubject<Todo[]>;
  todos$: Observable<Todo[]>;

  addTodo(title: string): void;
  updateTodo(id: string, updates: Partial<Todo>): void;
  toggleTodo(id: string): void;
  deleteTodo(id: string): void;
}
```

### TodoComponent

Component chính chứa form và list, sử dụng PrimeNG components:

```typescript
@Component({...})
class TodoComponent {
  todos$: Observable<Todo[]>;
  newTodoTitle: string;

  onAddTodo(): void;
  onToggleTodo(id: string): void;
  onUpdateTodo(id: string, title: string): void;
  onDeleteTodo(id: string): void;
}
```

## PrimeNG Components

| Component  | Usage                      |
| ---------- | -------------------------- |
| InputText  | Input field cho todo title |
| Button     | Add, Delete buttons        |
| Checkbox   | Toggle completed status    |
| Card       | Container cho todo list    |
| InputGroup | Group input với button     |

## Data Models

### Todo Model

| Field     | Type    | Description              |
| --------- | ------- | ------------------------ |
| id        | string  | Unique identifier (UUID) |
| title     | string  | Todo description         |
| completed | boolean | Completion status        |

### State Structure

```typescript
// Initial state
const initialTodos: Todo[] = [];

// State stored in BehaviorSubject
private todosSubject = new BehaviorSubject<Todo[]>(initialTodos);
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Adding a valid todo grows the list

_For any_ todo list and any valid (non-empty, non-whitespace) title string, adding it to the todo list should result in the list length growing by one and the new todo being present in the list.

**Validates: Requirements 1.1**

### Property 2: Empty/whitespace todos are rejected

_For any_ string composed entirely of whitespace (including empty string), attempting to add it as a todo should be rejected, and the todo list should remain unchanged.

**Validates: Requirements 1.2**

### Property 3: Toggle flips completed status

_For any_ todo in the list, toggling it should flip its completed status from true to false or false to true, while keeping all other properties unchanged.

**Validates: Requirements 3.1**

### Property 4: Update changes only the specified todo's title

_For any_ todo in the list and any new valid title, updating that todo's title should change only that todo's title while leaving all other todos unchanged.

**Validates: Requirements 3.2**

### Property 5: Delete removes the specified todo

_For any_ todo in the list, deleting it should remove exactly that todo from the list, reducing the list length by one.

**Validates: Requirements 4.1**

### Property 6: Reactive updates propagate to subscribers

_For any_ CRUD operation (add, update, toggle, delete), all subscribers to the todos$ Observable should receive the updated list immediately after the operation.

**Validates: Requirements 2.2, 3.3, 4.2, 5.3**

## Error Handling

| Error Case               | Handling Strategy                |
| ------------------------ | -------------------------------- |
| Empty todo title         | Reject addition, no state change |
| Whitespace-only title    | Reject addition, no state change |
| Update non-existent todo | No-op, maintain current state    |
| Delete non-existent todo | No-op, maintain current state    |

## Testing Strategy

### Unit Tests

- Test TodoService methods individually
- Test component rendering with mock data
- Test form validation

### Property-Based Tests

- Use fast-check library for property-based testing
- Minimum 100 iterations per property test
- Test all correctness properties defined above

### Test Configuration

```typescript
// Install fast-check for property-based testing
// npm install --save-dev fast-check

// Each property test should be tagged:
// Feature: rxjs-todo-crud, Property N: [property description]
```
