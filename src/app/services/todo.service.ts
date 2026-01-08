import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$: Observable<Todo[]> = this.todosSubject.asObservable();

  private generateId(): string {
    return crypto.randomUUID();
  }

  getTodos(): Todo[] {
    return this.todosSubject.getValue();
  }

  addTodo(title: string): boolean {
    if (!title || title.trim().length === 0) {
      return false;
    }
    const newTodo: Todo = {
      id: this.generateId(),
      title: title.trim(),
      completed: false,
    };
    const currentTodos = this.todosSubject.getValue();
    this.todosSubject.next([...currentTodos, newTodo]);
    return true;
  }

  toggleTodo(id: string): void {
    const currentTodos = this.todosSubject.getValue();
    const updatedTodos = currentTodos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.todosSubject.next(updatedTodos);
  }

  updateTodo(id: string, title: string): void {
    const currentTodos = this.todosSubject.getValue();
    const updatedTodos = currentTodos.map((todo) =>
      todo.id === id ? { ...todo, title } : todo
    );
    this.todosSubject.next(updatedTodos);
  }

  deleteTodo(id: string): void {
    const currentTodos = this.todosSubject.getValue();
    const updatedTodos = currentTodos.filter((todo) => todo.id !== id);
    this.todosSubject.next(updatedTodos);
  }
}
