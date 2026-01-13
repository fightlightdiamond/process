import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";
import { UserState, Action } from "../models/user.model";
import { userReducer, initialState } from "./user.reducer";
import { UserEffects } from "./user.effects";

@Injectable({ providedIn: "root" })
export class UserStore {
  private readonly state$ = new BehaviorSubject<UserState>(initialState);
  private readonly actions$ = new Subject<Action>();

  readonly users$ = this.state$.pipe(
    map((s) => s.users),
    distinctUntilChanged()
  );
  readonly loading$ = this.state$.pipe(
    map((s) => s.loading),
    distinctUntilChanged()
  );
  readonly error$ = this.state$.pipe(
    map((s) => s.error),
    distinctUntilChanged()
  );

  constructor(private effects: UserEffects) {
    this.effects.init(this.actions$, (action) => this.dispatch(action));
  }

  dispatch(action: Action): void {
    const newState = userReducer(this.state$.getValue(), action);
    this.state$.next(newState);
    this.actions$.next(action);
  }

  getState(): UserState {
    return this.state$.getValue();
  }
}
