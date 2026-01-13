import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { UserFormComponent } from "./user-form.component";
import { User } from "../../models/user.model";

describe("UserFormComponent", () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form in create mode", () => {
    expect(component.form).toBeDefined();
    expect(component.mode).toBe("create");
  });

  it("should initialize form in edit mode with user data", () => {
    const mockUser: User = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
    };
    component.mode = "edit";
    component.initialUser = mockUser;

    component.ngOnInit();

    expect(component.form.get("name")?.value).toBe("Test User");
    expect(component.form.get("email")?.value).toBe("test@example.com");
  });

  it("should validate required fields", () => {
    const nameControl = component.form.get("name");
    nameControl?.setValue("");

    expect(nameControl?.hasError("required")).toBeTruthy();
  });

  it("should validate email format", () => {
    const emailControl = component.form.get("email");
    emailControl?.setValue("invalid-email");

    expect(emailControl?.hasError("email")).toBeTruthy();
  });

  it("should emit userSubmit with form data on submit", () => {
    spyOn(component.userSubmit, "emit");
    component.form.patchValue({
      name: "New User",
      email: "new@example.com",
      avatar: "http://example.com/avatar.jpg",
    });

    component.onSubmit();

    expect(component.userSubmit.emit).toHaveBeenCalledWith({
      name: "New User",
      email: "new@example.com",
      avatar: "http://example.com/avatar.jpg",
    });
  });

  it("should emit formCancel when cancel is clicked", () => {
    spyOn(component.formCancel, "emit");

    component.onCancel();

    expect(component.formCancel.emit).toHaveBeenCalled();
  });

  it("should display correct title for create mode", () => {
    component.mode = "create";
    expect(component.title).toBe("Thêm User Mới");
  });

  it("should display correct title for edit mode", () => {
    component.mode = "edit";
    expect(component.title).toBe("Sửa Thông Tin User");
  });
});
