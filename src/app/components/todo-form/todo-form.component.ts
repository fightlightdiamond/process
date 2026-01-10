/**
 * @Project       NgSSR Todo App
 * @BD_ID         TODO-001
 * @Description   Presentational component for Todo form (add/edit)
 * @Author        developer
 * @CreatedDate   2026-01-09
 * @Updater       developer
 * @LastUpdated   2026-01-09
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";

import { Todo } from "../../models/todo.model";
import {
  noWhitespaceValidator,
  maxLengthTrimmedValidator,
  TODO_VALIDATION,
  sanitizeString,
  FORM_ERROR_MESSAGES,
} from "../../shared";

/**
 * TodoFormComponent - Presentational Component
 *
 * Displays a form for adding or editing todos with:
 * - Input field for todo title
 * - Submit button (Add/Update based on mode)
 * - Cancel button (visible in edit mode only)
 * - Validation error messages
 *
 * PRESENTATIONAL COMPONENT RULES:
 * - Does NOT inject any services
 * - All communication is via @Input and @Output only
 * - Uses OnPush change detection for performance
 * - Can be tested without mocking services
 */
@Component({
  selector: "app-todo-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: "./todo-form.component.html",
  styleUrl: "./todo-form.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFormComponent implements OnChanges {
  /**
   * Input: the todo being edited.
   * - null = Add mode (create new todo)
   * - Todo object = Edit mode (update existing todo)
   */
  @Input() editingTodo: Todo | null = null;

  /** Output: Emits trimmed title string when form is submitted */
  @Output() readonly submitTodo = new EventEmitter<string>();

  /** Output: Emits when user cancels edit mode */
  @Output() readonly cancelEdit = new EventEmitter<void>();

  /** Maximum length for title (exposed for template) */
  readonly maxTitleLength = TODO_VALIDATION.TITLE_MAX_LENGTH;

  /**
   * Reactive Form with validation:
   * - required: Title cannot be empty
   * - noWhitespaceValidator: Title cannot be only whitespace
   * - maxLengthTrimmedValidator: Title cannot exceed max length
   */
  todoForm = new FormGroup({
    title: new FormControl("", [
      Validators.required,
      noWhitespaceValidator,
      maxLengthTrimmedValidator(TODO_VALIDATION.TITLE_MAX_LENGTH),
    ]),
  });

  /**
   * Check if we're in edit mode (editingTodo is set)
   */
  get isEditMode(): boolean {
    return this.editingTodo !== null;
  }

  /**
   * Check if form title is invalid AND has been touched.
   * We only show errors after user interaction to avoid showing
   * errors on initial render.
   */
  get isTitleInvalid(): boolean {
    const titleControl = this.todoForm.get("title");
    return !!(titleControl?.invalid && titleControl?.touched);
  }

  /**
   * Get the appropriate error message for title field.
   * Priority: required > whitespace > maxLength (check in order)
   */
  get titleErrorMessage(): string {
    const titleControl = this.todoForm.get("title");
    if (titleControl?.hasError("required")) {
      return FORM_ERROR_MESSAGES.TITLE_REQUIRED;
    }
    if (titleControl?.hasError("whitespace")) {
      return FORM_ERROR_MESSAGES.TITLE_WHITESPACE;
    }
    if (titleControl?.hasError("maxLengthTrimmed")) {
      return FORM_ERROR_MESSAGES.TITLE_MAX_LENGTH(this.maxTitleLength);
    }
    return "";
  }

  /**
   * React to changes in editingTodo input.
   *
   * IMPORTANT: This handles the transition between add/edit modes:
   * - When editingTodo changes to a Todo: populate form with its title
   * - When editingTodo changes to null: reset form for new entry
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["editingTodo"]) {
      if (this.editingTodo) {
        // Edit mode: populate form with existing todo title
        this.todoForm.patchValue({ title: this.editingTodo.title });
      } else {
        // Add mode: clear form for new entry
        this.todoForm.reset();
      }
    }
  }

  /**
   * Handle form submission.
   *
   * VALIDATION FLOW:
   * 1. If form is valid: sanitize and emit title, then reset form
   * 2. If form is invalid: mark all fields as touched to show errors
   *
   * sanitizeString() ensures:
   * - Trimmed (no leading/trailing whitespace)
   * - No dangerous HTML characters
   * - Within max length limit
   */
  onSubmit(): void {
    if (this.todoForm.valid) {
      const rawTitle = this.todoForm.get("title")?.value;
      const title = sanitizeString(rawTitle);
      if (title) {
        this.submitTodo.emit(title);
        this.todoForm.reset();
      }
    } else {
      // Show validation errors by marking fields as touched
      this.todoForm.markAllAsTouched();
    }
  }

  /**
   * Handle cancel button click.
   * Emits cancelEdit event and resets form to clear any partial input.
   */
  onCancel(): void {
    this.cancelEdit.emit();
    this.todoForm.reset();
  }
}
