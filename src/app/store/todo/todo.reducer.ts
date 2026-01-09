/**
 * @Project       NgSSR Todo App
 * @BD_ID         TODO-001
 * @Description   Pure reducer function for Todo state management
 * @Author        developer
 * @CreatedDate   2026-01-09
 * @Updater       developer
 * @LastUpdated   2026-01-09
 */

import { Action, Todo, TodoState } from '../../models/todo.model';
import { TodoActionTypes } from './todo.actions';

/**
 * Initial state for the todo store.
 * - todos: empty array (will be populated from API)
 * - loading: false (no operation in progress)
 * - error: null (no error)
 */
export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

/**
 * Todo Reducer - Pure function that handles state transitions.
 *
 * Pattern for each CRUD operation:
 * 1. ACTION: Set loading=true, clear error (optimistic UI feedback)
 * 2. ACTION_SUCCESS: Update data, set loading=false
 * 3. ACTION_FAILURE: Set error message, set loading=false
 *
 * IMPORTANT: This reducer is a pure function - it never mutates the input state.
 * Always returns a new state object using spread operator.
 *
 * @param state - Current state (defaults to initialState)
 * @param action - Action to process
 * @returns New state
 */
export function todoReducer(
  state: TodoState = initialState,
  action: Action
): TodoState {
  switch (action.type) {
    // ==================== LOAD TODOS ====================
    case TodoActionTypes.LOAD_TODOS:
      return {
        ...state,
        loading: true,
        error: null, // Clear any previous error
      };

    case TodoActionTypes.LOAD_TODOS_SUCCESS:
      return {
        ...state,
        todos: action.payload as Todo[], // Replace entire todos array
        loading: false,
        error: null,
      };

    case TodoActionTypes.LOAD_TODOS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as string,
      };

    // ==================== ADD TODO ====================
    case TodoActionTypes.ADD_TODO:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case TodoActionTypes.ADD_TODO_SUCCESS:
      return {
        ...state,
        todos: [...state.todos, action.payload as Todo], // Append new todo to end
        loading: false,
        error: null,
      };

    case TodoActionTypes.ADD_TODO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as string,
      };

    // ==================== UPDATE TODO ====================
    case TodoActionTypes.UPDATE_TODO:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case TodoActionTypes.UPDATE_TODO_SUCCESS:
      const updatedTodo = action.payload as Todo;
      return {
        ...state,
        // Map through todos and replace the one with matching id
        todos: state.todos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        ),
        loading: false,
        error: null,
      };

    case TodoActionTypes.UPDATE_TODO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as string,
      };

    // ==================== DELETE TODO ====================
    case TodoActionTypes.DELETE_TODO:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case TodoActionTypes.DELETE_TODO_SUCCESS:
      const deletedId = action.payload as string;
      return {
        ...state,
        // Filter out the deleted todo
        todos: state.todos.filter((todo) => todo.id !== deletedId),
        loading: false,
        error: null,
      };

    case TodoActionTypes.DELETE_TODO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as string,
      };

    // ==================== DEFAULT ====================
    // Return unchanged state for unknown actions
    // This is important for Redux DevTools and action composition
    default:
      return state;
  }
}
