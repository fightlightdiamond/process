import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { User } from "../../models/user.model";

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./user-list.component.html",
  styleUrl: "./user-list.component.css",
})
export class UserListComponent {
  @Input() users: User[] = [];
  @Output() readonly editUser = new EventEmitter<User>();
  @Output() readonly deleteUser = new EventEmitter<User>();

  constructor(private confirmationService: ConfirmationService) {}

  confirmDelete(event: Event, user: User) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Bạn chắc chắn muốn xóa user "${user.name}"?`,
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteUser.emit(user);
      },
    });
  }
}
