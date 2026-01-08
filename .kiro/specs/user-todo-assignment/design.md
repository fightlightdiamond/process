# Design Document: User Management & Todo Assignment

## Overview

Mở rộng ứng dụng Todo CRUD để hỗ trợ quản lý người dùng và gán người dùng vào todos. Sử dụng cùng pattern Service-based State Management với BehaviorSubject. UI sử dụng PrimeNG components bao gồm Dropdown, Avatar, và MultiSelect.

## Architecture

```mermaid
graph TB
    subgraph Components
        TC[TodoComponent]
        UC[UserComponent]
        US[UserSelector]
        UL[UserList]
        TI[TodoItem]
        FF[FilterBar]
    end

    subgraph Service Layer
        TS[TodoService]
        UserS[UserService]
        TBS[BehaviorSubject<Todo[]>]
        UBS[BehaviorSubject<User[]>]
    end

    TC --> TI
    TC --> FF
    UC --> UL
    TI --> US

    US -->|assign/unassign| TS
    UL -->|CRUD| UserS
    FF -->|filter| TC

    TS --> TBS
    UserS --> UBS

    TBS -->|todos$| TC
    UBS -->|users$| UC
    UBS -->|users$| US
    UBS -->|users$| FF
```

## Components and Interfaces

### User Interface

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

### Updated Todo Interface

```typescript
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  assigneeId?: string; // Reference to User.id
}
```

### UserService

Service quản lý state của users:

```typescript
class UserService {
  private subject: BehaviorSubject<User[]>;
  items$: Observable<User[]>;

  getAll(): User[];
  getById(id: string): User | undefined;
  add(name: string, email: string, avatar?: string): boolean;
  update(id: string, updates: Partial<User>): void;
  delete(id: string): void;
}
```

### Updated TodoService

Mở rộng TodoService để hỗ trợ assignment:

```typescript
class TodoService {
  // Existing methods: add, update, toggle, delete...

  assign(todoId: string, userId: string): void;
  unassign(todoId: string): void;
  getByAssignee(userId: string | null): Todo[];
  unassignAll(userId: string): void; // Unassign user from all todos
}
```

### UserComponent

Component quản lý users:

```typescript
@Component({...})
class UserComponent {
  users$: Observable<User[]>;

  onAdd(name: string, email: string): void;
  onUpdate(id: string, updates: Partial<User>): void;
  onDelete(id: string): void;
}
```

### UserSelectorComponent

Component dropdown để chọn user:

```typescript
@Component({...})
class UserSelectorComponent {
  @Input() todoId: string;
  @Input() currentAssigneeId?: string;
  @Output() assigneeChanged: EventEmitter<string | null>;

  users$: Observable<User[]>;

  onSelect(userId: string): void;
  onClear(): void;
}
```

## PrimeNG Components

| Component   | Usage                                   |
| ----------- | --------------------------------------- |
| Dropdown    | User selector cho assignment            |
| Avatar      | Hiển thị avatar của user                |
| Chip        | Hiển thị assignee trên todo item        |
| Dialog      | Form thêm/sửa user                      |
| DataTable   | Danh sách users (optional)              |
| MultiSelect | Filter by multiple assignees (optional) |

## Data Models

### User Model

| Field  | Type    | Description              |
| ------ | ------- | ------------------------ |
| id     | string  | Unique identifier (UUID) |
| name   | string  | Tên người dùng           |
| email  | string  | Email người dùng         |
| avatar | string? | URL avatar (optional)    |

### Updated Todo Model

| Field      | Type    | Description                        |
| ---------- | ------- | ---------------------------------- |
| id         | string  | Unique identifier (UUID)           |
| title      | string  | Todo description                   |
| completed  | boolean | Completion status                  |
| assigneeId | string? | ID của user được assign (optional) |

### State Structure

```typescript
// User state
private usersSubject = new BehaviorSubject<User[]>([]);

// Todo state (updated)
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Adding a valid user grows the list

_For any_ user list and any valid (non-empty name, valid email) user data, adding a user should result in the list length growing by one and the new user being present with a unique id.

**Validates: Requirements 1.3**

### Property 2: Update changes only the specified user

_For any_ user in the list and any valid update data, updating that user should change only that user's properties while leaving all other users unchanged.

**Validates: Requirements 1.4**

### Property 3: Delete removes user and unassigns from todos

_For any_ user in the list, deleting them should remove exactly that user from the list and set assigneeId to null for all todos that were assigned to that user.

**Validates: Requirements 1.5**

### Property 4: Assign updates todo with user id

_For any_ todo and any existing user, assigning that user to the todo should update the todo's assigneeId to the user's id while keeping all other todo properties unchanged.

**Validates: Requirements 3.3, 3.5**

### Property 5: Unassign removes assignee from todo

_For any_ todo with an assignee, unassigning should set the todo's assigneeId to null/undefined while keeping all other properties unchanged.

**Validates: Requirements 4.2**

### Property 6: Filter by assignee returns correct todos

_For any_ filter selection (specific user, all, or unassigned), the filtered result should contain only todos matching that criteria:

- Specific user: all todos have that assigneeId
- All: all todos returned
- Unassigned: all todos have no assigneeId

**Validates: Requirements 5.2, 5.4**

### Property 7: Reactive updates propagate to subscribers

_For any_ CRUD operation on users or assignment operation on todos, all subscribers should receive the updated list immediately after the operation.

**Validates: Requirements 2.3, 6.3**

### Property 8: User display contains required information

_For any_ user, the rendered display should contain the user's name, email, and avatar (if present).

**Validates: Requirements 2.2, 3.4**

## Error Handling

| Error Case                   | Handling Strategy                          |
| ---------------------------- | ------------------------------------------ |
| Empty user name              | Reject addition, no state change           |
| Invalid email format         | Reject addition, no state change           |
| Assign non-existent user     | No-op, maintain current state              |
| Assign to non-existent todo  | No-op, maintain current state              |
| Delete user with assignments | Unassign from all todos first, then delete |
| Duplicate email              | Reject addition, show error message        |

## Testing Strategy

### Unit Tests

- Test UserService methods individually
- Test TodoService assignment methods
- Test component rendering with mock data
- Test filter functionality

### Property-Based Tests

- Use fast-check library for property-based testing
- Minimum 100 iterations per property test
- Test all correctness properties defined above

### Test Configuration

```typescript
// Each property test should be tagged:
// Feature: user-todo-assignment, Property N: [property description]
```

## UI Mockup

### Todo Item with Assignment

```
┌─────────────────────────────────────────────────────┐
│ ☐ Buy groceries                                     │
│   👤 John Doe ▼                              🗑️    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ☑ Complete report                                   │
│   [Assign to...] ▼                           🗑️    │
└─────────────────────────────────────────────────────┘
```

### Filter Bar

```
┌─────────────────────────────────────────────────────┐
│ Filter by: [All Users ▼]                            │
│            ├─ All Users                             │
│            ├─ Unassigned                            │
│            ├─ John Doe                              │
│            └─ Jane Smith                            │
└─────────────────────────────────────────────────────┘
```

### User Management

```
┌─────────────────────────────────────────────────────┐
│ Users                                    [+ Add]    │
├─────────────────────────────────────────────────────┤
│ 👤 John Doe                                         │
│    john@example.com                    [Edit] [Del] │
├─────────────────────────────────────────────────────┤
│ 👤 Jane Smith                                       │
│    jane@example.com                    [Edit] [Del] │
└─────────────────────────────────────────────────────┘
```
