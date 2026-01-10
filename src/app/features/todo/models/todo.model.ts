/**
 * @Project       NgSSR Todo App
 * @BD_ID         TODO-001
 * @Description   Todo model interfaces and types
 * @Author        developer
 * @CreatedDate   2026-01-09
 * @Updater       developer
 * @LastUpdated   2026-01-09
 */

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export interface Action<T = unknown> {
  type: string;
  payload?: T;
}
