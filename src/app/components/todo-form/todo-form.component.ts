import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { Todo } from '../../models/todo.model';

/**
 * Custom validator to reject whitespace-only strings
 */
export function noWhitespaceValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value && control.value.trim().length === 0) {
    return { whitespace: true };
  }
  return null;
}

/**
 * TodoFormComponent - Presentational Component
 *
 * Displays a form for adding or editing todos with:
 * - Input field for todo title
 * - Submit button (Add/Update based on mode)
 * - Cancel button (visible in edit mode)
 * - Validation error messages
 *
 * This component does NOT inject any services.
 * All communication is via @Input and @Output only.
 */
@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFormComponent implements OnChanges {
  // Input: the todo being edited (null for add mode)
  @Input() editingTodo: Todo | null = null;

  // Output events
  @Output() submitTodo = new EventEmitter<string>();
  @Output() cancelEdit = new EventEmitter<void>();

  // Reactive Form
  todoForm = new FormGroup({
    title: new FormControl('', [Validators.required, noWhitespaceValidator]),
  });

  /**
   * Check if we're in edit mode
   */
  get isEditMode(): boolean {
    return this.editingTodo !== null;
  }

  /**
   * Check if form title is invalid and touched
   */
  get isTitleInvalid(): boolean {
    const titleControl = this.todoForm.get('title');
    return !!(titleControl?.invalid && titleControl?.touched);
  }

  /**
   * Get the error message for title field
   */
  get titleErrorMessage(): string {
    const titleControl = this.todoForm.get('title');
    if (titleControl?.hasError('required')) {
      return 'Title is required';
    }
    if (titleControl?.hasError('whitespace')) {
      return 'Title cannot be only whitespace';
    }
    return '';
  }

  /**
   * React to changes in editingTodo input
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingTodo']) {
      if (this.editingTodo) {
        // Populate form with todo title when editing
        this.todoForm.patchValue({ title: this.editingTodo.title });
      } else {
        // Reset form when not editing
        this.todoForm.reset();
      }
    }
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.todoForm.valid) {
      const title = this.todoForm.get('title')?.value?.trim();
      if (title) {
        this.submitTodo.emit(title);
        this.todoForm.reset();
      }
    } else {
      // Mark as touched to show validation errors
      this.todoForm.markAllAsTouched();
    }
  }

  /**
   * Handle cancel button click
   */
  onCancel(): void {
    this.cancelEdit.emit();
    this.todoForm.reset();
  }
}
