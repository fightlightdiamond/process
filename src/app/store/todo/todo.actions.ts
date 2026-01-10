/**
 * @Project       NgSSR Todo App
 * @BD_ID         TODO-001
 * @Description   Redux-style action creators for Todo store
 * @Author        developer
 * @CreatedDate   2026-01-09
 * @Updater       developer
 * @LastUpdated   2026-01-09
 */

import { Action, Todo } from "../../models/todo.model";

// Action Types
export const TodoActionTypes = {
  LOAD_TODOS: "[Todo] Load Todos",
  LOAD_TODOS_SUCCESS: "[Todo] Load Todos Success",
  LOAD_TODOS_FAILURE: "[Todo] Load Todos Failure",
  ADD_TODO: "[Todo] Add Todo",
  ADD_TODO_SUCCESS: "[Todo] Add Todo Success",
  ADD_TODO_FAILURE: "[Todo] Add Todo Failure",
  UPDATE_TODO: "[Todo] Update Todo",
  UPDATE_TODO_SUCCESS: "[Todo] Update Todo Success",
  UPDATE_TODO_FAILURE: "[Todo] Update Todo Failure",
  DELETE_TODO: "[Todo] Delete Todo",
  DELETE_TODO_SUCCESS: "[Todo] Delete Todo Success",
  DELETE_TODO_FAILURE: "[Todo] Delete Todo Failure",
} as const;

// Action Creators

// Load Todos
export function loadTodos(): Action {
  return { type: TodoActionTypes.LOAD_TODOS };
}

export function loadTodosSuccess(todos: Todo[]): Action<Todo[]> {
  return { type: TodoActionTypes.LOAD_TODOS_SUCCESS, payload: todos };
}

export function loadTodosFailure(error: string): Action<string> {
  return { type: TodoActionTypes.LOAD_TODOS_FAILURE, payload: error };
}

// Add Todo
export function addTodo(title: string): Action<string> {
  return { type: TodoActionTypes.ADD_TODO, payload: title };
}

export function addTodoSuccess(todo: Todo): Action<Todo> {
  return { type: TodoActionTypes.ADD_TODO_SUCCESS, payload: todo };
}

export function addTodoFailure(error: string): Action<string> {
  return { type: TodoActionTypes.ADD_TODO_FAILURE, payload: error };
}

// Update Todo
export function updateTodo(todo: {
  id: string;
  updates: Partial<Todo>;
}): Action<{ id: string; updates: Partial<Todo> }> {
  return { type: TodoActionTypes.UPDATE_TODO, payload: todo };
}

export function updateTodoSuccess(todo: Todo): Action<Todo> {
  return { type: TodoActionTypes.UPDATE_TODO_SUCCESS, payload: todo };
}

export function updateTodoFailure(error: string): Action<string> {
  return { type: TodoActionTypes.UPDATE_TODO_FAILURE, payload: error };
}

// Delete Todo
export function deleteTodo(id: string): Action<string> {
  return { type: TodoActionTypes.DELETE_TODO, payload: id };
}

export function deleteTodoSuccess(id: string): Action<string> {
  return { type: TodoActionTypes.DELETE_TODO_SUCCESS, payload: id };
}

export function deleteTodoFailure(error: string): Action<string> {
  return { type: TodoActionTypes.DELETE_TODO_FAILURE, payload: error };
}
