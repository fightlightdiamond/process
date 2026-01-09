import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

import { Todo } from '../../models/todo.model';
import { TodoFacade } from '../../store/todo/todo.facade';

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

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    CardModule,
    InputGroupModule,
    InputGroupAddonModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  // Observables from facade
  todos$!: Observable<Todo[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  // Reactive Form for add/edit todo
  todoForm = new FormGroup({
    title: new FormControl('', [Validators.required, noWhitespaceValidator]),
  });

  // Reactive Form for inline edit
  inlineEditForm = new FormGroup({
    title: new FormControl('', [Validators.required, noWhitespaceValidator]),
  });

  // Edit mode state
  editingTodo: Todo | null = null;
  editingTodoId: string | null = null;

  constructor(private facade: TodoFacade) {}

  ngOnInit(): void {
    this.todos$ = this.facade.todos$;
    this.loading$ = this.facade.loading$;
    this.error$ = this.facade.error$;
  }

  /**
   * Handle form submission for add/update todo
   */
  onSubmit(): void {
    if (this.todoForm.valid) {
      const title = this.todoForm.get('title')?.value?.trim();
      if (title) {
        if (this.editingTodo) {
          this.facade.updateTodo(this.editingTodo.id, { title });
        } else {
          this.facade.addTodo(title);
        }
        this.resetForm();
      }
    }
  }

  /**
   * Start editing a todo - populate form with todo data
   */
  startEdit(todo: Todo): void {
    this.editingTodo = todo;
    this.todoForm.patchValue({ title: todo.title });
  }

  /**
   * Cancel editing and reset form
   */
  cancelEdit(): void {
    this.resetForm();
  }

  /**
   * Reset form to initial state
   */
  resetForm(): void {
    this.editingTodo = null;
    this.todoForm.reset();
  }

  /**
   * Toggle todo completed status
   */
  onToggleTodo(id: string): void {
    this.facade.toggleTodo(id);
  }

  /**
   * Delete a todo
   */
  onDeleteTodo(id: string): void {
    this.facade.deleteTodo(id);
  }

  /**
   * Handle inline edit start (double-click)
   */
  onStartInlineEdit(todo: Todo): void {
    this.editingTodoId = todo.id;
    this.inlineEditForm.patchValue({ title: todo.title });
  }

  /**
   * Save inline edit
   */
  onSaveInlineEdit(id: string): void {
    if (this.inlineEditForm.valid) {
      const title = this.inlineEditForm.get('title')?.value?.trim();
      if (title) {
        this.facade.updateTodo(id, { title });
      }
    }
    this.cancelInlineEdit();
  }

  /**
   * Cancel inline edit
   */
  cancelInlineEdit(): void {
    this.editingTodoId = null;
    this.inlineEditForm.reset();
  }

  /**
   * Handle keyboard events for inline edit
   */
  onEditKeydown(event: KeyboardEvent, id: string): void {
    if (event.key === 'Enter') {
      this.onSaveInlineEdit(id);
    } else if (event.key === 'Escape') {
      this.cancelInlineEdit();
    }
  }

  /**
   * Check if form title is invalid
   */
  get isTitleInvalid(): boolean {
    const titleControl = this.todoForm.get('title');
    return !!(titleControl?.invalid && titleControl?.touched);
  }
}
