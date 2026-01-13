import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { UserStore } from "./user.store";
import { loadUsers, addUser, updateUser, deleteUser } from "./user.actions";

@Injectable({ providedIn: "root" })
export class UserFacade {
  readonly users$ = this.store.users$;
  readonly loading$ = this.store.loading$;
  readonly error$ = this.store.error$;

  constructor(private store: UserStore) {
    this.loadUsers();
  }

  loadUsers(): void {
    this.store.dispatch(loadUsers());
  }

  addUser(data: Omit<User, "id">): void {
    this.store.dispatch(addUser(data));
  }

  updateUser(id: string, updates: Partial<User>): void {
    this.store.dispatch(updateUser({ id, updates }));
  }

  deleteUser(id: string): void {
    this.store.dispatch(deleteUser(id));
  }
}
