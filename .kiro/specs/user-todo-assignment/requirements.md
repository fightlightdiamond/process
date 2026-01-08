# Requirements Document

## Introduction

Mở rộng ứng dụng Todo CRUD hiện có để hỗ trợ quản lý người dùng (User) và cho phép gán (assign) người dùng vào các todo. Chức năng này giúp theo dõi ai chịu trách nhiệm cho từng công việc.

## Glossary

- **User_Service**: Service quản lý state của users sử dụng RxJS BehaviorSubject
- **User**: Một đối tượng người dùng với id, name, email và avatar
- **Todo_Item**: Một đối tượng todo với id, title, completed status và assignee
- **Assignee**: Người dùng được gán cho một todo
- **User_Selector**: Component dropdown để chọn user khi assign

## Requirements

### Requirement 1: Quản lý User

**User Story:** As an admin, I want to manage users, so that I can have a list of people to assign todos to.

#### Acceptance Criteria

1. THE User_Service SHALL store a list of users using BehaviorSubject
2. THE User_Service SHALL expose an Observable for components to subscribe to user changes
3. WHEN a user is added, THE User_Service SHALL create a new User with unique id, name, email and optional avatar
4. WHEN a user is updated, THE User_Service SHALL update the user's information
5. WHEN a user is deleted, THE User_Service SHALL remove the user and unassign them from all todos

### Requirement 2: Hiển thị danh sách Users

**User Story:** As a user, I want to see all users, so that I can know who is available to assign tasks.

#### Acceptance Criteria

1. WHEN the application loads, THE User_List_Component SHALL display all existing users from the User_Service
2. THE User_List_Component SHALL display each user's name, email and avatar
3. WHEN the user list changes, THE User_List_Component SHALL automatically update to reflect the changes

### Requirement 3: Assign User vào Todo

**User Story:** As a user, I want to assign a user to a todo, so that I can track who is responsible for each task.

#### Acceptance Criteria

1. WHEN viewing a todo, THE Todo_Item SHALL display an assign button or dropdown
2. WHEN a user clicks the assign button, THE User_Selector SHALL show a list of available users
3. WHEN a user selects an assignee, THE Todo_Service SHALL update the todo with the selected user's id
4. WHEN a todo has an assignee, THE Todo_Item SHALL display the assignee's name and avatar
5. WHEN a user is assigned to a todo, THE Todo_List_Component SHALL reflect the change immediately

### Requirement 4: Unassign User từ Todo

**User Story:** As a user, I want to unassign a user from a todo, so that I can remove responsibility or reassign to someone else.

#### Acceptance Criteria

1. WHEN a todo has an assignee, THE Todo_Item SHALL display an unassign option
2. WHEN a user clicks unassign, THE Todo_Service SHALL remove the assignee from that todo
3. WHEN a todo is unassigned, THE Todo_Item SHALL show no assignee and display the assign button

### Requirement 5: Filter Todos by Assignee

**User Story:** As a user, I want to filter todos by assignee, so that I can see tasks assigned to a specific person.

#### Acceptance Criteria

1. THE Todo_List_Component SHALL provide a filter dropdown to select a user
2. WHEN a user is selected in the filter, THE Todo_List_Component SHALL display only todos assigned to that user
3. WHEN "All" is selected, THE Todo_List_Component SHALL display all todos regardless of assignee
4. WHEN "Unassigned" is selected, THE Todo_List_Component SHALL display only todos without an assignee

### Requirement 6: Reactive State Management cho Users

**User Story:** As a developer, I want users managed reactively with RxJS, so that the UI stays in sync with the data.

#### Acceptance Criteria

1. THE User_Service SHALL use BehaviorSubject to store and emit the current list of users
2. THE User_Service SHALL expose an Observable for components to subscribe to user changes
3. WHEN any CRUD operation is performed on users, THE User_Service SHALL emit the updated user list to all subscribers
