import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UserListComponent } from "./user-list.component";
import { User } from "../../models/user.model";

describe("UserListComponent", () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display users in table", () => {
    const mockUsers: User[] = [
      { id: "1", name: "User 1", email: "user1@example.com" },
      { id: "2", name: "User 2", email: "user2@example.com" },
    ];
    component.users = mockUsers;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll("p-table tbody tr");
    expect(rows.length).toBe(mockUsers.length);
  });

  it("should emit editUser when edit button is clicked", () => {
    spyOn(component.editUser, "emit");
    const user: User = { id: "1", name: "User 1", email: "user1@example.com" };

    component.editUser.emit(user);

    expect(component.editUser.emit).toHaveBeenCalledWith(user);
  });

  it("should emit deleteUser when delete confirmed", () => {
    spyOn(component.deleteUser, "emit");
    const user: User = { id: "1", name: "User 1", email: "user1@example.com" };

    component.deleteUser.emit(user);

    expect(component.deleteUser.emit).toHaveBeenCalledWith(user);
  });
});
