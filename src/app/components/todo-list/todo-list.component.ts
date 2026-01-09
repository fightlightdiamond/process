import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';

/**
 * TodoListComponent - Presentational Component
 *
 * Displays a list of todo items with:
 * - Rendering of TodoItemComponent for each todo
 * - Empty state message when no todos
 * - Loading indicator support
 * - Event propagation from child TodoItemComponents
 *
 * This component does NOT inject any services.
 * All communication is via @Input and @Output only.
 */
@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  // Input: array of todos to display
  @Input() todos: Todo[] = [];

  // Input: loading state
  @Input() loading = false;

  // Output events - re-emit from TodoItemComponent
  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() update = new EventEmitter<{ id: string; title: string }>();
  @Output() editInForm = new EventEmitter<Todo>();

  /**
   * TrackBy function for optimal rendering performance
   * @param index - Index of the item
   * @param todo - Todo item
   * @returns Unique identifier for the todo
   */
  trackByTodoId(index: number, todo: Todo): string {
    return todo.id;
  }

  /**
   * Handle toggle event from TodoItemComponent
   * @param id - Todo id to toggle
   */
  onToggle(id: string): void {
    this.toggle.emit(id);
  }

  /**
   * Handle delete event from TodoItemComponent
   * @param id - Todo id to delete
   */
  onDelete(id: string): void {
    this.delete.emit(id);
  }

  /**
   * Handle update event from TodoItemComponent
   * @param data - Object containing id and new title
   */
  onUpdate(data: { id: string; title: string }): void {
    this.update.emit(data);
  }

  /**
   * Handle editInForm event from TodoItemComponent
   * @param todo - Todo to edit in form
   */
  onEditInForm(todo: Todo): void {
    this.editInForm.emit(todo);
  }
}
