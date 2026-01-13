import { Injectable } from "@angular/core";
import { Subject, merge, of } from "rxjs";
import { filter, switchMap, map, catchError } from "rxjs/operators";
import { Action, User } from "../models/user.model";
import { UserApiService } from "../services/user-api.service";
import {
  UserActionTypes,
  loadUsersSuccess,
  loadUsersFailure,
  addUserSuccess,
  addUserFailure,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
} from "./user.actions";

@Injectable({ providedIn: "root" })
export class UserEffects {
  private dispatchFn: ((action: Action) => void) | null = null;

  constructor(private apiService: UserApiService) {}

  init(actions$: Subject<Action>, dispatch: (action: Action) => void): void {
    this.dispatchFn = dispatch;
    merge(
      this.loadEffect(actions$),
      this.addEffect(actions$),
      this.updateEffect(actions$),
      this.deleteEffect(actions$)
    ).subscribe((action) => action && this.dispatchFn?.(action));
  }

  private loadEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter((action) => action.type === UserActionTypes.LOAD_USERS),
      switchMap(() =>
        this.apiService.getAll().pipe(
          map((users: User[]) => loadUsersSuccess(users)),
          catchError((error) =>
            of(loadUsersFailure(error.error?.message || "Failed to load users"))
          )
        )
      )
    );
  }

  private addEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter((action) => action.type === UserActionTypes.ADD_USER),
      switchMap((action) =>
        this.apiService.create(action.payload as Omit<User, "id">).pipe(
          map((user: User) => addUserSuccess(user)),
          catchError((error) =>
            of(addUserFailure(error.error?.message || "Failed to add user"))
          )
        )
      )
    );
  }

  private updateEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter((action) => action.type === UserActionTypes.UPDATE_USER),
      switchMap((action) => {
        const { id, updates } = action.payload as {
          id: string;
          updates: Partial<User>;
        };
        return this.apiService.update(id, updates).pipe(
          map((user: User) => updateUserSuccess(user)),
          catchError((error) =>
            of(
              updateUserFailure(error.error?.message || "Failed to update user")
            )
          )
        );
      })
    );
  }

  private deleteEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter((action) => action.type === UserActionTypes.DELETE_USER),
      switchMap((action) =>
        this.apiService.delete(action.payload as string).pipe(
          map(() => deleteUserSuccess(action.payload as string)),
          catchError((error) =>
            of(
              deleteUserFailure(error.error?.message || "Failed to delete user")
            )
          )
        )
      )
    );
  }
}
