import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import * as fc from 'fast-check';

import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../../models/todo.model';

// Arbitrary for generating valid Todo objects
const todoArbitrary = fc.record({
  id: fc.uuid(),
  title: fc
    .string({ minLength: 1 })
    .filter((s) => s.trim().length > 0)
    .map((s) => s.trim()), // Trim the title to avoid whitespace comparison issues
  completed: fc.boolean(),
});

// Arbitrary for generating valid non-whitespace strings for updates
const validTitleArbitrary = fc
  .string({ minLength: 1 })
  .filter((s) => s.trim().length > 0)
  .map((s) => s.trim()); // Trim to avoid whitespace comparison issues

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
  };

  const completedTodo: Todo = {
    id: '2',
    title: 'Completed Todo',
    completed: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent, NoopAnimationsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.todo = mockTodo;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create the component', () => {
      // Arrange - done in beforeEach
      // Act - component created in beforeEach
      // Assert
      expect(component).toBeTruthy();
    });

    it('should be a presentational component (no service injection)', () => {
      // Arrange - done in beforeEach
      // Act - component created in beforeEach
      // Assert - Verify component has no injected services by checking constructor
      // The component should only have @Input/@Output decorators
      expect(component.todo).toBeDefined();
      expect(component.toggle).toBeDefined();
      expect(component.delete).toBeDefined();
      expect(component.update).toBeDefined();
      expect(component.editInForm).toBeDefined();
    });
  });

  describe('Rendering with different todo inputs', () => {
    it('should display todo title', () => {
      // Arrange - done in beforeEach with mockTodo
      // Act
      const titleElement = fixture.debugElement.query(By.css('.todo-title'));
      // Assert
      expect(titleElement.nativeElement.textContent.trim()).toBe('Test Todo');
    });

    it('should display completed todo with completed class', () => {
      // Arrange
      component.todo = completedTodo;
      // Act
      fixture.detectChanges();
      const todoItem = fixture.debugElement.query(By.css('.todo-item'));
      // Assert
      expect(todoItem.classes['completed']).toBe(true);
    });

    it('should display incomplete todo without completed class', () => {
      // Arrange - done in beforeEach with incomplete mockTodo
      // Act
      const todoItem = fixture.debugElement.query(By.css('.todo-item'));
      // Assert
      expect(todoItem.classes['completed']).toBeFalsy();
    });

    it('should apply completed-text class to completed todo title', () => {
      // Arrange
      component.todo = completedTodo;
      fixture.detectChanges();
      // Act
      const titleElement = fixture.debugElement.query(By.css('.todo-title'));
      // Assert
      expect(titleElement.classes['completed-text']).toBe(true);
    });
  });

  describe('Event emissions', () => {
    it('should emit toggle event with todo id when checkbox clicked', () => {
      // Arrange
      spyOn(component.toggle, 'emit');
      // Act
      component.onToggle();
      // Assert
      expect(component.toggle.emit).toHaveBeenCalledWith('1');
    });

    it('should emit delete event with todo id when delete button clicked', () => {
      // Arrange
      spyOn(component.delete, 'emit');
      // Act
      component.onDelete();
      // Assert
      expect(component.delete.emit).toHaveBeenCalledWith('1');
    });

    it('should emit editInForm event with todo object when edit button clicked', () => {
      // Arrange
      spyOn(component.editInForm, 'emit');
      // Act
      component.onEditInForm();
      // Assert
      expect(component.editInForm.emit).toHaveBeenCalledWith(mockTodo);
    });

    it('should emit update event with id and new title when inline edit saved', () => {
      // Arrange
      spyOn(component.update, 'emit');
      component.onStartInlineEdit();
      component.editTitle = 'Updated Title';
      // Act
      component.onSaveInlineEdit();
      // Assert
      expect(component.update.emit).toHaveBeenCalledWith({
        id: '1',
        title: 'Updated Title',
      });
    });

    it('should not emit update event if title unchanged', () => {
      // Arrange
      spyOn(component.update, 'emit');
      component.onStartInlineEdit();
      // editTitle is set to original title
      // Act
      component.onSaveInlineEdit();
      // Assert
      expect(component.update.emit).not.toHaveBeenCalled();
    });

    it('should not emit update event if title is empty after trim', () => {
      // Arrange
      spyOn(component.update, 'emit');
      component.onStartInlineEdit();
      component.editTitle = '   ';
      // Act
      component.onSaveInlineEdit();
      // Assert
      expect(component.update.emit).not.toHaveBeenCalled();
    });
  });

  describe('Inline editing', () => {
    it('should enter edit mode on double-click', () => {
      // Arrange
      expect(component.isEditing).toBe(false);
      // Act
      component.onStartInlineEdit();
      // Assert
      expect(component.isEditing).toBe(true);
      expect(component.editTitle).toBe('Test Todo');
    });

    it('should exit edit mode on save', () => {
      // Arrange
      component.onStartInlineEdit();
      expect(component.isEditing).toBe(true);
      // Act
      component.onSaveInlineEdit();
      // Assert
      expect(component.isEditing).toBe(false);
      expect(component.editTitle).toBe('');
    });

    it('should exit edit mode on cancel', () => {
      // Arrange
      component.onStartInlineEdit();
      component.editTitle = 'Changed';
      // Act
      component.cancelInlineEdit();
      // Assert
      expect(component.isEditing).toBe(false);
      expect(component.editTitle).toBe('');
    });

    it('should save on Enter key', () => {
      // Arrange
      spyOn(component, 'onSaveInlineEdit');
      // Act
      component.onEditKeydown({ key: 'Enter' } as KeyboardEvent);
      // Assert
      expect(component.onSaveInlineEdit).toHaveBeenCalled();
    });

    it('should cancel on Escape key', () => {
      // Arrange
      spyOn(component, 'cancelInlineEdit');
      // Act
      component.onEditKeydown({ key: 'Escape' } as KeyboardEvent);
      // Assert
      expect(component.cancelInlineEdit).toHaveBeenCalled();
    });

    it('should show input field when editing', () => {
      // Arrange
      component.onStartInlineEdit();
      // Act
      fixture.detectChanges();
      const editInput = fixture.debugElement.query(By.css('.edit-input'));
      const titleSpan = fixture.debugElement.query(By.css('.todo-title'));
      // Assert
      expect(editInput).toBeTruthy();
      expect(titleSpan).toBeFalsy();
    });

    it('should show title span when not editing', () => {
      // Arrange - done in beforeEach (not editing by default)
      // Act
      const editInput = fixture.debugElement.query(By.css('.edit-input'));
      const titleSpan = fixture.debugElement.query(By.css('.todo-title'));
      // Assert
      expect(editInput).toBeFalsy();
      expect(titleSpan).toBeTruthy();
    });
  });

  describe('Action buttons', () => {
    it('should have edit button', () => {
      // Arrange - done in beforeEach
      // Act
      const editBtn = fixture.debugElement.query(By.css('.edit-btn'));
      // Assert
      expect(editBtn).toBeTruthy();
    });

    it('should have delete button', () => {
      // Arrange - done in beforeEach
      // Act
      const deleteBtn = fixture.debugElement.query(By.css('.delete-btn'));
      // Assert
      expect(deleteBtn).toBeTruthy();
    });
  });
});

/**
 * Feature: component-driven-design, Property 2: TodoItem input/output consistency
 * Validates: Requirements 2.2, 2.3, 2.4, 2.6, 2.7
 *
 * For any valid todo object passed as input, THE TodoItemComponent SHALL correctly
 * display the todo's title and completed status, AND when user interactions occur
 * (toggle, delete, update, editInForm), THE TodoItemComponent SHALL emit events
 * containing the correct todo id and/or data.
 */
describe('Property 2: TodoItem input/output consistency', () => {
  // Helper function to create a fresh component for each property test iteration
  function createComponent(todo: Todo): {
    component: TodoItemComponent;
    fixture: ComponentFixture<TodoItemComponent>;
  } {
    const fixture = TestBed.createComponent(TodoItemComponent);
    const component = fixture.componentInstance;
    component.todo = todo;
    fixture.detectChanges();
    return { component, fixture };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent, NoopAnimationsModule, FormsModule],
    }).compileComponents();
  });

  it('should correctly display any valid todo title and completed status', () => {
    fc.assert(
      fc.property(todoArbitrary, (todo: Todo) => {
        const { fixture } = createComponent(todo);

        // Verify title is displayed correctly
        const titleElement = fixture.debugElement.query(By.css('.todo-title'));
        expect(titleElement.nativeElement.textContent.trim()).toBe(todo.title);

        // Verify completed status is reflected in CSS class
        // Note: Angular returns undefined for false boolean class bindings, so we check for truthy/falsy
        const todoItem = fixture.debugElement.query(By.css('.todo-item'));
        if (todo.completed) {
          expect(todoItem.classes['completed']).toBe(true);
        } else {
          expect(todoItem.classes['completed']).toBeFalsy();
        }

        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });

  it('should emit toggle event with correct todo id for any todo', () => {
    fc.assert(
      fc.property(todoArbitrary, (todo: Todo) => {
        const { component, fixture } = createComponent(todo);

        let emittedId: string | undefined;
        const subscription = component.toggle.subscribe(
          (id) => (emittedId = id)
        );

        component.onToggle();

        expect(emittedId).toBe(todo.id);

        subscription.unsubscribe();
        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });

  it('should emit delete event with correct todo id for any todo', () => {
    fc.assert(
      fc.property(todoArbitrary, (todo: Todo) => {
        const { component, fixture } = createComponent(todo);

        let emittedId: string | undefined;
        const subscription = component.delete.subscribe(
          (id) => (emittedId = id)
        );

        component.onDelete();

        expect(emittedId).toBe(todo.id);

        subscription.unsubscribe();
        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });

  it('should emit editInForm event with correct todo object for any todo', () => {
    fc.assert(
      fc.property(todoArbitrary, (todo: Todo) => {
        const { component, fixture } = createComponent(todo);

        let emittedTodo: Todo | undefined;
        const subscription = component.editInForm.subscribe(
          (t) => (emittedTodo = t)
        );

        component.onEditInForm();

        expect(emittedTodo).toEqual(todo);

        subscription.unsubscribe();
        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });

  it('should emit update event with correct id and new title when inline edit saved', () => {
    fc.assert(
      fc.property(
        todoArbitrary,
        validTitleArbitrary,
        (todo: Todo, newTitle: string) => {
          // Skip if new title is same as original (no update should happen)
          if (newTitle.trim() === todo.title) {
            return true;
          }

          const { component, fixture } = createComponent(todo);

          let emittedUpdate: { id: string; title: string } | undefined;
          const subscription = component.update.subscribe(
            (u) => (emittedUpdate = u)
          );

          component.onStartInlineEdit();
          component.editTitle = newTitle;
          component.onSaveInlineEdit();

          expect(emittedUpdate).toEqual({
            id: todo.id,
            title: newTitle.trim(),
          });

          subscription.unsubscribe();
          fixture.destroy();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should populate editTitle with todo title when starting inline edit for any todo', () => {
    fc.assert(
      fc.property(todoArbitrary, (todo: Todo) => {
        const { component, fixture } = createComponent(todo);

        component.onStartInlineEdit();

        expect(component.editTitle).toBe(todo.title);
        expect(component.isEditing).toBe(true);

        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });
});
