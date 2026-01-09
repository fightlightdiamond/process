import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import * as fc from 'fast-check';

import { TodoComponent, noWhitespaceValidator } from './todo.component';
import { TodoFacade } from '../../store/todo/todo.facade';
import { Todo } from '../../models/todo.model';

// Arbitrary for generating valid Todo objects
const todoArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
  completed: fc.boolean(),
});

// Arbitrary for generating whitespace-only strings
const whitespaceArbitrary = fc
  .array(fc.constantFrom(' ', '\t', '\n', '\r'), {
    minLength: 1,
    maxLength: 10,
  })
  .map((chars) => chars.join(''));

// Arbitrary for generating valid non-whitespace strings
const validTitleArbitrary = fc
  .string({ minLength: 1 })
  .filter((s) => s.trim().length > 0);

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let mockFacade: jasmine.SpyObj<TodoFacade>;
  let todosSubject: BehaviorSubject<Todo[]>;
  let loadingSubject: BehaviorSubject<boolean>;
  let errorSubject: BehaviorSubject<string | null>;

  beforeEach(async () => {
    todosSubject = new BehaviorSubject<Todo[]>([]);
    loadingSubject = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<string | null>(null);

    mockFacade = jasmine.createSpyObj('TodoFacade', [
      'loadTodos',
      'addTodo',
      'updateTodo',
      'toggleTodo',
      'deleteTodo',
    ]);

    Object.defineProperty(mockFacade, 'todos$', {
      get: () => todosSubject.asObservable(),
    });
    Object.defineProperty(mockFacade, 'loading$', {
      get: () => loadingSubject.asObservable(),
    });
    Object.defineProperty(mockFacade, 'error$', {
      get: () => errorSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [
        TodoComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [{ provide: TodoFacade, useValue: mockFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty form', () => {
      expect(component.todoForm.get('title')?.value).toBe('');
    });
  });

  /**
   * Feature: json-server-rxjs-store, Property 7: Form validation rejects empty/whitespace titles
   * Validates: Requirements 8.3
   */
  describe('Property 7: Form validation rejects empty/whitespace titles', () => {
    it('should reject whitespace-only strings', () => {
      fc.assert(
        fc.property(whitespaceArbitrary, (whitespaceString: string) => {
          component.todoForm.get('title')?.setValue(whitespaceString);
          component.todoForm.get('title')?.markAsTouched();

          // Whitespace-only strings should make form invalid
          expect(component.todoForm.invalid).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject empty string', () => {
      component.todoForm.get('title')?.setValue('');
      component.todoForm.get('title')?.markAsTouched();
      expect(component.todoForm.invalid).toBe(true);
    });

    it('should accept non-empty, non-whitespace strings', () => {
      fc.assert(
        fc.property(validTitleArbitrary, (validString: string) => {
          component.todoForm.get('title')?.setValue(validString);
          component.todoForm.get('title')?.markAsTouched();

          expect(component.todoForm.valid).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('noWhitespaceValidator should return error for whitespace-only strings', () => {
      fc.assert(
        fc.property(whitespaceArbitrary, (whitespaceString: string) => {
          const control = new FormControl(whitespaceString);
          const result = noWhitespaceValidator(control);
          expect(result).toEqual({ whitespace: true });
        }),
        { numRuns: 100 }
      );
    });

    it('noWhitespaceValidator should return null for valid strings', () => {
      fc.assert(
        fc.property(validTitleArbitrary, (validString: string) => {
          const control = new FormControl(validString);
          const result = noWhitespaceValidator(control);
          expect(result).toBeNull();
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: json-server-rxjs-store, Property 8: Form populates correctly when editing
   * Validates: Requirements 8.5
   */
  describe('Property 8: Form populates correctly when editing', () => {
    it('should populate form with todo title when editing', () => {
      fc.assert(
        fc.property(todoArbitrary, (todo: Todo) => {
          component.startEdit(todo);

          expect(component.editingTodo).toEqual(todo);
          expect(component.todoForm.get('title')?.value).toBe(todo.title);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: json-server-rxjs-store, Property 9: Form resets after successful submission
   * Validates: Requirements 8.6
   */
  describe('Property 9: Form resets after successful submission', () => {
    it('should reset form after adding new todo', () => {
      fc.assert(
        fc.property(validTitleArbitrary, (validTitle: string) => {
          // Set up form with valid title
          component.todoForm.get('title')?.setValue(validTitle);
          component.todoForm.get('title')?.markAsTouched();

          // Submit form
          component.onSubmit();

          // Form should be reset
          expect(component.todoForm.get('title')?.value).toBeFalsy();
          expect(component.editingTodo).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('should reset form after editing submission', () => {
      fc.assert(
        fc.property(
          todoArbitrary,
          validTitleArbitrary,
          (todo: Todo, newTitle: string) => {
            // Start editing
            component.startEdit(todo);

            // Change title
            component.todoForm.get('title')?.setValue(newTitle);

            // Submit
            component.onSubmit();

            // Form should be reset
            expect(component.todoForm.get('title')?.value).toBeFalsy();
            expect(component.editingTodo).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: json-server-rxjs-store, Property 10: Component displays loading state
   * Validates: Requirements 9.7
   */
  describe('Property 10: Component displays loading state', () => {
    it('should display loading indicator when loading$ is true', fakeAsync(() => {
      loadingSubject.next(true);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const loadingContainer = fixture.debugElement.query(
        By.css('.loading-container')
      );
      expect(loadingContainer).toBeTruthy();

      const spinner = fixture.debugElement.query(By.css('p-progressSpinner'));
      expect(spinner).toBeTruthy();
    }));

    it('should hide loading indicator when loading$ is false', fakeAsync(() => {
      loadingSubject.next(false);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const loadingContainer = fixture.debugElement.query(
        By.css('.loading-container')
      );
      expect(loadingContainer).toBeFalsy();
    }));
  });

  /**
   * Feature: json-server-rxjs-store, Property 11: Component displays error state
   * Validates: Requirements 9.6
   */
  describe('Property 11: Component displays error state', () => {
    it('should display error message when error$ has value', fakeAsync(() => {
      const errorMessage = 'Test error message';
      errorSubject.next(errorMessage);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('p-message'));
      expect(errorElement).toBeTruthy();
    }));

    it('should hide error message when error$ is null', fakeAsync(() => {
      errorSubject.next(null);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('p-message'));
      expect(errorElement).toBeFalsy();
    }));
  });

  describe('Facade Integration', () => {
    it('should call facade.addTodo when submitting new todo', () => {
      const title = 'New Todo';
      component.todoForm.get('title')?.setValue(title);
      component.onSubmit();

      expect(mockFacade.addTodo).toHaveBeenCalledWith(title);
    });

    it('should call facade.updateTodo when submitting edited todo', () => {
      const todo: Todo = { id: '1', title: 'Original', completed: false };
      component.startEdit(todo);

      const newTitle = 'Updated';
      component.todoForm.get('title')?.setValue(newTitle);
      component.onSubmit();

      expect(mockFacade.updateTodo).toHaveBeenCalledWith('1', {
        title: newTitle,
      });
    });

    it('should call facade.toggleTodo when toggling', () => {
      component.onToggleTodo('1');
      expect(mockFacade.toggleTodo).toHaveBeenCalledWith('1');
    });

    it('should call facade.deleteTodo when deleting', () => {
      component.onDeleteTodo('1');
      expect(mockFacade.deleteTodo).toHaveBeenCalledWith('1');
    });
  });

  describe('Todo List Display', () => {
    it('should display todos from facade', fakeAsync(() => {
      const todos: Todo[] = [
        { id: '1', title: 'Todo 1', completed: false },
        { id: '2', title: 'Todo 2', completed: true },
      ];
      todosSubject.next(todos);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const todoItems = fixture.debugElement.queryAll(By.css('.todo-item'));
      expect(todoItems.length).toBe(2);
    }));

    it('should display empty state when no todos', fakeAsync(() => {
      todosSubject.next([]);
      loadingSubject.next(false);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.css('.empty-state'));
      expect(emptyState).toBeTruthy();
    }));
  });
});
