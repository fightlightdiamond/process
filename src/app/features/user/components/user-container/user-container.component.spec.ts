import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { UserContainerComponent } from "./user-container.component";
import { UserFacade } from "../../store/user.facade";
import { User } from "../../models/user.model";

describe("UserContainerComponent", () => {
  let component: UserContainerComponent;
  let fixture: ComponentFixture<UserContainerComponent>;
  let mockUserFacade: jasmine.SpyObj<UserFacade>;

  beforeEach(async () => {
    mockUserFacade = jasmine.createSpyObj(
      "UserFacade",
      ["loadUsers", "addUser", "updateUser", "deleteUser"],
      {
        users$: of([]),
        loading$: of(false),
        error$: of(null),
      }
    );

    await TestBed.configureTestingModule({
      imports: [UserContainerComponent],
      providers: [{ provide: UserFacade, useValue: mockUserFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load users on init", () => {
    expect(mockUserFacade.loadUsers).toHaveBeenCalled();
  });

  it("should open create form", () => {
    component.onOpenCreateForm();

    expect(component.showForm).toBeTruthy();
    expect(component.formMode).toBe("create");
    expect(component.selectedUser).toBeNull();
  });

  it("should open edit form with selected user", () => {
    const user: User = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
    };

    component.onEditUser(user);

    expect(component.showForm).toBeTruthy();
    expect(component.formMode).toBe("edit");
    expect(component.selectedUser).toBe(user);
  });

  it("should call deleteUser on facade when deleting user", () => {
    const user: User = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
    };

    component.onDeleteUser(user);

    expect(mockUserFacade.deleteUser).toHaveBeenCalledWith(user.id);
  });

  it("should call addUser on facade when creating new user", () => {
    const newUser = { name: "New User", email: "new@example.com" };
    component.formMode = "create";

    component.onFormSubmit(newUser);

    expect(mockUserFacade.addUser).toHaveBeenCalledWith(newUser);
    expect(component.showForm).toBeFalsy();
  });

  it("should call updateUser on facade when updating user", () => {
    const user: User = {
      id: "1",
      name: "Updated User",
      email: "updated@example.com",
    };
    component.formMode = "edit";
    component.selectedUser = user;

    component.onFormSubmit(user);

    expect(mockUserFacade.updateUser).toHaveBeenCalledWith(
      user.id,
      jasmine.any(Object)
    );
    expect(component.showForm).toBeFalsy();
  });

  it("should close form on cancel", () => {
    component.showForm = true;
    component.selectedUser = {
      id: "1",
      name: "Test",
      email: "test@example.com",
    };

    component.onFormCancel();

    expect(component.showForm).toBeFalsy();
    expect(component.selectedUser).toBeNull();
  });
});
