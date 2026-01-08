import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TodoComponent } from './todo.component';
import { TodoService } from '../../services/todo.service';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let todoService: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoComponent, NoopAnimationsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
    fixture.detectChanges();
  });

  describe('Rendering (Requirements 2.1, 2.2)', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should display empty state when no todos exist', () => {
      const emptyState = fixture.debugElement.query(By.css('.empty-state'));
      expect(emptyState).toBeTruthy();
    });

    it('should display todos from the service', fakeAsync(() => {
      todoService.addTodo('Test Todo 1');
      todoService.addTodo('Test Todo 2');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const todoItems = fixture.debugElement.queryAll(By.css('.todo-item'));
      expect(todoItems.length).toBe(2);
    }));

    it('should display todo title and completion status (Requirements 2.3)', fakeAsync(() => {
      todoService.addTodo('My Test Todo');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const todoTitle = fixture.debugElement.query(By.css('.todo-title'));
      expect(todoTitle.nativeElement.textContent.trim()).toBe('My Test Todo');

      const checkbox = fixture.debugElement.query(By.css('p-checkbox'));
      expect(checkbox).toBeTruthy();
    }));
  });

  describe('User Interactions', () => {
    it('should add a new todo when form is submitted', fakeAsync(() => {
      component.newTodoTitle = 'New Todo';
      component.onAddTodo();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const todos = todoService.getTodos();
      expect(todos.length).toBe(1);
      expect(todos[0].title).toBe('New Todo');
    }));

    it('should clear input after adding todo (Requirements 1.3)', fakeAsync(() => {
      component.newTodoTitle = 'New Todo';
      component.onAddTodo();
      fixture.detectChanges();
      tick();

      expect(component.newTodoTitle).toBe('');
    }));

    it('should not add empty todo', fakeAsync(() => {
      component.newTodoTitle = '   ';
      component.onAddTodo();
      fixture.detectChanges();
      tick();

      const todos = todoService.getTodos();
      expect(todos.length).toBe(0);
    }));

    it('should toggle todo completion status', fakeAsync(() => {
      todoService.addTodo('Toggle Test');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const todoId = todoService.getTodos()[0].id;
      component.onToggleTodo(todoId);
      fixture.detectChanges();
      tick();

      expect(todoService.getTodos()[0].completed).toBe(true);
    }));

    it('should delete a todo', fakeAsync(() => {
      todoService.addTodo('Delete Test');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const todoId = todoService.getTodos()[0].id;
      component.onDeleteTodo(todoId);
      fixture.detectChanges();
      tick();

      expect(todoService.getTodos().length).toBe(0);
    }));

    it('should start editing on double-click', fakeAsync(() => {
      todoService.addTodo('Edit Test');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const todo = todoService.getTodos()[0];
      component.onStartEdit(todo);
      fixture.detectChanges();

      expect(component.editingTodoId).toBe(todo.id);
      expect(component.editingTitle).toBe('Edit Test');
    }));

    it('should save edit on Enter key', fakeAsync(() => {
      todoService.addTodo('Original Title');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const todo = todoService.getTodos()[0];
      component.onStartEdit(todo);
      component.editingTitle = 'Updated Title';

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onEditKeydown(event, todo.id);
      fixture.detectChanges();
      tick();

      expect(todoService.getTodos()[0].title).toBe('Updated Title');
      expect(component.editingTodoId).toBeNull();
    }));

    it('should cancel edit on Escape key', fakeAsync(() => {
      todoService.addTodo('Original Title');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const todo = todoService.getTodos()[0];
      component.onStartEdit(todo);
      component.editingTitle = 'Changed Title';

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onEditKeydown(event, todo.id);
      fixture.detectChanges();
      tick();

      expect(todoService.getTodos()[0].title).toBe('Original Title');
      expect(component.editingTodoId).toBeNull();
    }));
  });

  describe('Reactive Updates (Requirements 2.2)', () => {
    it('should automatically update when todos change', fakeAsync(() => {
      todoService.addTodo('First Todo');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      let todoItems = fixture.debugElement.queryAll(By.css('.todo-item'));
      expect(todoItems.length).toBe(1);

      todoService.addTodo('Second Todo');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      todoItems = fixture.debugElement.queryAll(By.css('.todo-item'));
      expect(todoItems.length).toBe(2);
    }));
  });
});
