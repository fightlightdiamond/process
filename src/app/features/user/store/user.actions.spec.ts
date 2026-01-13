import * as fc from "fast-check";
import {
  UserActionTypes,
  loadUsers,
  loadUsersSuccess,
  loadUsersFailure,
  addUser,
  addUserSuccess,
  addUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
  deleteUser,
  deleteUserSuccess,
  deleteUserFailure,
} from "./user.actions";
import { User } from "../models/user.model";

describe("User Actions", () => {
  it("should create loadUsers action", () => {
    const action = loadUsers();
    expect(action.type).toBe(UserActionTypes.LOAD_USERS);
  });

  it("should create loadUsersSuccess action with payload", () => {
    const users: User[] = [
      { id: "1", name: "John", email: "john@example.com" },
    ];
    const action = loadUsersSuccess(users);
    expect(action.type).toBe(UserActionTypes.LOAD_USERS_SUCCESS);
    expect(action.payload).toEqual(users);
  });

  it("should create loadUsersFailure action with error", () => {
    const error = "Failed to load";
    const action = loadUsersFailure(error);
    expect(action.type).toBe(UserActionTypes.LOAD_USERS_FAILURE);
    expect(action.payload).toBe(error);
  });

  it("should create addUser action with payload", () => {
    const userData = { name: "Jane", email: "jane@example.com" };
    const action = addUser(userData);
    expect(action.type).toBe(UserActionTypes.ADD_USER);
    expect(action.payload).toEqual(userData);
  });

  it("should create addUserSuccess action", () => {
    const user: User = { id: "1", name: "Jane", email: "jane@example.com" };
    const action = addUserSuccess(user);
    expect(action.type).toBe(UserActionTypes.ADD_USER_SUCCESS);
    expect(action.payload).toEqual(user);
  });

  it("should create addUserFailure action", () => {
    const error = "Failed to add user";
    const action = addUserFailure(error);
    expect(action.type).toBe(UserActionTypes.ADD_USER_FAILURE);
    expect(action.payload).toBe(error);
  });

  it("should create updateUser action", () => {
    const payload = { id: "1", updates: { name: "Updated Name" } };
    const action = updateUser(payload);
    expect(action.type).toBe(UserActionTypes.UPDATE_USER);
    expect(action.payload).toEqual(payload);
  });

  it("should create updateUserSuccess action", () => {
    const user: User = { id: "1", name: "Updated", email: "up@example.com" };
    const action = updateUserSuccess(user);
    expect(action.type).toBe(UserActionTypes.UPDATE_USER_SUCCESS);
    expect(action.payload).toEqual(user);
  });

  it("should create updateUserFailure action", () => {
    const error = "Failed to update";
    const action = updateUserFailure(error);
    expect(action.type).toBe(UserActionTypes.UPDATE_USER_FAILURE);
    expect(action.payload).toBe(error);
  });

  it("should create deleteUser action", () => {
    const userId = "1";
    const action = deleteUser(userId);
    expect(action.type).toBe(UserActionTypes.DELETE_USER);
    expect(action.payload).toBe(userId);
  });

  it("should create deleteUserSuccess action", () => {
    const userId = "1";
    const action = deleteUserSuccess(userId);
    expect(action.type).toBe(UserActionTypes.DELETE_USER_SUCCESS);
    expect(action.payload).toBe(userId);
  });

  it("should create deleteUserFailure action", () => {
    const error = "Failed to delete";
    const action = deleteUserFailure(error);
    expect(action.type).toBe(UserActionTypes.DELETE_USER_FAILURE);
    expect(action.payload).toBe(error);
  });

  it("Property: Action creators return correct types", () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1 }),
          email: fc.string({ minLength: 3 }),
          avatar: fc.option(fc.string(), { nil: undefined }),
        }),
        fc.string({ minLength: 1 }),
        (user: User, error: string) => {
          expect(loadUsers().type).toBe(UserActionTypes.LOAD_USERS);
          expect(loadUsersSuccess([user]).type).toBe(
            UserActionTypes.LOAD_USERS_SUCCESS
          );
          expect(loadUsersFailure(error).type).toBe(
            UserActionTypes.LOAD_USERS_FAILURE
          );
          expect(addUser(user).type).toBe(UserActionTypes.ADD_USER);
          expect(addUserSuccess(user).type).toBe(
            UserActionTypes.ADD_USER_SUCCESS
          );
          expect(deleteUser(user.id).type).toBe(UserActionTypes.DELETE_USER);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
