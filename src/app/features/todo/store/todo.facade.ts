/**
 * @Project       NgSSR Todo App
 * @BD_ID         TODO-001
 * @Description   Facade pattern - simplified API for Todo store
 * @Author        developer
 * @CreatedDate   2026-01-09
 * @Updater       developer
 * @LastUpdated   2026-01-10
 */

import { Injectable, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Observable } from "rxjs";

import { Todo } from "../models";
import { TodoStore } from "./todo.store";
import { loadTodos, addTodo, updateTodo, deleteTodo } from "./todo.actions";

/**
 * TodoFacade - Provides a simplified API for components to interact with todo state.
 *
 * Benefits of Facade pattern:
 * 1. Encapsulates store complexity - components don't need to know about actions/reducers
 * 2. Single point of entry - all state interactions go through here
 * 3. Easy to test - can mock facade instead of entire store
 * 4. Decouples components from state management implementation
 *
 * Components should ONLY interact with state through this facade.
 */
@Injectable({
  providedIn: "root",
})
export class TodoFacade {
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Expose Observables from store for components to subscribe to.
   * Components use these with async pipe for automatic subscription management.
   */
  readonly todos$: Observable<Todo[]> = this.store.todos$;
  readonly loading$: Observable<boolean> = this.store.loading$;
  readonly error$: Observable<string | null> = this.store.error$;

  constructor(private store: TodoStore) {
    // Only load todos on browser to prevent SSR double-loading
    // SSR renders with empty state, client hydrates and loads data
    if (isPlatformBrowser(this.platformId)) {
      this.loadTodos();
    }
  }

  /**
   * Load all todos from API.
   * Called automatically on init, but can be called manually to refresh.
   */
  loadTodos(): void {
    this.store.dispatch(loadTodos());
  }

  /**
   * Add a new todo with the given title.
   * The todo will be created with completed=false.
   * @param title - The title of the new todo
   */
  addTodo(title: string): void {
    this.store.dispatch(addTodo(title));
  }

  /**
   * Update an existing todo with partial data.
   * Can update title, completed status, or both.
   * @param id - The id of the todo to update
   * @param updates - Partial todo object with fields to update
   */
  updateTodo(id: string, updates: Partial<Todo>): void {
    this.store.dispatch(updateTodo({ id, updates }));
  }

  /**
   * Toggle the completed status of a todo.
   *
   * SPECIAL CASE: This method needs to read current state to determine
   * the new completed value. We use getState() synchronously here because:
   * 1. We need the current value to flip it
   * 2. The operation should be immediate (no async lookup)
   *
   * If todo is not found (edge case), the operation is silently ignored.
   *
   * @param id - The id of the todo to toggle
   */
  toggleTodo(id: string): void {
    const todos = this.store.getState().todos;
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      this.updateTodo(id, { completed: !todo.completed });
    }
    // Note: If todo not found, we silently ignore.
    // This could happen if todo was deleted between render and click.
  }

  /**
   * Delete a todo by id.
   * @param id - The id of the todo to delete
   */
  deleteTodo(id: string): void {
    this.store.dispatch(deleteTodo(id));
  }
}
