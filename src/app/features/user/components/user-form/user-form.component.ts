import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { FileUploadModule } from "primeng/fileupload";
import { CardModule } from "primeng/card";
import { User } from "../../models/user.model";

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    CardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./user-form.component.html",
  styleUrl: "./user-form.component.css",
})
export class UserFormComponent implements OnInit {
  @Input() mode: "create" | "edit" = "create";
  @Input() initialUser?: User;
  @Output() readonly userSubmit = new EventEmitter<Omit<User, "id"> | User>();
  @Output() readonly formCancel = new EventEmitter<void>();

  form!: FormGroup;
  nameError: string | null = null;
  emailError: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.form.statusChanges.subscribe(() => {
      this.updateErrors();
    });
    if (this.initialUser && this.mode === "edit") {
      this.form.patchValue(this.initialUser);
    }
  }

  initForm() {
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      avatar: [""],
    });
  }

  updateErrors() {
    this.nameError = this.getNameError();
    this.emailError = this.getEmailError();
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (this.mode === "edit" && this.initialUser) {
        this.userSubmit.emit({ ...this.initialUser, ...formValue });
      } else {
        this.userSubmit.emit(formValue);
      }
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  get isEdit(): boolean {
    return this.mode === "edit";
  }

  get title(): string {
    return this.mode === "create" ? "Thêm User Mới" : "Sửa Thông Tin User";
  }

  getNameError(): string | null {
    const control = this.form.get("name");
    if (control?.hasError("required")) return "Tên là bắt buộc";
    if (control?.hasError("minlength")) return "Tên phải tối thiểu 2 ký tự";
    return null;
  }

  getEmailError(): string | null {
    const control = this.form.get("email");
    if (control?.hasError("required")) return "Email là bắt buộc";
    if (control?.hasError("email")) return "Email không hợp lệ";
    return null;
  }
}
