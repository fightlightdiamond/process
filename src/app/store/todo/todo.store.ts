import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { Action, Todo, TodoState } from '../../models/todo.model';
import { todoReducer, initialState } from './todo.reducer';
import { TodoEffects } from './todo.effects';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  // BehaviorSubject for state - holds current state and emits to new subscribers
  private state$ = new BehaviorSubject<TodoState>(initialState);

  // Subject for actions - used to dispatch actions
  private actions$ = new Subject<Action>();

  // Selectors - expose state slices as Observables
  readonly todos$: Observable<Todo[]> = this.state$.pipe(
    map((state) => state.todos),
    distinctUntilChanged()
  );

  readonly loading$: Observable<boolean> = this.state$.pipe(
    map((state) => state.loading),
    distinctUntilChanged()
  );

  readonly error$: Observable<string | null> = this.state$.pipe(
    map((state) => state.error),
    distinctUntilChanged()
  );

  constructor(private effects: TodoEffects) {
    // Wire reducer into action stream
    this.actions$.subscribe((action) => {
      const currentState = this.state$.getValue();
      const newState = todoReducer(currentState, action);
      this.state$.next(newState);
    });

    // Initialize effects with action stream and dispatch function
    this.effects.init(this.actions$, (action) => this.dispatch(action));
  }

  /**
   * Dispatch an action to the store
   * @param action - The action to dispatch
   */
  dispatch(action: Action): void {
    this.actions$.next(action);
  }

  /**
   * Get current state snapshot
   * @returns Current TodoState
   */
  getState(): TodoState {
    return this.state$.getValue();
  }
}
