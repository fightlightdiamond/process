import * as fc from 'fast-check';
import { todoReducer } from './todo.reducer';
import { TodoActionTypes } from './todo.actions';
import { Todo, TodoState, Action } from '../../models/todo.model';

// Arbitrary for generating valid Todo objects
const todoArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  completed: fc.boolean(),
});

// Arbitrary for generating valid TodoState objects
const todoStateArbitrary = fc.record({
  todos: fc.array(todoArbitrary, { minLength: 0, maxLength: 10 }),
  loading: fc.boolean(),
  error: fc.option(fc.string({ minLength: 1 }), { nil: null }),
});

describe('Todo Reducer', () => {
  describe('Unit Tests', () => {
    it('should return initial state when called with undefined state', () => {
      // Arrange
      const action = { type: 'UNKNOWN_ACTION' };
      // Act
      const result = todoReducer(undefined, action);
      // Assert
      expect(result).toEqual({
        todos: [],
        loading: false,
        error: null,
      });
    });

    it('should return unchanged state for unknown action type', () => {
      // Arrange
      const state: TodoState = {
        todos: [{ id: '1', title: 'Test', completed: false }],
        loading: false,
        error: null,
      };
      const action = { type: 'UNKNOWN_ACTION' };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result).toBe(state); // Same reference
    });

    it('should handle LOAD_TODOS action', () => {
      // Arrange
      const state: TodoState = {
        todos: [],
        loading: false,
        error: 'old error',
      };
      const action = { type: TodoActionTypes.LOAD_TODOS };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle LOAD_TODOS_SUCCESS action', () => {
      // Arrange
      const state: TodoState = { todos: [], loading: true, error: null };
      const todos: Todo[] = [{ id: '1', title: 'Test', completed: false }];
      const action = {
        type: TodoActionTypes.LOAD_TODOS_SUCCESS,
        payload: todos,
      };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result.todos).toEqual(todos);
      expect(result.loading).toBe(false);
    });

    it('should handle LOAD_TODOS_FAILURE action', () => {
      // Arrange
      const state: TodoState = { todos: [], loading: true, error: null };
      const action = {
        type: TodoActionTypes.LOAD_TODOS_FAILURE,
        payload: 'Error message',
      };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Error message');
    });

    it('should handle ADD_TODO action', () => {
      // Arrange
      const state: TodoState = { todos: [], loading: false, error: null };
      const action = { type: TodoActionTypes.ADD_TODO, payload: 'New Todo' };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle ADD_TODO_SUCCESS action', () => {
      // Arrange
      const state: TodoState = { todos: [], loading: true, error: null };
      const newTodo: Todo = { id: '1', title: 'New', completed: false };
      const action = {
        type: TodoActionTypes.ADD_TODO_SUCCESS,
        payload: newTodo,
      };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result.todos).toContain(newTodo);
      expect(result.loading).toBe(false);
    });

    it('should handle ADD_TODO_FAILURE action', () => {
      // Arrange
      const state: TodoState = { todos: [], loading: true, error: null };
      const action = {
        type: TodoActionTypes.ADD_TODO_FAILURE,
        payload: 'Add failed',
      };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Add failed');
    });

    it('should handle UPDATE_TODO action', () => {
      // Arrange
      const state: TodoState = { todos: [], loading: false, error: null };
      const action = {
        type: TodoActionTypes.UPDATE_TODO,
        payload: { id: '1', updates: { title: 'Updated' } },
      };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle UPDATE_TODO_SUCCESS action', () => {
      // Arrange
      const existingTodo: Todo = { id: '1', title: 'Old', completed: false };
      const state: TodoState = {
        todos: [existingTodo],
        loading: true,
        error: null,
      };
      const updatedTodo: Todo = { id: '1', title: 'Updated', completed: true };
      const action = {
        type: TodoActionTypes.UPDATE_TODO_SUCCESS,
        payload: updatedTodo,
      };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result.todos[0]).toEqual(updatedTodo);
      expect(result.loading).toBe(false);
    });

    it('should handle UPDATE_TODO_FAILURE action', () => {
      // Arrange
      const state: TodoState = { todos: [], loading: true, error: null };
      const action = {
        type: TodoActionTypes.UPDATE_TODO_FAILURE,
        payload: 'Update failed',
      };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Update failed');
    });

    it('should handle DELETE_TODO action', () => {
      // Arrange
      const state: TodoState = { todos: [], loading: false, error: null };
      const action = { type: TodoActionTypes.DELETE_TODO, payload: '1' };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle DELETE_TODO_SUCCESS action', () => {
      // Arrange
      const todo: Todo = { id: '1', title: 'Test', completed: false };
      const state: TodoState = { todos: [todo], loading: true, error: null };
      const action = {
        type: TodoActionTypes.DELETE_TODO_SUCCESS,
        payload: '1',
      };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result.todos.length).toBe(0);
      expect(result.loading).toBe(false);
    });

    it('should handle DELETE_TODO_FAILURE action', () => {
      // Arrange
      const state: TodoState = { todos: [], loading: true, error: null };
      const action = {
        type: TodoActionTypes.DELETE_TODO_FAILURE,
        payload: 'Delete failed',
      };
      // Act
      const result = todoReducer(state, action);
      // Assert
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Delete failed');
    });
  });

  describe('Property Tests', () => {
    /**
     * Feature: json-server-rxjs-store, Property 2: Reducer is a pure function
     * For any state and action, calling the reducer multiple times with the same inputs
     * SHALL always produce the same output, and the original state SHALL remain unchanged (immutability).
     * Validates: Requirements 3.1
     */
    it('Property 2: Reducer is a pure function', () => {
      fc.assert(
        fc.property(
          todoStateArbitrary,
          fc.oneof(
            fc.constant({ type: TodoActionTypes.LOAD_TODOS }),
            fc.array(todoArbitrary).map((todos) => ({
              type: TodoActionTypes.LOAD_TODOS_SUCCESS,
              payload: todos,
            })),
            fc.string().map((error) => ({
              type: TodoActionTypes.LOAD_TODOS_FAILURE,
              payload: error,
            })),
            fc.string().map((title) => ({
              type: TodoActionTypes.ADD_TODO,
              payload: title,
            })),
            todoArbitrary.map((todo) => ({
              type: TodoActionTypes.ADD_TODO_SUCCESS,
              payload: todo,
            })),
            fc.string().map((error) => ({
              type: TodoActionTypes.ADD_TODO_FAILURE,
              payload: error,
            }))
          ),
          (state: TodoState, action: Action) => {
            // Deep clone the original state to verify immutability
            const originalState = JSON.parse(JSON.stringify(state));

            // Call reducer multiple times
            const result1 = todoReducer(state, action);
            const result2 = todoReducer(state, action);

            // Results should be equal (deterministic)
            const resultsEqual =
              JSON.stringify(result1) === JSON.stringify(result2);

            // Original state should remain unchanged (immutability)
            const stateUnchanged =
              JSON.stringify(state) === JSON.stringify(originalState);

            return resultsEqual && stateUnchanged;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: json-server-rxjs-store, Property 3: Reducer handles CRUD operations correctly
     * For any valid TodoState and corresponding success action:
     * - LOAD_TODOS_SUCCESS: todos array SHALL equal the payload
     * - ADD_TODO_SUCCESS: todos array length SHALL increase by 1 and contain the new todo
     * - UPDATE_TODO_SUCCESS: only the matching todo SHALL be modified
     * - DELETE_TODO_SUCCESS: todos array length SHALL decrease by 1 and not contain the deleted todo
     * Validates: Requirements 3.3, 3.4, 3.5, 3.6
     */
    it('Property 3: Reducer handles CRUD operations correctly', () => {
      // Test LOAD_TODOS_SUCCESS
      fc.assert(
        fc.property(
          todoStateArbitrary,
          fc.array(todoArbitrary, { minLength: 0, maxLength: 10 }),
          (state: TodoState, newTodos: Todo[]) => {
            const action = {
              type: TodoActionTypes.LOAD_TODOS_SUCCESS,
              payload: newTodos,
            };
            const result = todoReducer(state, action);
            return (
              JSON.stringify(result.todos) === JSON.stringify(newTodos) &&
              result.loading === false &&
              result.error === null
            );
          }
        ),
        { numRuns: 100 }
      );

      // Test ADD_TODO_SUCCESS
      fc.assert(
        fc.property(
          todoStateArbitrary,
          todoArbitrary,
          (state: TodoState, newTodo: Todo) => {
            const action = {
              type: TodoActionTypes.ADD_TODO_SUCCESS,
              payload: newTodo,
            };
            const result = todoReducer(state, action);
            return (
              result.todos.length === state.todos.length + 1 &&
              result.todos[result.todos.length - 1].id === newTodo.id &&
              result.loading === false &&
              result.error === null
            );
          }
        ),
        { numRuns: 100 }
      );

      // Test UPDATE_TODO_SUCCESS
      fc.assert(
        fc.property(
          fc
            .array(todoArbitrary, { minLength: 1, maxLength: 10 })
            .chain((todos) =>
              fc.record({
                state: fc.constant({
                  todos,
                  loading: false,
                  error: null,
                } as TodoState),
                todoIndex: fc.integer({ min: 0, max: todos.length - 1 }),
                newTitle: fc.string({ minLength: 1 }),
                newCompleted: fc.boolean(),
              })
            ),
          ({ state, todoIndex, newTitle, newCompleted }) => {
            const todoToUpdate = state.todos[todoIndex];
            const updatedTodo: Todo = {
              ...todoToUpdate,
              title: newTitle,
              completed: newCompleted,
            };
            const action = {
              type: TodoActionTypes.UPDATE_TODO_SUCCESS,
              payload: updatedTodo,
            };
            const result = todoReducer(state, action);

            // Same length
            const sameLength = result.todos.length === state.todos.length;

            // Updated todo has new values
            const updatedCorrectly = result.todos.some(
              (t) =>
                t.id === updatedTodo.id &&
                t.title === newTitle &&
                t.completed === newCompleted
            );

            // Other todos unchanged
            const othersUnchanged = state.todos
              .filter((t) => t.id !== todoToUpdate.id)
              .every((original) =>
                result.todos.some(
                  (r) => JSON.stringify(r) === JSON.stringify(original)
                )
              );

            return sameLength && updatedCorrectly && othersUnchanged;
          }
        ),
        { numRuns: 100 }
      );

      // Test DELETE_TODO_SUCCESS
      fc.assert(
        fc.property(
          fc
            .array(todoArbitrary, { minLength: 1, maxLength: 10 })
            .chain((todos) =>
              fc.record({
                state: fc.constant({
                  todos,
                  loading: false,
                  error: null,
                } as TodoState),
                todoIndex: fc.integer({ min: 0, max: todos.length - 1 }),
              })
            ),
          ({ state, todoIndex }) => {
            const todoToDelete = state.todos[todoIndex];
            const action = {
              type: TodoActionTypes.DELETE_TODO_SUCCESS,
              payload: todoToDelete.id,
            };
            const result = todoReducer(state, action);

            // Length decreased by 1
            const lengthDecreased =
              result.todos.length === state.todos.length - 1;

            // Deleted todo not in result
            const todoRemoved = !result.todos.some(
              (t) => t.id === todoToDelete.id
            );

            return lengthDecreased && todoRemoved;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: json-server-rxjs-store, Property 4: Reducer manages loading and error states
     * For any action that starts an async operation (LOAD_TODOS, ADD_TODO, UPDATE_TODO, DELETE_TODO),
     * loading SHALL be true and error SHALL be null.
     * For any success action, loading SHALL be false.
     * For any failure action, loading SHALL be false and error SHALL contain the error message.
     * Validates: Requirements 3.7, 3.8
     */
    it('Property 4: Reducer manages loading and error states', () => {
      // Test async start actions set loading=true and error=null
      fc.assert(
        fc.property(
          todoStateArbitrary,
          fc.oneof(
            fc.constant({ type: TodoActionTypes.LOAD_TODOS }),
            fc.string().map((title) => ({
              type: TodoActionTypes.ADD_TODO,
              payload: title,
            })),
            fc
              .record({
                id: fc.string({ minLength: 1 }),
                updates: fc.record({
                  title: fc.option(fc.string({ minLength: 1 })),
                  completed: fc.option(fc.boolean()),
                }),
              })
              .map((payload) => ({
                type: TodoActionTypes.UPDATE_TODO,
                payload,
              })),
            fc.string({ minLength: 1 }).map((id) => ({
              type: TodoActionTypes.DELETE_TODO,
              payload: id,
            }))
          ),
          (state: TodoState, action: Action) => {
            const result = todoReducer(state, action);
            return result.loading === true && result.error === null;
          }
        ),
        { numRuns: 100 }
      );

      // Test success actions set loading=false
      fc.assert(
        fc.property(
          todoStateArbitrary,
          fc.oneof(
            fc.array(todoArbitrary).map((todos) => ({
              type: TodoActionTypes.LOAD_TODOS_SUCCESS,
              payload: todos,
            })),
            todoArbitrary.map((todo) => ({
              type: TodoActionTypes.ADD_TODO_SUCCESS,
              payload: todo,
            })),
            todoArbitrary.map((todo) => ({
              type: TodoActionTypes.UPDATE_TODO_SUCCESS,
              payload: todo,
            })),
            fc.string({ minLength: 1 }).map((id) => ({
              type: TodoActionTypes.DELETE_TODO_SUCCESS,
              payload: id,
            }))
          ),
          (state: TodoState, action: Action) => {
            const result = todoReducer(state, action);
            return result.loading === false && result.error === null;
          }
        ),
        { numRuns: 100 }
      );

      // Test failure actions set loading=false and error=message
      fc.assert(
        fc.property(
          todoStateArbitrary,
          fc.string({ minLength: 1 }),
          fc.oneof(
            fc.constant(TodoActionTypes.LOAD_TODOS_FAILURE),
            fc.constant(TodoActionTypes.ADD_TODO_FAILURE),
            fc.constant(TodoActionTypes.UPDATE_TODO_FAILURE),
            fc.constant(TodoActionTypes.DELETE_TODO_FAILURE)
          ),
          (state: TodoState, errorMessage: string, actionType: string) => {
            const action = { type: actionType, payload: errorMessage };
            const result = todoReducer(state, action);
            return result.loading === false && result.error === errorMessage;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
