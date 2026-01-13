# Requirements Document

## Introduction

Một ứng dụng CRUD Todo toàn diện sử dụng RxJS và Redux pattern để quản lý state trong Angular. Ứng dụng cung cấp reactive state management với API integration, error handling, loading states, và validation logic hoàn chỉnh.

## Glossary

- **Todo_Facade**: Facade pattern service cung cấp simplified API cho components
- **Todo_Store**: Redux-like store sử dụng BehaviorSubject để quản lý state
- **Todo_Reducer**: Pure function xử lý state transitions
- **Todo_Effects**: Side effects handler cho API calls
- **Todo_Actions**: Redux-style action creators
- **Todo_Item**: Đối tượng todo với id (string), title (string), và completed (boolean)
- **Todo_State**: State object chứa todos array, loading boolean, và error string
- **Todo_Container**: Smart component kết nối với store
- **Todo_API_Service**: Service xử lý HTTP requests tới backend

## Requirements

### Requirement 1: Thêm Todo mới

**User Story:** As a user, I want to add new todos, so that I can track tasks I need to complete.

#### Acceptance Criteria

1. WHEN a user enters a todo title and submits the form, THE Todo_Service SHALL create a new Todo_Item with a unique id and add it to the list
2. WHEN a user attempts to add an empty todo, THE Todo_Service SHALL prevent the addition and maintain the current state
3. WHEN a new todo is added, THE Todo_Form SHALL clear the input field

### Requirement 2: Hiển thị danh sách Todos

**User Story:** As a user, I want to see all my todos, so that I can view what tasks I have.

#### Acceptance Criteria

1. WHEN the application loads, THE Todo_List_Component SHALL display all existing todos from the Todo_Service
2. WHEN the todo list changes, THE Todo_List_Component SHALL automatically update to reflect the changes
3. THE Todo_List_Component SHALL display each todo's title and completion status

### Requirement 3: Cập nhật Todo

**User Story:** As a user, I want to update my todos, so that I can modify task details or mark them as complete.

#### Acceptance Criteria

1. WHEN a user clicks on a todo's checkbox, THE Todo_Service SHALL toggle the completed status of that Todo_Item
2. WHEN a user edits a todo's title, THE Todo_Service SHALL update the title of that Todo_Item
3. WHEN a todo is updated, THE Todo_List_Component SHALL reflect the changes immediately

### Requirement 4: Xóa Todo

**User Story:** As a user, I want to delete todos, so that I can remove tasks I no longer need.

#### Acceptance Criteria

1. WHEN a user clicks the delete button on a todo, THE Todo_Service SHALL remove that Todo_Item from the list
2. WHEN a todo is deleted, THE Todo_List_Component SHALL update to no longer show the deleted item

### Requirement 5: Reactive State Management

**User Story:** As a developer, I want todos managed reactively with RxJS, so that the UI stays in sync with the data.

#### Acceptance Criteria

1. THE Todo_Service SHALL use BehaviorSubject to store and emit the current list of todos
2. THE Todo_Service SHALL expose an Observable for components to subscribe to todo changes
3. WHEN any CRUD operation is performed, THE Todo_Service SHALL emit the updated todo list to all subscribers
