# Requirements Document

## Introduction

Mở rộng ứng dụng Todo để sử dụng json-server làm REST API backend và triển khai RxJS store theo pattern NgRx-like với cấu trúc action, reducer, effect trong 3 file riêng biệt. Sử dụng Reactive Forms cho form handling và Facade pattern để đơn giản hóa việc tương tác giữa component và store.

## Glossary

- **JSON_Server**: Mock REST API server sử dụng json-server package
- **Todo_Store**: RxJS-based state management store cho todos
- **Todo_Actions**: File chứa các action creators cho todo operations
- **Todo_Reducer**: File chứa reducer function xử lý state changes
- **Todo_Effects**: File chứa side effects (API calls) cho todo operations
- **Todo_Facade**: Lớp trung gian gom logic store và expose API đơn giản cho components
- **Todo_API_Service**: Service gọi REST API từ json-server
- **Todo_Form**: Reactive form để thêm/sửa todo
- **Todo_Item**: Đối tượng todo với id, title, completed status

## Requirements

### Requirement 1: JSON Server Setup

**User Story:** As a developer, I want to use json-server as a REST API backend, so that I can persist todo data and simulate real API interactions.

#### Acceptance Criteria

1. THE JSON_Server SHALL provide REST endpoints at `/todos` for CRUD operations
2. WHEN the server starts, THE JSON_Server SHALL load initial data from `db.json` file
3. THE JSON_Server SHALL support GET, POST, PUT, PATCH, DELETE methods on `/todos` endpoint
4. THE Todo_API_Service SHALL communicate with JSON_Server using HttpClient

### Requirement 2: Todo Actions

**User Story:** As a developer, I want separate action definitions, so that I can clearly define all possible state changes.

#### Acceptance Criteria

1. THE Todo_Actions file SHALL define action types as constants (LOAD_TODOS, LOAD_TODOS_SUCCESS, LOAD_TODOS_FAILURE, ADD_TODO, ADD_TODO_SUCCESS, ADD_TODO_FAILURE, UPDATE_TODO, UPDATE_TODO_SUCCESS, UPDATE_TODO_FAILURE, DELETE_TODO, DELETE_TODO_SUCCESS, DELETE_TODO_FAILURE)
2. THE Todo_Actions file SHALL export action creator functions for each action type
3. WHEN an action is created, THE action creator SHALL return an object with type and optional payload

### Requirement 3: Todo Reducer

**User Story:** As a developer, I want a pure reducer function, so that state changes are predictable and testable.

#### Acceptance Criteria

1. THE Todo_Reducer SHALL be a pure function that takes current state and action, returns new state
2. THE Todo_Reducer SHALL handle all action types defined in Todo_Actions
3. WHEN LOAD_TODOS_SUCCESS action is dispatched, THE Todo_Reducer SHALL replace todos array with payload
4. WHEN ADD_TODO_SUCCESS action is dispatched, THE Todo_Reducer SHALL append new todo to the list
5. WHEN UPDATE_TODO_SUCCESS action is dispatched, THE Todo_Reducer SHALL update the matching todo
6. WHEN DELETE_TODO_SUCCESS action is dispatched, THE Todo_Reducer SHALL remove the matching todo
7. WHEN any FAILURE action is dispatched, THE Todo_Reducer SHALL set error state
8. THE Todo_Reducer SHALL maintain loading state during async operations

### Requirement 4: Todo Effects

**User Story:** As a developer, I want effects to handle side effects, so that API calls are separated from state management.

#### Acceptance Criteria

1. THE Todo_Effects file SHALL handle side effects using RxJS operators
2. WHEN LOAD_TODOS action is dispatched, THE Todo_Effects SHALL call API and dispatch LOAD_TODOS_SUCCESS or LOAD_TODOS_FAILURE
3. WHEN ADD_TODO action is dispatched, THE Todo_Effects SHALL POST to API and dispatch ADD_TODO_SUCCESS or ADD_TODO_FAILURE
4. WHEN UPDATE_TODO action is dispatched, THE Todo_Effects SHALL PUT/PATCH to API and dispatch UPDATE_TODO_SUCCESS or UPDATE_TODO_FAILURE
5. WHEN DELETE_TODO action is dispatched, THE Todo_Effects SHALL DELETE from API and dispatch DELETE_TODO_SUCCESS or DELETE_TODO_FAILURE
6. THE Todo_Effects SHALL handle API errors and dispatch appropriate failure actions

### Requirement 5: Todo Store Integration

**User Story:** As a developer, I want a unified store service, so that state management is centralized.

#### Acceptance Criteria

1. THE Todo_Store SHALL combine actions, reducer, and effects into a cohesive service
2. THE Todo_Store SHALL expose state as Observable
3. THE Todo_Store SHALL provide dispatch method to trigger actions
4. THE Todo_Store SHALL expose selectors for todos, loading, and error states

### Requirement 6: Todo Facade

**User Story:** As a developer, I want a facade layer, so that components have a simple API to interact with the store without knowing internal details.

#### Acceptance Criteria

1. THE Todo_Facade SHALL encapsulate all store interactions
2. THE Todo_Facade SHALL expose Observables: todos$, loading$, error$
3. THE Todo_Facade SHALL provide methods: loadTodos(), addTodo(), updateTodo(), toggleTodo(), deleteTodo()
4. WHEN the application initializes, THE Todo_Facade SHALL trigger loading todos from API
5. THE Todo_Facade SHALL be the only interface components use to interact with state

### Requirement 7: API Service

**User Story:** As a developer, I want a dedicated API service, so that HTTP calls are centralized and reusable.

#### Acceptance Criteria

1. THE Todo_API_Service SHALL use Angular HttpClient for API calls
2. THE Todo_API_Service SHALL provide methods: getTodos(), addTodo(), updateTodo(), deleteTodo()
3. THE Todo_API_Service SHALL return Observables from all methods
4. THE Todo_API_Service SHALL use configurable base URL for json-server endpoint

### Requirement 8: Reactive Forms

**User Story:** As a developer, I want to use Reactive Forms, so that form handling is more powerful and testable.

#### Acceptance Criteria

1. THE Todo_Form SHALL use Angular ReactiveFormsModule
2. THE Todo_Form SHALL have FormControl for title input with validation
3. WHEN the title is empty or whitespace, THE Todo_Form SHALL show validation error
4. WHEN the form is valid and submitted, THE Todo_Form SHALL call facade to add todo
5. WHEN a todo is being edited, THE Todo_Form SHALL populate with existing todo data
6. THE Todo_Form SHALL reset after successful submission

### Requirement 9: Component Integration

**User Story:** As a user, I want the UI to work seamlessly with the new architecture, so that I can manage todos with real persistence.

#### Acceptance Criteria

1. WHEN the component loads, THE Todo_Facade SHALL fetch todos from API and display them
2. WHEN a user submits the reactive form, THE component SHALL call facade.addTodo() and show loading state
3. WHEN a user updates a todo, THE component SHALL call facade.updateTodo()
4. WHEN a user toggles a todo, THE component SHALL call facade.toggleTodo()
5. WHEN a user deletes a todo, THE component SHALL call facade.deleteTodo()
6. WHEN an API error occurs, THE component SHALL display error message to user
7. WHILE an API call is in progress, THE component SHALL show loading indicator
