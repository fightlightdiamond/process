import { TestBed } from "@angular/core/testing";
import { take } from "rxjs/operators";
import { UserStore } from "./user.store";
import { UserEffects } from "./user.effects";
import { User } from "../models/user.model";
import { addUserSuccess } from "./user.actions";

describe("User Store", () => {
  let store: UserStore;
  let mockEffects: jasmine.SpyObj<UserEffects>;

  const mockUser: User = { id: "1", name: "John", email: "john@ex.com" };

  beforeEach(() => {
    mockEffects = jasmine.createSpyObj("UserEffects", ["init"]);

    TestBed.configureTestingModule({
      providers: [UserStore, { provide: UserEffects, useValue: mockEffects }],
    });

    store = TestBed.inject(UserStore);
  });

  it("should be created", () => {
    expect(store).toBeTruthy();
  });

  it("should dispatch action and update state", (done) => {
    const action = addUserSuccess(mockUser);
    store.dispatch(action);

    store.users$.pipe(take(1)).subscribe((users) => {
      expect(users).toContain(mockUser);
      done();
    });
  });

  it("should expose users$ observable", (done) => {
    store.users$.pipe(take(1)).subscribe((users) => {
      expect(Array.isArray(users)).toBe(true);
      done();
    });
  });

  it("should expose loading$ observable", (done) => {
    store.loading$.pipe(take(1)).subscribe((loading) => {
      expect(typeof loading).toBe("boolean");
      done();
    });
  });

  it("should expose error$ observable", (done) => {
    store.error$.pipe(take(1)).subscribe((error) => {
      expect(error === null || typeof error === "string").toBe(true);
      done();
    });
  });

  it("should return current state via getState()", () => {
    const state = store.getState();
    expect(state).toBeTruthy();
    expect(state.users).toBeDefined();
    expect(state.loading).toBeDefined();
    expect(state.error).toBeDefined();
  });

  it("should update state immutably", (done) => {
    const action = addUserSuccess(mockUser);
    const initialState = store.getState();
    store.dispatch(action);

    store.users$.pipe(take(1)).subscribe((users) => {
      const newState = store.getState();
      expect(initialState).not.toBe(newState);
      expect(users.length).toBeGreaterThan(initialState.users.length);
      done();
    });
  });

  it("should handle multiple dispatches", (done) => {
    const user1: User = { id: "1", name: "User1", email: "u1@ex.com" };
    const user2: User = { id: "2", name: "User2", email: "u2@ex.com" };

    store.dispatch(addUserSuccess(user1));
    store.dispatch(addUserSuccess(user2));

    store.users$.pipe(take(1)).subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users).toContain(user1);
      expect(users).toContain(user2);
      done();
    });
  });
});
