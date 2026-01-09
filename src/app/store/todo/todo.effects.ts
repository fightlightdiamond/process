import { Injectable } from '@angular/core';
import { Subject, merge } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Action, Todo } from '../../models/todo.model';
import { TodoApiService } from '../../services/todo-api.service';
import {
  TodoActionTypes,
  loadTodosSuccess,
  loadTodosFailure,
  addTodoSuccess,
  addTodoFailure,
  updateTodoSuccess,
  updateTodoFailure,
  deleteTodoSuccess,
  deleteTodoFailure,
} from './todo.actions';

/**
 * TodoEffects - Handles side effects (API calls) for todo actions.
 *
 * Pattern: Listen to action stream -> Call API -> Dispatch success/failure action
 *
 * Key RxJS operators used:
 * - filter: Only process specific action types
 * - switchMap: Cancel previous request if new one comes in (prevents race conditions)
 * - catchError: Handle API errors gracefully, return failure action instead of breaking stream
 */
@Injectable({
  providedIn: 'root',
})
export class TodoEffects {
  /**
   * Reference to dispatch function, set during init.
   * Used to dispatch resulting actions back to the store.
   */
  private dispatchFn: ((action: Action) => void) | null = null;

  constructor(private apiService: TodoApiService) {}

  /**
   * Initialize effects with action stream and dispatch function.
   * This creates a reactive pipeline that listens to all actions
   * and triggers API calls for relevant action types.
   *
   * @param actions$ - Subject that emits all dispatched actions
   * @param dispatch - Function to dispatch resulting actions back to store
   */
  init(actions$: Subject<Action>, dispatch: (action: Action) => void): void {
    this.dispatchFn = dispatch;

    /**
     * Merge all effect streams into a single subscription.
     * Each effect handles one action type and returns success/failure actions.
     */
    merge(
      this.createLoadTodosEffect(actions$),
      this.createAddTodoEffect(actions$),
      this.createUpdateTodoEffect(actions$),
      this.createDeleteTodoEffect(actions$)
    ).subscribe((action) => {
      // Only dispatch if action exists and dispatch function is set
      if (action && this.dispatchFn) {
        this.dispatchFn(action);
      }
    });
  }

  /**
   * Effect for LOAD_TODOS action.
   * Fetches all todos from API.
   *
   * switchMap is used to cancel any in-flight request if a new LOAD_TODOS is dispatched.
   * This prevents stale data from overwriting fresh data.
   */
  private createLoadTodosEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter((action) => action.type === TodoActionTypes.LOAD_TODOS),
      switchMap(() =>
        this.apiService.getTodos().pipe(
          map((todos: Todo[]) => loadTodosSuccess(todos)),
          // catchError prevents the stream from breaking on API error
          // Returns a failure action instead, keeping the effect alive
          // HttpErrorResponse has error.error for response body, error.message for default message
          catchError((error) =>
            of(loadTodosFailure(error.error?.message || 'Failed to load todos'))
          )
        )
      )
    );
  }

  /**
   * Effect for ADD_TODO action.
   * Creates a new todo via API with the provided title.
   * New todos are created with completed=false by default.
   */
  private createAddTodoEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter((action) => action.type === TodoActionTypes.ADD_TODO),
      switchMap((action) => {
        const title = action.payload as string;
        // Create todo object without id (json-server generates id)
        const newTodo: Omit<Todo, 'id'> = {
          title,
          completed: false,
        };
        return this.apiService.addTodo(newTodo).pipe(
          map((todo: Todo) => addTodoSuccess(todo)),
          catchError((error) =>
            of(addTodoFailure(error.error?.message || 'Failed to add todo'))
          )
        );
      })
    );
  }

  /**
   * Effect for UPDATE_TODO action.
   * Updates an existing todo with partial data (PATCH semantics).
   * Used for both title updates and toggle completed status.
   */
  private createUpdateTodoEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter((action) => action.type === TodoActionTypes.UPDATE_TODO),
      switchMap((action) => {
        const { id, updates } = action.payload as {
          id: string;
          updates: Partial<Todo>;
        };
        return this.apiService.updateTodo(id, updates).pipe(
          map((todo: Todo) => updateTodoSuccess(todo)),
          catchError((error) =>
            of(
              updateTodoFailure(error.error?.message || 'Failed to update todo')
            )
          )
        );
      })
    );
  }

  /**
   * Effect for DELETE_TODO action.
   * Deletes a todo by id.
   * On success, dispatches the id so reducer can remove it from state.
   */
  private createDeleteTodoEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter((action) => action.type === TodoActionTypes.DELETE_TODO),
      switchMap((action) => {
        const id = action.payload as string;
        return this.apiService.deleteTodo(id).pipe(
          // API returns void, so we pass the id to success action
          map(() => deleteTodoSuccess(id)),
          catchError((error) =>
            of(
              deleteTodoFailure(error.error?.message || 'Failed to delete todo')
            )
          )
        );
      })
    );
  }
}
