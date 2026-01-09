import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { Action, Todo, TodoState } from '../../models/todo.model';
import { todoReducer, initialState } from './todo.reducer';
import { TodoEffects } from './todo.effects';

/**
 * TodoStore - Custom Redux-like store implementation using RxJS
 *
 * This store follows the Redux pattern:
 * 1. Single source of truth (state$ BehaviorSubject)
 * 2. State is read-only (only changed via dispatch)
 * 3. Changes are made with pure functions (reducer)
 *
 * Flow: Component -> dispatch(action) -> reducer -> new state -> selectors -> Component
 *       Side effects are handled by TodoEffects which listens to actions$
 */
@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  /**
   * BehaviorSubject holds the current state and emits it to new subscribers immediately.
   * This ensures components always get the latest state when they subscribe.
   */
  private state$ = new BehaviorSubject<TodoState>(initialState);

  /**
   * Subject for actions - acts as an event bus for all dispatched actions.
   * Both the reducer and effects listen to this stream.
   */
  private actions$ = new Subject<Action>();

  /**
   * Selectors - expose specific state slices as Observables.
   * distinctUntilChanged() prevents unnecessary re-renders when the value hasn't changed.
   */
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
    /**
     * Wire reducer into action stream.
     * Every dispatched action goes through the reducer to produce new state.
     * This is synchronous - state updates immediately after dispatch.
     */
    this.actions$.subscribe((action) => {
      const currentState = this.state$.getValue();
      const newState = todoReducer(currentState, action);
      this.state$.next(newState);
    });

    /**
     * Initialize effects with action stream and dispatch function.
     * Effects handle async operations (API calls) and dispatch result actions.
     * This creates a feedback loop: action -> effect -> API -> success/failure action -> reducer
     */
    this.effects.init(this.actions$, (action) => this.dispatch(action));
  }

  /**
   * Dispatch an action to the store.
   * This is the ONLY way to change state - ensures predictable state changes.
   * @param action - The action to dispatch
   */
  dispatch(action: Action): void {
    this.actions$.next(action);
  }

  /**
   * Get current state snapshot (synchronous).
   * Use sparingly - prefer subscribing to selectors for reactive updates.
   * @returns Current TodoState
   */
  getState(): TodoState {
    return this.state$.getValue();
  }
}
