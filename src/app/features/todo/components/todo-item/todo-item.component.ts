/**
 * @Project       NgSSR Todo App
 * @BD_ID         TODO-001
 * @Description   Presentational component for single Todo item display
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
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";

import { Todo } from "../../models";

/**
 * TodoItemComponent - Presentational Component
 *
 * Displays a single todo item with:
 * - Checkbox for toggle completed status
 * - Title display with inline edit on double-click
 * - Action buttons for edit (in form) and delete
 *
 * This component does NOT inject any services.
 * All communication is via @Input and @Output only.
 */
@Component({
  selector: "app-todo-item",
  standalone: true,
  imports: [FormsModule, ButtonModule, CheckboxModule, InputTextModule],
  templateUrl: "./todo-item.component.html",
  styleUrl: "./todo-item.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent implements AfterViewChecked {
  // Input: the todo item to display
  @Input({ required: true }) todo!: Todo;

  // Output events
  @Output() readonly toggle = new EventEmitter<string>();
  @Output() readonly delete = new EventEmitter<string>();
  @Output() readonly update = new EventEmitter<{ id: string; title: string }>();
  @Output() readonly editInForm = new EventEmitter<Todo>();

  // ViewChild for programmatic focus
  @ViewChild("editInput") editInput?: ElementRef<HTMLInputElement>;

  // Internal state for inline editing
  isEditing = false;
  editTitle = "";
  private shouldFocus = false;

  /**
   * Focus input after view is checked (when entering edit mode)
   */
  ngAfterViewChecked(): void {
    if (this.shouldFocus && this.editInput) {
      this.editInput.nativeElement.focus();
      this.shouldFocus = false;
    }
  }

  /**
   * Handle checkbox click - emit toggle event
   */
  onToggle(): void {
    this.toggle.emit(this.todo.id);
  }

  /**
   * Handle delete button click - emit delete event
   */
  onDelete(): void {
    this.delete.emit(this.todo.id);
  }

  /**
   * Handle edit button click - emit editInForm event
   */
  onEditInForm(): void {
    this.editInForm.emit(this.todo);
  }

  /**
   * Start inline editing on double-click
   */
  onStartInlineEdit(): void {
    this.isEditing = true;
    this.editTitle = this.todo.title;
    this.shouldFocus = true;
  }

  /**
   * Save inline edit - emit update event if title changed and valid
   */
  onSaveInlineEdit(): void {
    const trimmedTitle = this.editTitle.trim();
    if (trimmedTitle && trimmedTitle !== this.todo.title) {
      this.update.emit({ id: this.todo.id, title: trimmedTitle });
    }
    this.cancelInlineEdit();
  }

  /**
   * Cancel inline editing
   */
  cancelInlineEdit(): void {
    this.isEditing = false;
    this.editTitle = "";
  }

  /**
   * Handle keyboard events during inline edit
   */
  onEditKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.onSaveInlineEdit();
    } else if (event.key === "Escape") {
      this.cancelInlineEdit();
    }
  }
}
