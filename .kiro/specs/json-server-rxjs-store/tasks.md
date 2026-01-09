# Implementation Plan: JSON Server RxJS Store

## Overview

Triển khai hệ thống Todo với json-server API và RxJS store theo pattern NgRx-like. Implementation sẽ theo thứ tự: Setup → Models → Actions → Reducer → API Service → Effects → Store → Facade → Component Integration.

## Tasks

- [x] 1. Setup JSON Server và cấu hình project

  - [x] 1.1 Cài đặt json-server và tạo db.json
    - Cài đặt `json-server` package
    - Tạo file `db.json` với initial todos data
    - Thêm script `"api": "json-server --watch db.json --port 3000"` vào package.json
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 1.2 Cấu hình Angular HttpClient và ReactiveFormsModule
    - Import `provideHttpClient` trong app.config.ts
    - Import `ReactiveFormsModule` cho component
    - _Requirements: 1.4, 8.1_

- [x] 2. Tạo Models và Interfaces

  - [x] 2.1 Cập nhật todo.model.ts với TodoState interface
    - Thêm `TodoState` interface với todos, loading, error
    - Thêm `Action` interface với type và payload
    - _Requirements: 3.1_

- [x] 3. Implement Todo Actions

  - [x] 3.1 Tạo file todo.actions.ts
    - Định nghĩa `TodoActionTypes` object với tất cả action type constants
    - Tạo action creator functions cho mỗi action type
    - Export tất cả action types và creators
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 3.2 Write property test cho action creators
    - **Property 1: Action creators return correct structure**
    - **Validates: Requirements 2.3**

- [x] 4. Implement Todo Reducer

  - [x] 4.1 Tạo file todo.reducer.ts
    - Định nghĩa `initialState` với todos=[], loading=false, error=null
    - Implement `todoReducer` function xử lý tất cả action types
    - Handle LOAD, ADD, UPDATE, DELETE và các SUCCESS/FAILURE variants
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  - [x] 4.2 Write property tests cho reducer
    - **Property 2: Reducer is a pure function**
    - **Property 3: Reducer handles CRUD operations correctly**
    - **Property 4: Reducer manages loading and error states**
    - **Validates: Requirements 3.1, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

- [x] 5. Implement Todo API Service

  - [x] 5.1 Tạo file todo-api.service.ts
    - Inject HttpClient
    - Implement getTodos(), addTodo(), updateTodo(), deleteTodo() methods
    - Sử dụng configurable baseUrl
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [x] 5.2 Write property test cho API service
    - **Property 6: API Service returns Observables**
    - **Validates: Requirements 7.3**

- [x] 6. Implement Todo Effects

  - [x] 6.1 Tạo file todo.effects.ts
    - Inject actions$ Subject, TodoApiService, và store reference
    - Implement effect streams cho LOAD_TODOS, ADD_TODO, UPDATE_TODO, DELETE_TODO
    - Handle success và error cases với appropriate action dispatching
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [x] 6.2 Write property test cho effects
    - **Property 5: Effects dispatch correct actions on API response**
    - **Validates: Requirements 4.6**

- [x] 7. Implement Todo Store

  - [x] 7.1 Tạo file todo.store.ts
    - Tạo BehaviorSubject cho state
    - Tạo Subject cho actions
    - Wire reducer vào action stream
    - Initialize effects
    - Expose selectors: todos$, loading$, error$
    - Implement dispatch() method
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 8. Implement Todo Facade

  - [x] 8.1 Tạo file todo.facade.ts
    - Inject TodoStore
    - Expose todos$, loading$, error$ từ store
    - Implement loadTodos(), addTodo(), updateTodo(), toggleTodo(), deleteTodo()
    - Call loadTodos() trong constructor
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9. Checkpoint - Verify store layer

  - Ensure tất cả store files compile without errors
  - Verify action → reducer → state flow hoạt động
  - Ask user nếu có questions

- [x] 10. Update Component với Reactive Forms và Facade

  - [x] 10.1 Cập nhật TodoComponent với Reactive Form
    - Tạo FormGroup với title FormControl
    - Thêm Validators.required và whitespace validation
    - Implement onSubmit() method
    - Handle edit mode với editingTodo state
    - _Requirements: 8.2, 8.3, 8.4, 8.5, 8.6_
  - [x] 10.2 Integrate Facade vào Component
    - Inject TodoFacade thay vì TodoService
    - Subscribe to todos$, loading$, error$
    - Call facade methods cho CRUD operations
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  - [x] 10.3 Update template với loading và error states
    - Hiển thị loading indicator khi loading$ = true
    - Hiển thị error message khi error$ có value
    - Update form template cho reactive form
    - _Requirements: 9.6, 9.7_
  - [x] 10.4 Write property tests cho form và component
    - **Property 7: Form validation rejects empty/whitespace titles**
    - **Property 8: Form populates correctly when editing**
    - **Property 9: Form resets after successful submission**
    - **Property 10: Component displays loading state**
    - **Property 11: Component displays error state**
    - **Validates: Requirements 8.3, 8.5, 8.6, 9.6, 9.7**

- [x] 11. Final Checkpoint
  - Ensure all tests pass
  - Verify full CRUD flow với json-server
  - Ask user nếu có questions

## Notes

- Mỗi task reference specific requirements để traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples và edge cases
