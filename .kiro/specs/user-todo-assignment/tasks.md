# Implementation Plan: User Management & Todo Assignment

## Overview

Triển khai chức năng quản lý user và assign user vào todo, mở rộng từ ứng dụng Todo CRUD hiện có. Sử dụng RxJS BehaviorSubject và PrimeNG components.

## Tasks

- [ ] 1. Tạo User Model và UserService

  - [ ] 1.1 Tạo User interface

    - Tạo file `src/app/models/user.model.ts`
    - Định nghĩa id, name, email, avatar
    - _Requirements: 1.1, 1.2_

  - [ ] 1.2 Tạo UserService với BehaviorSubject

    - Tạo file `src/app/services/user.service.ts`
    - Implement BehaviorSubject và items$ Observable
    - _Requirements: 6.1, 6.2_

  - [ ] 1.3 Implement add method với validation

    - Validate name non-empty, email format
    - Generate unique id
    - _Requirements: 1.3_

  - [ ] 1.4 Write property test cho add

    - **Property 1: Adding a valid user grows the list**
    - **Validates: Requirements 1.3**

  - [ ] 1.5 Implement update method

    - Update user properties theo id
    - _Requirements: 1.4_

  - [ ] 1.6 Write property test cho update

    - **Property 2: Update changes only the specified user**
    - **Validates: Requirements 1.4**

  - [ ] 1.7 Implement delete method

    - Remove user và unassign từ todos
    - _Requirements: 1.5_

  - [ ] 1.8 Write property test cho delete
    - **Property 3: Delete removes user and unassigns from todos**
    - **Validates: Requirements 1.5**

- [ ] 2. Mở rộng Todo Model và TodoService

  - [ ] 2.1 Update Todo interface

    - Thêm assigneeId?: string vào Todo interface
    - _Requirements: 3.3_

  - [ ] 2.2 Implement assign method trong TodoService

    - Update todo với userId
    - _Requirements: 3.3_

  - [ ] 2.3 Write property test cho assign

    - **Property 4: Assign updates todo with user id**
    - **Validates: Requirements 3.3, 3.5**

  - [ ] 2.4 Implement unassign method

    - Set assigneeId = undefined
    - _Requirements: 4.2_

  - [ ] 2.5 Write property test cho unassign

    - **Property 5: Unassign removes assignee from todo**
    - **Validates: Requirements 4.2**

  - [ ] 2.6 Implement getByAssignee method

    - Filter todos theo assigneeId
    - _Requirements: 5.2, 5.4_

  - [ ] 2.7 Write property test cho filter

    - **Property 6: Filter by assignee returns correct todos**
    - **Validates: Requirements 5.2, 5.4**

  - [ ] 2.8 Implement unassignAll method
    - Unassign user từ tất cả todos
    - _Requirements: 1.5_

- [ ] 3. Checkpoint - Ensure Service tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Tạo UserComponent với PrimeNG UI

  - [ ] 4.1 Tạo UserComponent

    - Tạo component với form và list
    - Subscribe to items$ từ UserService
    - _Requirements: 2.1, 2.2_

  - [ ] 4.2 Implement user form với PrimeNG

    - Sử dụng Dialog cho add/edit form
    - InputText cho name, email
    - FileUpload hoặc InputText cho avatar URL
    - _Requirements: 1.3, 1.4_

  - [ ] 4.3 Implement user list display

    - Sử dụng Card hoặc DataTable
    - Avatar component cho hình ảnh
    - Button cho edit, delete
    - _Requirements: 2.2, 2.3_

  - [ ] 4.4 Write unit tests cho UserComponent
    - Test rendering
    - Test user interactions
    - _Requirements: 2.1, 2.2, 2.3_

- [ ] 5. Tạo UserSelectorComponent

  - [ ] 5.1 Tạo UserSelectorComponent

    - Dropdown để chọn user
    - Input: todoId, currentAssigneeId
    - Output: assigneeChanged event
    - _Requirements: 3.1, 3.2_

  - [ ] 5.2 Implement dropdown với PrimeNG

    - Sử dụng Dropdown component
    - Hiển thị avatar + name trong options
    - Option để unassign (clear)
    - _Requirements: 3.2, 4.1_

  - [ ] 5.3 Write unit tests cho UserSelectorComponent
    - Test dropdown rendering
    - Test selection events
    - _Requirements: 3.1, 3.2_

- [ ] 6. Update TodoComponent

  - [ ] 6.1 Tích hợp UserSelectorComponent vào TodoItem

    - Hiển thị UserSelector trong mỗi todo item
    - Handle assigneeChanged event
    - _Requirements: 3.1, 3.3_

  - [ ] 6.2 Hiển thị assignee info trên todo item

    - Sử dụng Chip hoặc Avatar + name
    - Hiển thị khi có assignee
    - _Requirements: 3.4_

  - [ ] 6.3 Implement FilterBar component

    - Dropdown để filter theo assignee
    - Options: All, Unassigned, [list of users]
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 6.4 Write unit tests cho updated TodoComponent
    - Test assignment UI
    - Test filter functionality
    - _Requirements: 3.4, 5.1_

- [ ] 7. Tích hợp và Navigation

  - [ ] 7.1 Update AppComponent

    - Thêm navigation giữa Todos và Users
    - Sử dụng TabView hoặc routing
    - _Requirements: 2.1_

  - [ ] 7.2 Add custom CSS styling
    - Style cho user components
    - Style cho assignment UI
    - Visual feedback cho assigned todos

- [ ] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Sử dụng PrimeNG components: Dropdown, Avatar, Chip, Dialog, DataTable
- Sử dụng fast-check cho property-based testing
- Mỗi property test cần minimum 100 iterations
- UserService cần inject TodoService để unassign khi delete user
