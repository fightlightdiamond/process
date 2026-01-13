import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TabViewModule } from "primeng/tabview";
import { CardModule } from "primeng/card";
import { UserFacade } from "../../store/user.facade";
import { User } from "../../models/user.model";
import { UserListComponent } from "../user-list/user-list.component";
import { UserFormComponent } from "../user-form/user-form.component";

@Component({
  selector: "app-user-container",
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TabViewModule,
    CardModule,
    UserListComponent,
    UserFormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./user-container.component.html",
  styleUrl: "./user-container.component.css",
})
export class UserContainerComponent implements OnInit {
  users$ = this.userFacade.users$;
  loading$ = this.userFacade.loading$;
  error$ = this.userFacade.error$;

  showForm = false;
  selectedUser: User | null = null;
  formMode: "create" | "edit" = "create";

  constructor(private userFacade: UserFacade) {}

  ngOnInit() {
    this.userFacade.loadUsers();
  }

  onOpenCreateForm() {
    this.showForm = true;
    this.formMode = "create";
    this.selectedUser = null;
  }

  onEditUser(user: User) {
    this.showForm = true;
    this.formMode = "edit";
    this.selectedUser = user;
  }

  onDeleteUser(user: User) {
    this.userFacade.deleteUser(user.id);
  }

  onFormSubmit(data: Omit<User, "id"> | User) {
    if (this.formMode === "create") {
      this.userFacade.addUser(data as Omit<User, "id">);
    } else if (this.selectedUser) {
      this.userFacade.updateUser(
        this.selectedUser.id,
        data as Omit<User, "id">
      );
    }
    this.closeForm();
  }

  onFormCancel() {
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedUser = null;
  }
}
