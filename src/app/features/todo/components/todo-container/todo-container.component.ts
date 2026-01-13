/**
 * @Project       NgSSR Todo App
 * @BD_ID         TODO-001
 * @Description   Container component - connects store to presentational components
 * @Author        developer
 * @CreatedDate   2026-01-09
 * @Updater       developer
 * @LastUpdated   2026-01-09
 */

import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { Observable } from "rxjs";

import { ProgressSpinnerModule } from "primeng/progressspinner";
import { MessageModule } from "primeng/message";
import { CardModule } from "primeng/card";

import { Todo } from "../../models";
import { TodoFacade } from "../../store";
import { TodoFormComponent } from "../todo-form/todo-form.component";
import { TodoListComponent } from "../todo-list/todo-list.component";
import { GridModule } from "../../../../shared/grid/grid.module";

/**
 * TodoContainerComponent - Container/Smart Component
 *
 * This is the smart component that:
 * - Injects TodoFacade to interact with the store
 * - Subscribes to todos$, loading$, error$ from facade
 * - Manages editingTodo state
 * - Handles events from child presentational components
 * - Calls appropriate facade methods
 *
 * This component is the ONLY component that connects to the store/facade.
 */
@Component({
  selector: "app-todo-container",
  standalone: true,
  imports: [
    AsyncPipe,
    ProgressSpinnerModule,
    MessageModule,
    CardModule,
    TodoFormComponent,
    TodoListComponent,
    GridModule,
  ],
  templateUrl: "./todo-container.component.html",
  styleUrl: "./todo-container.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoContainerComponent implements OnInit {
  // Observables from facade
  todos$!: Observable<Todo[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  // Local state for editing
  editingTodo: Todo | null = null;

  constructor(private facade: TodoFacade) {}

  ngOnInit(): void {
    this.todos$ = this.facade.todos$;
    this.loading$ = this.facade.loading$;
    this.error$ = this.facade.error$;
  }

  /**
   * Handle submitTodo event from TodoFormComponent
   * If editingTodo exists, update the todo; otherwise, add a new todo
   * @param title - The title of the todo
   */
  onSubmitTodo(title: string): void {
    if (this.editingTodo) {
      this.facade.updateTodo(this.editingTodo.id, { title });
      this.editingTodo = null;
    } else {
      this.facade.addTodo(title);
    }
  }

  /**
   * Handle cancelEdit event from TodoFormComponent
   */
  onCancelEdit(): void {
    this.editingTodo = null;
  }

  /**
   * Handle toggle event from TodoListComponent
   * @param id - The id of the todo to toggle
   */
  onToggle(id: string): void {
    this.facade.toggleTodo(id);
  }

  /**
   * Handle delete event from TodoListComponent
   * @param id - The id of the todo to delete
   */
  onDelete(id: string): void {
    this.facade.deleteTodo(id);
  }

  /**
   * Handle update event from TodoListComponent (inline edit)
   * @param data - Object containing id and new title
   */
  onUpdate(data: { id: string; title: string }): void {
    this.facade.updateTodo(data.id, { title: data.title });
  }

  /**
   * Handle editInForm event from TodoListComponent
   * Sets the editingTodo to be edited in the form
   * @param todo - The todo to edit in form
   */
  onEditInForm(todo: Todo): void {
    this.editingTodo = todo;
  }
}
