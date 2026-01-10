import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import * as fc from "fast-check";

import { TodoStore } from "./todo.store";
import { TodoEffects } from "./todo.effects";
import { Todo, Action } from "../../models/todo.model";
import {
  TodoActionTypes,
  loadTodosSuccess,
  addTodoSuccess,
} from "./todo.actions";
import { initialState } from "./todo.reducer";

describe("TodoStore", () => {
  let store: TodoStore;
  let mockEffects: jasmine.SpyObj<TodoEffects>;

  beforeEach(() => {
    mockEffects = jasmine.createSpyObj("TodoEffects", ["init"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoStore, { provide: TodoEffects, useValue: mockEffects }],
    });

    store = TestBed.inject(TodoStore);
  });

  describe("Initialization", () => {
    it("should be created", () => {
      expect(store).toBeTruthy();
    });

    it("should initialize effects with actions$ and dispatch function", () => {
      expect(mockEffects.init).toHaveBeenCalled();
      const [actions$, dispatchFn] = mockEffects.init.calls.mostRecent().args;
      expect(actions$).toBeDefined();
      expect(typeof dispatchFn).toBe("function");
    });

    it("should have initial state", () => {
      const state = store.getState();
      expect(state).toEqual(initialState);
    });
  });

  describe("Selectors", () => {
    it("should expose todos$ observable", (done) => {
      store.todos$.subscribe((todos) => {
        expect(todos).toEqual([]);
        done();
      });
    });

    it("should expose loading$ observable", (done) => {
      store.loading$.subscribe((loading) => {
        expect(loading).toBe(false);
        done();
      });
    });

    it("should expose error$ observable", (done) => {
      store.error$.subscribe((error) => {
        expect(error).toBeNull();
        done();
      });
    });

    it("should emit updated todos when state changes", (done) => {
      const mockTodos: Todo[] = [{ id: "1", title: "Test", completed: false }];
      let emitCount = 0;

      store.todos$.subscribe((todos) => {
        emitCount++;
        if (emitCount === 2) {
          expect(todos).toEqual(mockTodos);
          done();
        }
      });

      store.dispatch(loadTodosSuccess(mockTodos));
    });

    it("should emit updated loading when state changes", (done) => {
      let emitCount = 0;

      store.loading$.subscribe((loading) => {
        emitCount++;
        if (emitCount === 2) {
          expect(loading).toBe(true);
          done();
        }
      });

      store.dispatch({ type: TodoActionTypes.LOAD_TODOS });
    });

    it("should emit updated error when state changes", (done) => {
      let emitCount = 0;

      store.error$.subscribe((error) => {
        emitCount++;
        if (emitCount === 2) {
          expect(error).toBe("Test error");
          done();
        }
      });

      store.dispatch({
        type: TodoActionTypes.LOAD_TODOS_FAILURE,
        payload: "Test error",
      });
    });
  });

  describe("dispatch", () => {
    it("should update state when action is dispatched", () => {
      // Arrange
      const mockTodos: Todo[] = [{ id: "1", title: "Test", completed: false }];
      // Act
      store.dispatch(loadTodosSuccess(mockTodos));
      // Assert
      expect(store.getState().todos).toEqual(mockTodos);
    });

    it("should handle multiple dispatches", () => {
      // Arrange
      const todo1: Todo = { id: "1", title: "First", completed: false };
      const todo2: Todo = { id: "2", title: "Second", completed: true };
      // Act
      store.dispatch(loadTodosSuccess([todo1]));
      store.dispatch(addTodoSuccess(todo2));
      // Assert
      expect(store.getState().todos).toEqual([todo1, todo2]);
    });
  });

  describe("getState", () => {
    it("should return current state snapshot", () => {
      // Arrange
      const mockTodos: Todo[] = [{ id: "1", title: "Test", completed: false }];
      store.dispatch(loadTodosSuccess(mockTodos));
      // Act
      const state = store.getState();
      // Assert
      expect(state.todos).toEqual(mockTodos);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("Effects Integration", () => {
    it("should dispatch actions from effects callback", () => {
      // Arrange - Get the dispatch callback that was passed to effects.init
      const [, dispatchFn] = mockEffects.init.calls.mostRecent().args;
      const testAction: Action = {
        type: TodoActionTypes.LOAD_TODOS_SUCCESS,
        payload: [],
      };
      // Act - Call the dispatch callback (simulating effects dispatching an action)
      dispatchFn(testAction);
      // Assert - State should be updated
      expect(store.getState().todos).toEqual([]);
    });
  });

  describe("distinctUntilChanged behavior", () => {
    it("should not emit duplicate todos values", (done) => {
      const mockTodos: Todo[] = [{ id: "1", title: "Test", completed: false }];
      let emitCount = 0;

      store.todos$.subscribe(() => {
        emitCount++;
      });

      // Dispatch same todos twice
      store.dispatch(loadTodosSuccess(mockTodos));
      store.dispatch(loadTodosSuccess(mockTodos));

      setTimeout(() => {
        // Should only emit twice: initial [] and mockTodos (not third time for duplicate)
        expect(emitCount).toBe(2);
        done();
      }, 100);
    });
  });
});

/**
 * Property-based tests for TodoStore
 */
describe("TodoStore Property Tests", () => {
  const todoArbitrary = fc.record({
    id: fc.uuid(),
    title: fc
      .string({ minLength: 1 })
      .filter((s) => s.trim().length > 0)
      .map((s) => s.trim()),
    completed: fc.boolean(),
  });

  let store: TodoStore;
  let mockEffects: jasmine.SpyObj<TodoEffects>;

  function createStore(): TodoStore {
    mockEffects = jasmine.createSpyObj("TodoEffects", ["init"]);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoStore, { provide: TodoEffects, useValue: mockEffects }],
    });

    return TestBed.inject(TodoStore);
  }

  it("should correctly update state for any LOAD_TODOS_SUCCESS action", () => {
    fc.assert(
      fc.property(
        fc.array(todoArbitrary, { minLength: 0, maxLength: 10 }),
        (todos: Todo[]) => {
          store = createStore();

          store.dispatch(loadTodosSuccess(todos));

          const state = store.getState();
          expect(state.todos).toEqual(todos);
          expect(state.loading).toBe(false);
          expect(state.error).toBeNull();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should correctly update state for any ADD_TODO_SUCCESS action", () => {
    fc.assert(
      fc.property(
        fc.array(todoArbitrary, { minLength: 0, maxLength: 5 }),
        todoArbitrary,
        (existingTodos: Todo[], newTodo: Todo) => {
          store = createStore();

          // Set initial todos
          store.dispatch(loadTodosSuccess(existingTodos));
          // Add new todo
          store.dispatch(addTodoSuccess(newTodo));

          const state = store.getState();
          expect(state.todos.length).toBe(existingTodos.length + 1);
          expect(state.todos[state.todos.length - 1]).toEqual(newTodo);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should maintain state consistency through multiple dispatches", () => {
    fc.assert(
      fc.property(
        fc.array(todoArbitrary, { minLength: 1, maxLength: 5 }),
        fc.array(todoArbitrary, { minLength: 1, maxLength: 5 }),
        (todos1: Todo[], todos2: Todo[]) => {
          store = createStore();

          store.dispatch(loadTodosSuccess(todos1));
          const state1 = store.getState();
          expect(state1.todos).toEqual(todos1);

          store.dispatch(loadTodosSuccess(todos2));
          const state2 = store.getState();
          expect(state2.todos).toEqual(todos2);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
