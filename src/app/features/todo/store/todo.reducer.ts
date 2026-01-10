/**
 * @Project       NgSSR Todo App
 * @BD_ID         TODO-001
 * @Description   Pure reducer function for Todo state management
 * @Author        developer
 * @CreatedDate   2026-01-09
 * @Updater       developer
 * @LastUpdated   2026-01-10
 */

import { Action, TodoState } from "../models";
import { TodoActionTypes } from "./todo.actions";
import { isTodo, isTodoArray, TODO_ERROR_MESSAGES } from "../../../shared";

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
 * SECURITY: Uses type guards to validate payload before processing.
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

    case TodoActionTypes.LOAD_TODOS_SUCCESS: {
      // Validate payload is a valid Todo array
      if (!isTodoArray(action.payload)) {
        console.error("Invalid payload for LOAD_TODOS_SUCCESS");
        return {
          ...state,
          loading: false,
          error: TODO_ERROR_MESSAGES.INVALID_DATA,
        };
      }
      return {
        ...state,
        todos: action.payload,
        loading: false,
        error: null,
      };
    }

    case TodoActionTypes.LOAD_TODOS_FAILURE:
      return {
        ...state,
        loading: false,
        error:
          typeof action.payload === "string" ? action.payload : "Unknown error",
      };

    // ==================== ADD TODO ====================
    case TodoActionTypes.ADD_TODO:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case TodoActionTypes.ADD_TODO_SUCCESS: {
      // Validate payload is a valid Todo
      if (!isTodo(action.payload)) {
        console.error("Invalid payload for ADD_TODO_SUCCESS");
        return {
          ...state,
          loading: false,
          error: TODO_ERROR_MESSAGES.INVALID_DATA,
        };
      }
      return {
        ...state,
        todos: [...state.todos, action.payload],
        loading: false,
        error: null,
      };
    }

    case TodoActionTypes.ADD_TODO_FAILURE:
      return {
        ...state,
        loading: false,
        error:
          typeof action.payload === "string" ? action.payload : "Unknown error",
      };

    // ==================== UPDATE TODO ====================
    case TodoActionTypes.UPDATE_TODO:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case TodoActionTypes.UPDATE_TODO_SUCCESS: {
      // Validate payload is a valid Todo
      if (!isTodo(action.payload)) {
        console.error("Invalid payload for UPDATE_TODO_SUCCESS");
        return {
          ...state,
          loading: false,
          error: TODO_ERROR_MESSAGES.INVALID_DATA,
        };
      }
      const updatedTodo = action.payload;
      return {
        ...state,
        // Map through todos and replace the one with matching id
        todos: state.todos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        ),
        loading: false,
        error: null,
      };
    }

    case TodoActionTypes.UPDATE_TODO_FAILURE:
      return {
        ...state,
        loading: false,
        error:
          typeof action.payload === "string" ? action.payload : "Unknown error",
      };

    // ==================== DELETE TODO ====================
    case TodoActionTypes.DELETE_TODO:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case TodoActionTypes.DELETE_TODO_SUCCESS: {
      const deletedId = action.payload;
      // Validate payload is a string
      if (typeof deletedId !== "string") {
        console.error("Invalid payload for DELETE_TODO_SUCCESS");
        return {
          ...state,
          loading: false,
          error: TODO_ERROR_MESSAGES.INVALID_DATA_SHORT,
        };
      }
      return {
        ...state,
        // Filter out the deleted todo
        todos: state.todos.filter((todo) => todo.id !== deletedId),
        loading: false,
        error: null,
      };
    }

    case TodoActionTypes.DELETE_TODO_FAILURE:
      return {
        ...state,
        loading: false,
        error:
          typeof action.payload === "string" ? action.payload : "Unknown error",
      };

    // ==================== DEFAULT ====================
    // Return unchanged state for unknown actions
    // This is important for Redux DevTools and action composition
    default:
      return state;
  }
}
