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

@Injectable({
  providedIn: 'root',
})
export class TodoEffects {
  private dispatchFn: ((action: Action) => void) | null = null;

  constructor(private apiService: TodoApiService) {}

  /**
   * Initialize effects with action stream and dispatch function
   * @param actions$ - Subject that emits actions
   * @param dispatch - Function to dispatch resulting actions back to store
   */
  init(actions$: Subject<Action>, dispatch: (action: Action) => void): void {
    this.dispatchFn = dispatch;

    // Merge all effect streams and subscribe
    merge(
      this.createLoadTodosEffect(actions$),
      this.createAddTodoEffect(actions$),
      this.createUpdateTodoEffect(actions$),
      this.createDeleteTodoEffect(actions$)
    ).subscribe((action) => {
      if (action && this.dispatchFn) {
        this.dispatchFn(action);
      }
    });
  }

  /**
   * Effect for LOAD_TODOS action
   * Calls API to get all todos and dispatches success or failure action
   */
  private createLoadTodosEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter((action) => action.type === TodoActionTypes.LOAD_TODOS),
      switchMap(() =>
        this.apiService.getTodos().pipe(
          map((todos: Todo[]) => loadTodosSuccess(todos)),
          catchError((error) =>
            of(loadTodosFailure(error.message || 'Failed to load todos'))
          )
        )
      )
    );
  }

  /**
   * Effect for ADD_TODO action
   * Calls API to add a new todo and dispatches success or failure action
   */
  private createAddTodoEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter((action) => action.type === TodoActionTypes.ADD_TODO),
      switchMap((action) => {
        const title = action.payload as string;
        const newTodo: Omit<Todo, 'id'> = {
          title,
          completed: false,
        };
        return this.apiService.addTodo(newTodo).pipe(
          map((todo: Todo) => addTodoSuccess(todo)),
          catchError((error) =>
            of(addTodoFailure(error.message || 'Failed to add todo'))
          )
        );
      })
    );
  }

  /**
   * Effect for UPDATE_TODO action
   * Calls API to update a todo and dispatches success or failure action
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
            of(updateTodoFailure(error.message || 'Failed to update todo'))
          )
        );
      })
    );
  }

  /**
   * Effect for DELETE_TODO action
   * Calls API to delete a todo and dispatches success or failure action
   */
  private createDeleteTodoEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter((action) => action.type === TodoActionTypes.DELETE_TODO),
      switchMap((action) => {
        const id = action.payload as string;
        return this.apiService.deleteTodo(id).pipe(
          map(() => deleteTodoSuccess(id)),
          catchError((error) =>
            of(deleteTodoFailure(error.message || 'Failed to delete todo'))
          )
        );
      })
    );
  }
}
