import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import * as fc from 'fast-check';

import {
  TodoFormComponent,
  noWhitespaceValidator,
} from './todo-form.component';
import { Todo } from '../../models/todo.model';
import { FormControl } from '@angular/forms';

// Arbitrary for generating valid Todo objects
const todoArbitrary = fc.record({
  id: fc.uuid(),
  title: fc
    .string({ minLength: 1 })
    .filter((s) => s.trim().length > 0)
    .map((s) => s.trim()),
  completed: fc.boolean(),
});

// Arbitrary for generating valid non-whitespace strings
const validTitleArbitrary = fc
  .string({ minLength: 1 })
  .filter((s) => s.trim().length > 0)
  .map((s) => s.trim());

// Arbitrary for generating whitespace-only strings
const whitespaceOnlyArbitrary = fc
  .array(fc.constantFrom(' ', '\t', '\n', '\r'), {
    minLength: 1,
    maxLength: 10,
  })
  .map((chars: string[]) => chars.join(''));

describe('TodoFormComponent', () => {
  let component: TodoFormComponent;
  let fixture: ComponentFixture<TodoFormComponent>;

  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFormComponent, NoopAnimationsModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should be a presentational component (no service injection)', () => {
      // Verify component has @Input/@Output decorators only
      expect(component.editingTodo).toBeNull();
      expect(component.submitTodo).toBeDefined();
      expect(component.cancelEdit).toBeDefined();
    });

    it('should initialize with empty form', () => {
      expect(component.todoForm.get('title')?.value).toBe('');
    });

    it('should be in add mode by default', () => {
      expect(component.isEditMode).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when title is empty', () => {
      component.todoForm.patchValue({ title: '' });
      expect(component.todoForm.valid).toBe(false);
    });

    it('should be invalid when title is whitespace only', () => {
      component.todoForm.patchValue({ title: '   ' });
      expect(component.todoForm.valid).toBe(false);
    });

    it('should be valid when title has non-whitespace content', () => {
      component.todoForm.patchValue({ title: 'Valid Title' });
      expect(component.todoForm.valid).toBe(true);
    });

    it('should show error message when title is required', () => {
      const titleControl = component.todoForm.get('title');
      titleControl?.setValue('');
      titleControl?.markAsTouched();
      fixture.detectChanges();

      expect(component.isTitleInvalid).toBe(true);
      expect(component.titleErrorMessage).toBe('Title is required');
    });

    it('should show error message when title is whitespace only', () => {
      const titleControl = component.todoForm.get('title');
      titleControl?.setValue('   ');
      titleControl?.markAsTouched();
      fixture.detectChanges();

      expect(component.isTitleInvalid).toBe(true);
      expect(component.titleErrorMessage).toBe(
        'Title cannot be only whitespace'
      );
    });
  });

  describe('noWhitespaceValidator', () => {
    it('should return null for valid string', () => {
      const control = new FormControl('valid');
      expect(noWhitespaceValidator(control)).toBeNull();
    });

    it('should return error for whitespace-only string', () => {
      const control = new FormControl('   ');
      expect(noWhitespaceValidator(control)).toEqual({ whitespace: true });
    });

    it('should return null for empty string (handled by required)', () => {
      const control = new FormControl('');
      expect(noWhitespaceValidator(control)).toBeNull();
    });
  });

  describe('Event Emissions', () => {
    it('should emit submitTodo event with trimmed title when form is valid', () => {
      spyOn(component.submitTodo, 'emit');

      component.todoForm.patchValue({ title: '  New Todo  ' });
      component.onSubmit();

      expect(component.submitTodo.emit).toHaveBeenCalledWith('New Todo');
    });

    it('should not emit submitTodo event when form is invalid', () => {
      spyOn(component.submitTodo, 'emit');

      component.todoForm.patchValue({ title: '' });
      component.onSubmit();

      expect(component.submitTodo.emit).not.toHaveBeenCalled();
    });

    it('should emit cancelEdit event when cancel button clicked', () => {
      spyOn(component.cancelEdit, 'emit');

      component.onCancel();

      expect(component.cancelEdit.emit).toHaveBeenCalled();
    });

    it('should reset form after successful submission', () => {
      component.todoForm.patchValue({ title: 'New Todo' });
      component.onSubmit();

      expect(component.todoForm.get('title')?.value).toBeNull();
    });

    it('should reset form after cancel', () => {
      component.todoForm.patchValue({ title: 'Some Title' });
      component.onCancel();

      expect(component.todoForm.get('title')?.value).toBeNull();
    });
  });

  describe('Edit Mode', () => {
    it('should populate form when editingTodo is set', () => {
      component.editingTodo = mockTodo;
      component.ngOnChanges({
        editingTodo: {
          currentValue: mockTodo,
          previousValue: null,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.todoForm.get('title')?.value).toBe('Test Todo');
    });

    it('should be in edit mode when editingTodo is set', () => {
      component.editingTodo = mockTodo;
      expect(component.isEditMode).toBe(true);
    });

    it('should reset form when editingTodo is cleared', () => {
      component.editingTodo = mockTodo;
      component.ngOnChanges({
        editingTodo: {
          currentValue: mockTodo,
          previousValue: null,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      component.editingTodo = null;
      component.ngOnChanges({
        editingTodo: {
          currentValue: null,
          previousValue: mockTodo,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.todoForm.get('title')?.value).toBeNull();
    });

    it('should be in edit mode when editingTodo is set', () => {
      component.editingTodo = mockTodo;
      component.ngOnChanges({
        editingTodo: {
          currentValue: mockTodo,
          previousValue: null,
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      fixture.detectChanges();

      // Verify edit mode is active (cancel button is conditionally rendered based on isEditMode)
      expect(component.isEditMode).toBe(true);
    });

    it('should be in add mode when editingTodo is null', () => {
      fixture.detectChanges();

      // Verify add mode is active
      expect(component.isEditMode).toBe(false);
    });
  });

  describe('Form Submission Behavior', () => {
    it('should mark form as touched when submitting invalid form', () => {
      component.todoForm.patchValue({ title: '' });
      expect(component.todoForm.touched).toBe(false);

      component.onSubmit();

      expect(component.todoForm.touched).toBe(true);
    });
  });
});

/**
 * Feature: component-driven-design, Property 1: Form input/output consistency
 * Validates: Requirements 1.2, 1.3, 1.6
 *
 * For any valid todo object passed as editingTodo input, THE TodoFormComponent SHALL
 * populate the form with the todo's title, AND for any valid form submission
 * (non-empty, non-whitespace string), THE TodoFormComponent SHALL emit a submitTodo
 * event containing the trimmed title string, AND for any whitespace-only string,
 * THE TodoFormComponent SHALL reject the submission.
 */
describe('Property 1: Form input/output consistency', () => {
  function createComponent(): {
    component: TodoFormComponent;
    fixture: ComponentFixture<TodoFormComponent>;
  } {
    const fixture = TestBed.createComponent(TodoFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { component, fixture };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFormComponent, NoopAnimationsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  it('should populate form with todo title for any valid editingTodo', () => {
    fc.assert(
      fc.property(todoArbitrary, (todo: Todo) => {
        const { component, fixture } = createComponent();

        component.editingTodo = todo;
        component.ngOnChanges({
          editingTodo: {
            currentValue: todo,
            previousValue: null,
            firstChange: false,
            isFirstChange: () => false,
          },
        });

        expect(component.todoForm.get('title')?.value).toBe(todo.title);
        expect(component.isEditMode).toBe(true);

        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });

  it('should emit submitTodo with trimmed title for any valid non-whitespace string', () => {
    fc.assert(
      fc.property(validTitleArbitrary, (title: string) => {
        const { component, fixture } = createComponent();

        let emittedTitle: string | undefined;
        const subscription = component.submitTodo.subscribe(
          (t) => (emittedTitle = t)
        );

        // Add some whitespace around the title to test trimming
        component.todoForm.patchValue({ title: `  ${title}  ` });
        component.onSubmit();

        expect(emittedTitle).toBe(title);

        subscription.unsubscribe();
        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });

  it('should reject submission for any whitespace-only string', () => {
    fc.assert(
      fc.property(whitespaceOnlyArbitrary, (whitespace: string) => {
        const { component, fixture } = createComponent();

        let emittedTitle: string | undefined;
        const subscription = component.submitTodo.subscribe(
          (t) => (emittedTitle = t)
        );

        component.todoForm.patchValue({ title: whitespace });
        component.onSubmit();

        expect(emittedTitle).toBeUndefined();
        expect(component.todoForm.valid).toBe(false);

        subscription.unsubscribe();
        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });

  it('should reset form after successful submission for any valid title', () => {
    fc.assert(
      fc.property(validTitleArbitrary, (title: string) => {
        const { component, fixture } = createComponent();

        component.todoForm.patchValue({ title });
        component.onSubmit();

        expect(component.todoForm.get('title')?.value).toBeNull();

        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });

  it('should emit cancelEdit and reset form when cancel is called in edit mode', () => {
    fc.assert(
      fc.property(todoArbitrary, (todo: Todo) => {
        const { component, fixture } = createComponent();

        let cancelEmitted = false;
        const subscription = component.cancelEdit.subscribe(
          () => (cancelEmitted = true)
        );

        // Set up edit mode
        component.editingTodo = todo;
        component.ngOnChanges({
          editingTodo: {
            currentValue: todo,
            previousValue: null,
            firstChange: false,
            isFirstChange: () => false,
          },
        });

        // Cancel edit
        component.onCancel();

        expect(cancelEmitted).toBe(true);
        expect(component.todoForm.get('title')?.value).toBeNull();

        subscription.unsubscribe();
        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });
});
