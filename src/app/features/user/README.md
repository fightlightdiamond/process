# User Management Feature

Tính năng quản lý user cơ bản với các chức năng CRUD:
- **Xem danh sách** user (Read)
- **Thêm user mới** (Create)
- **Sửa thông tin user** (Update)
- **Xóa user** (Delete)

## Cấu trúc thư mục

```
src/app/features/user/
├── components/
│   ├── user-container/     # Main container component
│   ├── user-list/          # List display component
│   ├── user-form/          # Form for create/edit
│   └── index.ts
├── models/
│   ├── user.model.ts       # Domain models
│   └── index.ts
├── services/
│   ├── user-api.service.ts # HTTP API calls
│   └── index.ts
├── store/
│   ├── user.actions.ts     # Redux actions
│   ├── user.reducer.ts     # State reducer
│   ├── user.effects.ts     # Side effects
│   ├── user.store.ts       # Store management
│   ├── user.facade.ts      # Facade API
│   └── index.ts
├── index.ts
└── user.routes.ts
```

## Cách sử dụng

### Routing
App router tự động load user routes khi vào `/users`:

```typescript
{
  path: "users",
  loadChildren: () => 
    import("./features/user/user.routes").then((m) => m.USER_ROUTES),
}
```

### Component chính
`UserContainerComponent` là entry point quản lý toàn bộ logic CRUD:

```typescript
import { UserContainerComponent } from './features/user/components';
```

### State Management
Sử dụng `UserFacade` để giao tiếp với store:

```typescript
constructor(private userFacade: UserFacade) {}

// Load users
this.userFacade.loadUsers();

// Add user
this.userFacade.addUser({ name: 'John', email: 'john@example.com' });

// Update user
this.userFacade.updateUser(userId, { name: 'Jane' });

// Delete user
this.userFacade.deleteUser(userId);

// Subscribe to state
this.userFacade.users$.subscribe(users => {});
this.userFacade.loading$.subscribe(loading => {});
this.userFacade.error$.subscribe(error => {});
```

## Components

### UserContainerComponent
Container component quản lý:
- Hiển thị list users hoặc form
- Xử lý events từ list (edit, delete)
- Xử lý form submit (create, update)

### UserListComponent
Hiển thị danh sách users trong table với:
- Cột: ID, Tên, Email, Hành động
- Nút Sửa (edit)
- Nút Xóa (delete) với confirm dialog

### UserFormComponent
Form tạo/sửa user với:
- Validate input (required, email format)
- 2 modes: create | edit
- Nút Lưu, Hủy

## Testing

Tất cả components có unit tests:

```bash
npm test -- --include="**/user/**/*.spec.ts"
```

- UserListComponent: 4 tests
- UserFormComponent: 8 tests
- UserContainerComponent: 8 tests

## API

Mock API sử dụng JSON Server:
- Base URL: `http://localhost:3000/users`
- Endpoints:
  - `GET /users` - Lấy danh sách users
  - `POST /users` - Tạo user mới
  - `PUT /users/:id` - Cập nhật user
  - `DELETE /users/:id` - Xóa user

## Yêu cầu

- Angular 18+
- RxJS 7+
- PrimeNG 18+
- TypeScript 5+
