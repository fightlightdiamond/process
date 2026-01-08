# Implementation Plan: RxJS Todo CRUD

## Overview

Triển khai ứng dụng CRUD Todo với Angular và RxJS, sử dụng BehaviorSubject để quản lý state reactive. UI sử dụng PrimeNG components.

## Tasks

- [x] 1. Setup PrimeNG

  - [x] 1.1 Cài đặt PrimeNG và dependencies
    - Run `npm install primeng primeicons`
    - Import PrimeNG styles trong angular.json
  - [x] 1.2 Configure PrimeNG trong app
    - Import providePrimeNG trong app.config.ts
    - Add primeicons CSS

- [x] 2. Tạo Todo interface và TodoService

  - [x] 2.1 Tạo Todo interface với id, title, completed
    - Tạo file `src/app/models/todo.model.ts`
    - _Requirements: 2.3_
  - [x] 2.2 Tạo TodoService với BehaviorSubject
    - Tạo file `src/app/services/todo.service.ts`
    - Implement BehaviorSubject và todos$ Observable
    - _Requirements: 5.1, 5.2_
  - [x] 2.3 Implement addTodo method với validation
    - Reject empty/whitespace titles
    - Generate unique id
    - _Requirements: 1.1, 1.2_
  - [x] 2.4 Write property test cho addTodo
    - **Property 1: Adding a valid todo grows the list**
    - **Property 2: Empty/whitespace todos are rejected**
    - **Validates: Requirements 1.1, 1.2**
  - [x] 2.5 Implement toggleTodo method
    - Toggle completed status của todo theo id
    - _Requirements: 3.1_
  - [x] 2.6 Write property test cho toggleTodo
    - **Property 3: Toggle flips completed status**
    - **Validates: Requirements 3.1**
  - [x] 2.7 Implement updateTodo method
    - Update title của todo theo id
    - _Requirements: 3.2_
  - [x] 2.8 Write property test cho updateTodo
    - **Property 4: Update changes only the specified todo's title**
    - **Validates: Requirements 3.2**
  - [x] 2.9 Implement deleteTodo method
    - Remove todo theo id
    - _Requirements: 4.1_
  - [x] 2.10 Write property test cho deleteTodo
    - **Property 5: Delete removes the specified todo**
    - **Validates: Requirements 4.1**

- [x] 3. Checkpoint - Ensure TodoService tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Tạo TodoComponent với PrimeNG UI

  - [x] 4.1 Tạo TodoComponent
    - Tạo component với form và list
    - Subscribe to todos$ từ TodoService
    - _Requirements: 2.1, 2.2_
  - [x] 4.2 Implement todo form với PrimeNG
    - Sử dụng InputText cho title input
    - Sử dụng Button cho submit
    - Clear input sau khi add
    - _Requirements: 1.3_
  - [x] 4.3 Implement todo list display với PrimeNG
    - Sử dụng Card làm container
    - Sử dụng Checkbox cho completed status
    - Sử dụng Button cho delete
    - _Requirements: 2.3, 3.1, 4.1_
  - [x] 4.4 Implement inline edit cho todo title
    - Double-click để edit với InputText
    - Enter để save
    - _Requirements: 3.2_
  - [x] 4.5 Write unit tests cho TodoComponent
    - Test rendering
    - Test user interactions
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 5. Tích hợp và styling

  - [x] 5.1 Update AppComponent để sử dụng TodoComponent
    - Import và sử dụng TodoComponent
    - _Requirements: 2.1_
  - [x] 5.2 Add custom CSS styling
    - Style bổ sung cho PrimeNG components
    - Visual feedback cho completed todos

- [x] 6. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Sử dụng PrimeNG components: InputText, Button, Checkbox, Card
- Sử dụng fast-check cho property-based testing
- Mỗi property test cần minimum 100 iterations
