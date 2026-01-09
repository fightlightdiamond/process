import * as fc from 'fast-check';
import {
  TodoActionTypes,
  loadTodos,
  loadTodosSuccess,
  loadTodosFailure,
  addTodo,
  addTodoSuccess,
  addTodoFailure,
  updateTodo,
  updateTodoSuccess,
  updateTodoFailure,
  deleteTodo,
  deleteTodoSuccess,
  deleteTodoFailure,
} from './todo.actions';
import { Todo } from '../../models/todo.model';

describe('Todo Actions', () => {
  describe('Property Tests', () => {
    /**
     * Feature: json-server-rxjs-store, Property 1: Action creators return correct structure
     * For any action creator function and any valid payload, the returned action object
     * SHALL have a `type` property matching the action type constant and a `payload`
     * property (if provided) containing the input data.
     * Validates: Requirements 2.3
     */
    it('Property 1: Action creators return correct structure', () => {
      // Test loadTodos (no payload)
      const loadAction = loadTodos();
      expect(loadAction.type).toBe(TodoActionTypes.LOAD_TODOS);
      expect(loadAction.payload).toBeUndefined();

      // Test loadTodosSuccess with generated todos array
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.string({ minLength: 1 }),
              title: fc.string({ minLength: 1 }),
              completed: fc.boolean(),
            }),
            { minLength: 0, maxLength: 10 }
          ),
          (todos: Todo[]) => {
            const action = loadTodosSuccess(todos);
            return (
              action.type === TodoActionTypes.LOAD_TODOS_SUCCESS &&
              action.payload === todos &&
              Array.isArray(action.payload)
            );
          }
        ),
        { numRuns: 100 }
      );

      // Test loadTodosFailure with generated error strings
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (error: string) => {
          const action = loadTodosFailure(error);
          return (
            action.type === TodoActionTypes.LOAD_TODOS_FAILURE &&
            action.payload === error
          );
        }),
        { numRuns: 100 }
      );

      // Test addTodo with generated title strings
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (title: string) => {
          const action = addTodo(title);
          return (
            action.type === TodoActionTypes.ADD_TODO && action.payload === title
          );
        }),
        { numRuns: 100 }
      );

      // Test addTodoSuccess with generated todo
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            title: fc.string({ minLength: 1 }),
            completed: fc.boolean(),
          }),
          (todo: Todo) => {
            const action = addTodoSuccess(todo);
            return (
              action.type === TodoActionTypes.ADD_TODO_SUCCESS &&
              action.payload === todo
            );
          }
        ),
        { numRuns: 100 }
      );

      // Test addTodoFailure with generated error strings
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (error: string) => {
          const action = addTodoFailure(error);
          return (
            action.type === TodoActionTypes.ADD_TODO_FAILURE &&
            action.payload === error
          );
        }),
        { numRuns: 100 }
      );

      // Test updateTodo with generated update payload
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            updates: fc.record({
              title: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
              completed: fc.option(fc.boolean(), { nil: undefined }),
            }),
          }),
          (payload: { id: string; updates: Partial<Todo> }) => {
            const action = updateTodo(payload);
            return (
              action.type === TodoActionTypes.UPDATE_TODO &&
              action.payload === payload
            );
          }
        ),
        { numRuns: 100 }
      );

      // Test updateTodoSuccess with generated todo
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            title: fc.string({ minLength: 1 }),
            completed: fc.boolean(),
          }),
          (todo: Todo) => {
            const action = updateTodoSuccess(todo);
            return (
              action.type === TodoActionTypes.UPDATE_TODO_SUCCESS &&
              action.payload === todo
            );
          }
        ),
        { numRuns: 100 }
      );

      // Test updateTodoFailure with generated error strings
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (error: string) => {
          const action = updateTodoFailure(error);
          return (
            action.type === TodoActionTypes.UPDATE_TODO_FAILURE &&
            action.payload === error
          );
        }),
        { numRuns: 100 }
      );

      // Test deleteTodo with generated id strings
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (id: string) => {
          const action = deleteTodo(id);
          return (
            action.type === TodoActionTypes.DELETE_TODO && action.payload === id
          );
        }),
        { numRuns: 100 }
      );

      // Test deleteTodoSuccess with generated id strings
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (id: string) => {
          const action = deleteTodoSuccess(id);
          return (
            action.type === TodoActionTypes.DELETE_TODO_SUCCESS &&
            action.payload === id
          );
        }),
        { numRuns: 100 }
      );

      // Test deleteTodoFailure with generated error strings
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (error: string) => {
          const action = deleteTodoFailure(error);
          return (
            action.type === TodoActionTypes.DELETE_TODO_FAILURE &&
            action.payload === error
          );
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should define all action type constants', () => {
      expect(TodoActionTypes.LOAD_TODOS).toBe('[Todo] Load Todos');
      expect(TodoActionTypes.LOAD_TODOS_SUCCESS).toBe(
        '[Todo] Load Todos Success'
      );
      expect(TodoActionTypes.LOAD_TODOS_FAILURE).toBe(
        '[Todo] Load Todos Failure'
      );
      expect(TodoActionTypes.ADD_TODO).toBe('[Todo] Add Todo');
      expect(TodoActionTypes.ADD_TODO_SUCCESS).toBe('[Todo] Add Todo Success');
      expect(TodoActionTypes.ADD_TODO_FAILURE).toBe('[Todo] Add Todo Failure');
      expect(TodoActionTypes.UPDATE_TODO).toBe('[Todo] Update Todo');
      expect(TodoActionTypes.UPDATE_TODO_SUCCESS).toBe(
        '[Todo] Update Todo Success'
      );
      expect(TodoActionTypes.UPDATE_TODO_FAILURE).toBe(
        '[Todo] Update Todo Failure'
      );
      expect(TodoActionTypes.DELETE_TODO).toBe('[Todo] Delete Todo');
      expect(TodoActionTypes.DELETE_TODO_SUCCESS).toBe(
        '[Todo] Delete Todo Success'
      );
      expect(TodoActionTypes.DELETE_TODO_FAILURE).toBe(
        '[Todo] Delete Todo Failure'
      );
    });
  });
});
