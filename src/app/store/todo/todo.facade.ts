import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Todo } from '../../models/todo.model';
import { TodoStore } from './todo.store';
import { loadTodos, addTodo, updateTodo, deleteTodo } from './todo.actions';

/**
 * TodoFacade - Encapsulates all store interactions and provides
 * a simple API for components to interact with the todo state.
 */
@Injectable({
  providedIn: 'root',
})
export class TodoFacade {
  // Expose Observables from store
  readonly todos$: Observable<Todo[]> = this.store.todos$;
  readonly loading$: Observable<boolean> = this.store.loading$;
  readonly error$: Observable<string | null> = this.store.error$;

  constructor(private store: TodoStore) {
    // Load todos when facade is initialized
    this.loadTodos();
  }

  /**
   * Load all todos from API
   */
  loadTodos(): void {
    this.store.dispatch(loadTodos());
  }

  /**
   * Add a new todo
   * @param title - The title of the new todo
   */
  addTodo(title: string): void {
    this.store.dispatch(addTodo(title));
  }

  /**
   * Update an existing todo
   * @param id - The id of the todo to update
   * @param updates - Partial todo object with updates
   */
  updateTodo(id: string, updates: Partial<Todo>): void {
    this.store.dispatch(updateTodo({ id, updates }));
  }

  /**
   * Toggle the completed status of a todo
   * @param id - The id of the todo to toggle
   */
  toggleTodo(id: string): void {
    const todos = this.store.getState().todos;
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      this.updateTodo(id, { completed: !todo.completed });
    }
  }

  /**
   * Delete a todo
   * @param id - The id of the todo to delete
   */
  deleteTodo(id: string): void {
    this.store.dispatch(deleteTodo(id));
  }
}
