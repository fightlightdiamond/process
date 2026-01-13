import { TestBed } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";
import { take } from "rxjs/operators";
import { UserFacade } from "./user.facade";
import { UserStore } from "./user.store";
import { User } from "../models/user.model";

describe("User Facade", () => {
  let facade: UserFacade;
  let mockStore: jasmine.SpyObj<UserStore>;
  let dispatchedActions: any[] = [];
  let usersSubject: BehaviorSubject<User[]>;
  let loadingSubject: BehaviorSubject<boolean>;
  let errorSubject: BehaviorSubject<string | null>;

  const mockUsers: User[] = [
    { id: "1", name: "John", email: "john@ex.com" },
    { id: "2", name: "Jane", email: "jane@ex.com" },
  ];

  beforeEach(() => {
    dispatchedActions = [];
    usersSubject = new BehaviorSubject<User[]>(mockUsers);
    loadingSubject = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<string | null>(null);

    mockStore = jasmine.createSpyObj("UserStore", ["dispatch"], {
      users$: usersSubject.asObservable(),
      loading$: loadingSubject.asObservable(),
      error$: errorSubject.asObservable(),
    });

    mockStore.dispatch.and.callFake((action) => {
      dispatchedActions.push(action);
    });

    TestBed.configureTestingModule({
      providers: [UserFacade, { provide: UserStore, useValue: mockStore }],
    });

    facade = TestBed.inject(UserFacade);
  });

  it("should be created", () => {
    expect(facade).toBeTruthy();
  });

  it("should expose users$ observable", (done) => {
    facade.users$.pipe(take(1)).subscribe((users) => {
      expect(users).toEqual(mockUsers);
      done();
    });
  });

  it("should expose loading$ observable", (done) => {
    facade.loading$.pipe(take(1)).subscribe((loading) => {
      expect(typeof loading).toBe("boolean");
      done();
    });
  });

  it("should expose error$ observable", (done) => {
    facade.error$.pipe(take(1)).subscribe((error) => {
      expect(error === null || typeof error === "string").toBe(true);
      done();
    });
  });

  it("should dispatch loadUsers action", () => {
    dispatchedActions = [];
    facade.loadUsers();
    expect(dispatchedActions.length).toBeGreaterThan(0);
    expect(dispatchedActions[0].type).toBe("[User] Load Users");
  });

  it("should dispatch addUser action", () => {
    const userData = { name: "Bob", email: "bob@ex.com" };
    facade.addUser(userData);
    expect(dispatchedActions.some((a) => a.type === "[User] Add User")).toBe(
      true
    );
  });

  it("should dispatch updateUser action", () => {
    facade.updateUser("1", { name: "Updated" });
    expect(dispatchedActions.some((a) => a.type === "[User] Update User")).toBe(
      true
    );
  });

  it("should dispatch deleteUser action", () => {
    facade.deleteUser("1");
    expect(dispatchedActions.some((a) => a.type === "[User] Delete User")).toBe(
      true
    );
  });

  it("should call store.dispatch for addUser", () => {
    const userData = { name: "Charlie", email: "charlie@ex.com" };
    facade.addUser(userData);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it("should call store.dispatch for updateUser", () => {
    facade.updateUser("2", { email: "newemail@ex.com" });
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it("should call store.dispatch for deleteUser", () => {
    facade.deleteUser("1");
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it("should handle multiple operations", (done) => {
    facade.addUser({ name: "David", email: "david@ex.com" });
    facade.updateUser("1", { name: "UpdatedJohn" });
    facade.deleteUser("2");

    setTimeout(() => {
      expect(dispatchedActions.length).toBeGreaterThan(2);
      done();
    }, 100);
  });
});
