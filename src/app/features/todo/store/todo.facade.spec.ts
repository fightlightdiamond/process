import { TestBed } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";
import * as fc from "fast-check";

import { TodoFacade } from "./todo.facade";
import { TodoStore } from "./todo.store";
import { Todo, TodoState, Action } from "../models";
import { TodoActionTypes } from "./todo.actions";

describe("TodoFacade", () => {
  let facade: TodoFacade;
  let mockStore: jasmine.SpyObj<TodoStore>;
  let dispatchedActions: Action[];

  // Mock state
  const mockTodos: Todo[] = [
    { id: "1", title: "First Todo", completed: false },
    { id: "2", title: "Second Todo", completed: true },
  ];

  const mockState: TodoState = {
    todos: mockTodos,
    loading: false,
    error: null,
  };

  // BehaviorSubjects for observables
  let todosSubject: BehaviorSubject<Todo[]>;
  let loadingSubject: BehaviorSubject<boolean>;
  let errorSubject: BehaviorSubject<string | null>;

  beforeEach(() => {
    dispatchedActions = [];
    todosSubject = new BehaviorSubject<Todo[]>(mockTodos);
    loadingSubject = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<string | null>(null);

    // Create mock store
    mockStore = jasmine.createSpyObj("TodoStore", ["dispatch", "getState"]);
    mockStore.dispatch.and.callFake((action: Action) => {
      dispatchedActions.push(action);
    });
    mockStore.getState.and.returnValue(mockState);

    // Set up observable properties
    Object.defineProperty(mockStore, "todos$", {
      get: () => todosSubject.asObservable(),
    });
    Object.defineProperty(mockStore, "loading$", {
      get: () => loadingSubject.asObservable(),
    });
    Object.defineProperty(mockStore, "error$", {
      get: () => errorSubject.asObservable(),
    });

    TestBed.configureTestingModule({
      providers: [TodoFacade, { provide: TodoStore, useValue: mockStore }],
    });

    facade = TestBed.inject(TodoFacade);
  });

  describe("Initialization", () => {
    it("should be created", () => {
      expect(facade).toBeTruthy();
    });

    it("should dispatch loadTodos on construction", () => {
      // Arrange - facade already created in beforeEach
      // Assert - loadTodos should have been dispatched
      expect(
        dispatchedActions.some((a) => a.type === TodoActionTypes.LOAD_TODOS)
      ).toBe(true);
    });

    it("should expose todos$ from store", (done) => {
      // Arrange & Act
      facade.todos$.subscribe((todos) => {
        // Assert
        expect(todos).toEqual(mockTodos);
        done();
      });
    });

    it("should expose loading$ from store", (done) => {
      // Arrange & Act
      facade.loading$.subscribe((loading) => {
        // Assert
        expect(loading).toBe(false);
        done();
      });
    });

    it("should expose error$ from store", (done) => {
      // Arrange & Act
      facade.error$.subscribe((error) => {
        // Assert
        expect(error).toBeNull();
        done();
      });
    });
  });

  describe("loadTodos", () => {
    it("should dispatch LOAD_TODOS action", () => {
      // Arrange
      dispatchedActions = [];
      // Act
      facade.loadTodos();
      // Assert
      expect(dispatchedActions.length).toBe(1);
      expect(dispatchedActions[0].type).toBe(TodoActionTypes.LOAD_TODOS);
    });
  });

  describe("addTodo", () => {
    it("should dispatch ADD_TODO action with title", () => {
      // Arrange
      dispatchedActions = [];
      const title = "New Todo";
      // Act
      facade.addTodo(title);
      // Assert
      expect(dispatchedActions.length).toBe(1);
      expect(dispatchedActions[0].type).toBe(TodoActionTypes.ADD_TODO);
      expect(dispatchedActions[0].payload).toBe(title);
    });
  });

  describe("updateTodo", () => {
    it("should dispatch UPDATE_TODO action with id and updates", () => {
      // Arrange
      dispatchedActions = [];
      const id = "1";
      const updates = { title: "Updated Title" };
      // Act
      facade.updateTodo(id, updates);
      // Assert
      expect(dispatchedActions.length).toBe(1);
      expect(dispatchedActions[0].type).toBe(TodoActionTypes.UPDATE_TODO);
      expect(dispatchedActions[0].payload).toEqual({ id, updates });
    });
  });

  describe("toggleTodo", () => {
    it("should dispatch UPDATE_TODO action with toggled completed status", () => {
      // Arrange
      dispatchedActions = [];
      const id = "1"; // This todo has completed: false
      // Act
      facade.toggleTodo(id);
      // Assert
      expect(dispatchedActions.length).toBe(1);
      expect(dispatchedActions[0].type).toBe(TodoActionTypes.UPDATE_TODO);
      expect(dispatchedActions[0].payload).toEqual({
        id: "1",
        updates: { completed: true }, // Toggled from false to true
      });
    });

    it("should toggle completed from true to false", () => {
      // Arrange
      dispatchedActions = [];
      const id = "2"; // This todo has completed: true
      // Act
      facade.toggleTodo(id);
      // Assert
      expect(dispatchedActions.length).toBe(1);
      expect(dispatchedActions[0].payload).toEqual({
        id: "2",
        updates: { completed: false }, // Toggled from true to false
      });
    });

    it("should not dispatch action if todo not found", () => {
      // Arrange
      dispatchedActions = [];
      const id = "non-existent-id";
      // Act
      facade.toggleTodo(id);
      // Assert
      expect(dispatchedActions.length).toBe(0);
    });
  });

  describe("deleteTodo", () => {
    it("should dispatch DELETE_TODO action with id", () => {
      // Arrange
      dispatchedActions = [];
      const id = "1";
      // Act
      facade.deleteTodo(id);
      // Assert
      expect(dispatchedActions.length).toBe(1);
      expect(dispatchedActions[0].type).toBe(TodoActionTypes.DELETE_TODO);
      expect(dispatchedActions[0].payload).toBe(id);
    });
  });
});

/**
 * Property-based tests for TodoFacade
 */
describe("TodoFacade Property Tests", () => {
  // Arbitrary for generating valid Todo objects
  const todoArbitrary = fc.record({
    id: fc.uuid(),
    title: fc
      .string({ minLength: 1 })
      .filter((s) => s.trim().length > 0)
      .map((s) => s.trim()),
    completed: fc.boolean(),
  });

  const titleArbitrary = fc
    .string({ minLength: 1 })
    .filter((s) => s.trim().length > 0)
    .map((s) => s.trim());

  let mockStore: jasmine.SpyObj<TodoStore>;
  let dispatchedActions: Action[];

  function createFacade(todos: Todo[]): TodoFacade {
    dispatchedActions = [];
    const todosSubject = new BehaviorSubject<Todo[]>(todos);
    const loadingSubject = new BehaviorSubject<boolean>(false);
    const errorSubject = new BehaviorSubject<string | null>(null);

    mockStore = jasmine.createSpyObj("TodoStore", ["dispatch", "getState"]);
    mockStore.dispatch.and.callFake((action: Action) => {
      dispatchedActions.push(action);
    });
    mockStore.getState.and.returnValue({ todos, loading: false, error: null });

    Object.defineProperty(mockStore, "todos$", {
      get: () => todosSubject.asObservable(),
    });
    Object.defineProperty(mockStore, "loading$", {
      get: () => loadingSubject.asObservable(),
    });
    Object.defineProperty(mockStore, "error$", {
      get: () => errorSubject.asObservable(),
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [TodoFacade, { provide: TodoStore, useValue: mockStore }],
    });

    return TestBed.inject(TodoFacade);
  }

  it("should dispatch ADD_TODO with correct title for any valid title", () => {
    fc.assert(
      fc.property(titleArbitrary, (title: string) => {
        const facade = createFacade([]);
        dispatchedActions = []; // Clear loadTodos action

        facade.addTodo(title);

        const addAction = dispatchedActions.find(
          (a) => a.type === TodoActionTypes.ADD_TODO
        );
        expect(addAction).toBeDefined();
        expect(addAction?.payload).toBe(title);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it("should dispatch UPDATE_TODO with correct id and updates for any valid input", () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.record({
          title: fc.option(titleArbitrary, { nil: undefined }),
          completed: fc.option(fc.boolean(), { nil: undefined }),
        }),
        (id: string, updates: Partial<Todo>) => {
          const facade = createFacade([]);
          dispatchedActions = [];

          facade.updateTodo(id, updates);

          const updateAction = dispatchedActions.find(
            (a) => a.type === TodoActionTypes.UPDATE_TODO
          );
          expect(updateAction).toBeDefined();
          expect(updateAction?.payload).toEqual({ id, updates });
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should dispatch DELETE_TODO with correct id for any valid id", () => {
    fc.assert(
      fc.property(fc.uuid(), (id: string) => {
        const facade = createFacade([]);
        dispatchedActions = [];

        facade.deleteTodo(id);

        const deleteAction = dispatchedActions.find(
          (a) => a.type === TodoActionTypes.DELETE_TODO
        );
        expect(deleteAction).toBeDefined();
        expect(deleteAction?.payload).toBe(id);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it("should toggle completed status correctly for any todo in state", () => {
    fc.assert(
      fc.property(
        fc.array(todoArbitrary, { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 0, max: 9 }),
        (todos: Todo[], index: number) => {
          const safeIndex = index % todos.length;
          const targetTodo = todos[safeIndex];
          const facade = createFacade(todos);
          dispatchedActions = [];

          facade.toggleTodo(targetTodo.id);

          const updateAction = dispatchedActions.find(
            (a) => a.type === TodoActionTypes.UPDATE_TODO
          );
          expect(updateAction).toBeDefined();
          expect(updateAction?.payload).toEqual({
            id: targetTodo.id,
            updates: { completed: !targetTodo.completed },
          });
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
