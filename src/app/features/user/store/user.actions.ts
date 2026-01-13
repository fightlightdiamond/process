import { Action, User } from "../models/user.model";

export const UserActionTypes = {
  LOAD_USERS: "[User] Load Users",
  LOAD_USERS_SUCCESS: "[User] Load Users Success",
  LOAD_USERS_FAILURE: "[User] Load Users Failure",
  ADD_USER: "[User] Add User",
  ADD_USER_SUCCESS: "[User] Add User Success",
  ADD_USER_FAILURE: "[User] Add User Failure",
  UPDATE_USER: "[User] Update User",
  UPDATE_USER_SUCCESS: "[User] Update User Success",
  UPDATE_USER_FAILURE: "[User] Update User Failure",
  DELETE_USER: "[User] Delete User",
  DELETE_USER_SUCCESS: "[User] Delete User Success",
  DELETE_USER_FAILURE: "[User] Delete User Failure",
} as const;

// Action Creators
export function loadUsers(): Action {
  return { type: UserActionTypes.LOAD_USERS };
}
export function loadUsersSuccess(users: User[]): Action<User[]> {
  return { type: UserActionTypes.LOAD_USERS_SUCCESS, payload: users };
}
export function loadUsersFailure(error: string): Action<string> {
  return { type: UserActionTypes.LOAD_USERS_FAILURE, payload: error };
}
export function addUser(data: Omit<User, "id">): Action<Omit<User, "id">> {
  return { type: UserActionTypes.ADD_USER, payload: data };
}
export function addUserSuccess(user: User): Action<User> {
  return { type: UserActionTypes.ADD_USER_SUCCESS, payload: user };
}
export function addUserFailure(error: string): Action<string> {
  return { type: UserActionTypes.ADD_USER_FAILURE, payload: error };
}
export function updateUser(payload: {
  id: string;
  updates: Partial<User>;
}): Action<{ id: string; updates: Partial<User> }> {
  return { type: UserActionTypes.UPDATE_USER, payload };
}
export function updateUserSuccess(user: User): Action<User> {
  return { type: UserActionTypes.UPDATE_USER_SUCCESS, payload: user };
}
export function updateUserFailure(error: string): Action<string> {
  return { type: UserActionTypes.UPDATE_USER_FAILURE, payload: error };
}
export function deleteUser(id: string): Action<string> {
  return { type: UserActionTypes.DELETE_USER, payload: id };
}
export function deleteUserSuccess(id: string): Action<string> {
  return { type: UserActionTypes.DELETE_USER_SUCCESS, payload: id };
}
export function deleteUserFailure(error: string): Action<string> {
  return { type: UserActionTypes.DELETE_USER_FAILURE, payload: error };
}
