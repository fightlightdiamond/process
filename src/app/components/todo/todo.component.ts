import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    CardModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  todos$!: Observable<Todo[]>;
  newTodoTitle = '';
  editingTodoId: string | null = null;
  editingTitle = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todos$ = this.todoService.todos$;
  }

  onAddTodo(): void {
    if (this.todoService.addTodo(this.newTodoTitle)) {
      this.newTodoTitle = '';
    }
  }

  onToggleTodo(id: string): void {
    this.todoService.toggleTodo(id);
  }

  onDeleteTodo(id: string): void {
    this.todoService.deleteTodo(id);
  }

  onStartEdit(todo: Todo): void {
    this.editingTodoId = todo.id;
    this.editingTitle = todo.title;
  }

  onSaveEdit(id: string): void {
    if (this.editingTitle.trim()) {
      this.todoService.updateTodo(id, this.editingTitle.trim());
    }
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingTodoId = null;
    this.editingTitle = '';
  }

  onEditKeydown(event: KeyboardEvent, id: string): void {
    if (event.key === 'Enter') {
      this.onSaveEdit(id);
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }
}
