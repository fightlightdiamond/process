import * as fc from "fast-check";
import { userReducer, initialState } from "./user.reducer";
import { UserActionTypes } from "./user.actions";
import { UserState, User, Action } from "../models/user.model";

const userArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1 }),
  email: fc.string({ minLength: 3 }),
  avatar: fc.option(fc.string(), { nil: undefined }),
});

const userStateArbitrary = fc.record({
  users: fc.array(userArbitrary, { minLength: 0, maxLength: 10 }),
  loading: fc.boolean(),
  error: fc.option(fc.string({ minLength: 1 }), { nil: null }),
});

describe("User Reducer", () => {
  it("should return initial state", () => {
    const action: Action = { type: "UNKNOWN" };
    const result = userReducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  it("should set loading to true on LOAD_USERS", () => {
    const action: Action = { type: UserActionTypes.LOAD_USERS };
    const result = userReducer(initialState, action);
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should update users on LOAD_USERS_SUCCESS", () => {
    const users: User[] = [
      { id: "1", name: "John", email: "john@example.com" },
    ];
    const action: Action<User[]> = {
      type: UserActionTypes.LOAD_USERS_SUCCESS,
      payload: users,
    };
    const result = userReducer(initialState, action);
    expect(result.users).toEqual(users);
    expect(result.loading).toBe(false);
  });

  it("should set error on LOAD_USERS_FAILURE", () => {
    const error = "Load failed";
    const action: Action<string> = {
      type: UserActionTypes.LOAD_USERS_FAILURE,
      payload: error,
    };
    const result = userReducer(initialState, action);
    expect(result.error).toBe(error);
    expect(result.loading).toBe(false);
  });

  it("should add user on ADD_USER_SUCCESS", () => {
    const newUser: User = { id: "1", name: "Jane", email: "jane@example.com" };
    const action: Action<User> = {
      type: UserActionTypes.ADD_USER_SUCCESS,
      payload: newUser,
    };
    const result = userReducer(initialState, action);
    expect(result.users).toContain(newUser);
    expect(result.users.length).toBe(1);
  });

  it("should update user on UPDATE_USER_SUCCESS", () => {
    const existingUser: User = { id: "1", name: "John", email: "john@ex.com" };
    const updatedUser: User = {
      id: "1",
      name: "Updated",
      email: "john@ex.com",
    };
    const state: UserState = {
      users: [existingUser],
      loading: false,
      error: null,
    };
    const action: Action<User> = {
      type: UserActionTypes.UPDATE_USER_SUCCESS,
      payload: updatedUser,
    };
    const result = userReducer(state, action);
    expect(result.users[0]).toEqual(updatedUser);
  });

  it("should delete user on DELETE_USER_SUCCESS", () => {
    const user: User = { id: "1", name: "John", email: "john@ex.com" };
    const state: UserState = { users: [user], loading: false, error: null };
    const action: Action<string> = {
      type: UserActionTypes.DELETE_USER_SUCCESS,
      payload: "1",
    };
    const result = userReducer(state, action);
    expect(result.users.length).toBe(0);
  });

  it("Property: Reducer is pure and immutable", () => {
    fc.assert(
      fc.property(userStateArbitrary, userArbitrary, (state, user) => {
        const action: Action = {
          type: UserActionTypes.ADD_USER_SUCCESS,
          payload: user,
        };
        const result1 = userReducer(state, action);
        const result2 = userReducer(state, action);
        expect(JSON.stringify(result1)).toBe(JSON.stringify(result2));
        expect(state as any).not.toBe(result1);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it("Property: Adding user increases list length", () => {
    fc.assert(
      fc.property(userStateArbitrary, userArbitrary, (state, user) => {
        const action: Action = {
          type: UserActionTypes.ADD_USER_SUCCESS,
          payload: user,
        };
        const result = userReducer(state, action);
        expect(result.users.length).toBe(state.users.length + 1);
        expect(result.users[result.users.length - 1]).toEqual(user);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it("Property: Deleting user decreases list length", () => {
    fc.assert(
      fc.property(fc.array(userArbitrary, { minLength: 1 }), (users) => {
        const state: UserState = { users, loading: false, error: null };
        const userToDelete = users[0];
        const action: Action<string> = {
          type: UserActionTypes.DELETE_USER_SUCCESS,
          payload: userToDelete.id,
        };
        const result = userReducer(state, action);
        expect(result.users.length).toBe(state.users.length - 1);
        expect(
          result.users.find((u) => u.id === userToDelete.id)
        ).toBeUndefined();
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
