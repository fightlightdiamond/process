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
import {
  USER_FORM_TITLE_CREATE,
  USER_FORM_TITLE_EDIT,
  USER_FORM_ERROR_NAME_REQUIRED,
  USER_FORM_ERROR_NAME_MIN_LENGTH,
  USER_FORM_ERROR_EMAIL_REQUIRED,
  USER_FORM_ERROR_EMAIL_INVALID,
} from "../../constants";

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
    return this.mode === "create"
      ? USER_FORM_TITLE_CREATE
      : USER_FORM_TITLE_EDIT;
  }

  getNameError(): string | null {
    const control = this.form.get("name");
    if (control?.hasError("required")) return USER_FORM_ERROR_NAME_REQUIRED;
    if (control?.hasError("minlength")) return USER_FORM_ERROR_NAME_MIN_LENGTH;
    return null;
  }

  getEmailError(): string | null {
    const control = this.form.get("email");
    if (control?.hasError("required")) return USER_FORM_ERROR_EMAIL_REQUIRED;
    if (control?.hasError("email")) return USER_FORM_ERROR_EMAIL_INVALID;
    return null;
  }
}
