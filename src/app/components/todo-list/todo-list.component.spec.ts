import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";
import { ChangeDetectorRef } from "@angular/core";
import * as fc from "fast-check";

import { TodoListComponent } from "./todo-list.component";
import { TodoItemComponent } from "../todo-item/todo-item.component";
import { Todo } from "../../models/todo.model";

// Arbitrary for generating valid Todo objects
const todoArbitrary = fc.record({
  id: fc.uuid(),
  title: fc
    .string({ minLength: 1 })
    .filter((s) => s.trim().length > 0)
    .map((s) => s.trim()),
  completed: fc.boolean(),
});

describe("TodoListComponent", () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  const mockTodos: Todo[] = [
    { id: "1", title: "First Todo", completed: false },
    { id: "2", title: "Second Todo", completed: true },
    { id: "3", title: "Third Todo", completed: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Helper to update inputs and trigger change detection for OnPush
  function updateInputs(todos: Todo[], loading: boolean): void {
    fixture.componentRef.setInput("todos", todos);
    fixture.componentRef.setInput("loading", loading);
    fixture.detectChanges();
  }

  describe("Component Creation", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should be a presentational component (no service injection)", () => {
      // Verify component has only @Input/@Output decorators
      expect(component.todos).toBeDefined();
      expect(component.loading).toBeDefined();
      expect(component.toggle).toBeDefined();
      expect(component.delete).toBeDefined();
      expect(component.update).toBeDefined();
      expect(component.editInForm).toBeDefined();
    });

    it("should have default empty todos array", () => {
      expect(component.todos).toEqual([]);
    });

    it("should have default loading as false", () => {
      expect(component.loading).toBe(false);
    });
  });

  describe("Rendering with empty array", () => {
    it("should display empty state when todos array is empty", () => {
      updateInputs([], false);

      const emptyState = fixture.debugElement.query(By.css(".empty-state"));
      expect(emptyState).toBeTruthy();
      expect(emptyState.nativeElement.textContent).toContain("No todos yet");
    });

    it("should not display todo list when todos array is empty", () => {
      updateInputs([], false);

      const todoList = fixture.debugElement.query(By.css(".todo-list"));
      expect(todoList).toBeFalsy();
    });

    it("should not display empty state when loading", () => {
      updateInputs([], true);

      const emptyState = fixture.debugElement.query(By.css(".empty-state"));
      expect(emptyState).toBeFalsy();
    });
  });

  describe("Rendering with non-empty array", () => {
    beforeEach(() => {
      updateInputs(mockTodos, false);
    });

    it("should render TodoItemComponent for each todo", () => {
      const todoItems = fixture.debugElement.queryAll(
        By.directive(TodoItemComponent)
      );
      expect(todoItems.length).toBe(3);
    });

    it("should not display empty state when todos exist", () => {
      const emptyState = fixture.debugElement.query(By.css(".empty-state"));
      expect(emptyState).toBeFalsy();
    });

    it("should display todo list container", () => {
      const todoList = fixture.debugElement.query(By.css(".todo-list"));
      expect(todoList).toBeTruthy();
    });

    it("should pass correct todo to each TodoItemComponent", () => {
      const todoItems = fixture.debugElement.queryAll(
        By.directive(TodoItemComponent)
      );

      todoItems.forEach((item, index) => {
        const itemComponent = item.componentInstance as TodoItemComponent;
        expect(itemComponent.todo).toEqual(mockTodos[index]);
      });
    });
  });

  describe("Loading state", () => {
    it("should display loading indicator when loading is true", () => {
      updateInputs([], true);

      const loadingIndicator = fixture.debugElement.query(
        By.css(".loading-indicator")
      );
      expect(loadingIndicator).toBeTruthy();
      expect(loadingIndicator.nativeElement.textContent).toContain("Loading");
    });

    it("should not display loading indicator when loading is false", () => {
      updateInputs([], false);

      const loadingIndicator = fixture.debugElement.query(
        By.css(".loading-indicator")
      );
      expect(loadingIndicator).toBeFalsy();
    });

    it("should not display todo list when loading", () => {
      updateInputs(mockTodos, true);

      const todoList = fixture.debugElement.query(By.css(".todo-list"));
      expect(todoList).toBeFalsy();
    });
  });

  describe("Event propagation", () => {
    beforeEach(() => {
      updateInputs(mockTodos, false);
    });

    it("should emit toggle event when TodoItemComponent emits toggle", () => {
      spyOn(component.toggle, "emit");

      const todoItems = fixture.debugElement.queryAll(
        By.directive(TodoItemComponent)
      );
      const firstItem = todoItems[0].componentInstance as TodoItemComponent;

      firstItem.toggle.emit("1");

      expect(component.toggle.emit).toHaveBeenCalledWith("1");
    });

    it("should emit delete event when TodoItemComponent emits delete", () => {
      spyOn(component.delete, "emit");

      const todoItems = fixture.debugElement.queryAll(
        By.directive(TodoItemComponent)
      );
      const firstItem = todoItems[0].componentInstance as TodoItemComponent;

      firstItem.delete.emit("1");

      expect(component.delete.emit).toHaveBeenCalledWith("1");
    });

    it("should emit update event when TodoItemComponent emits update", () => {
      spyOn(component.update, "emit");

      const todoItems = fixture.debugElement.queryAll(
        By.directive(TodoItemComponent)
      );
      const firstItem = todoItems[0].componentInstance as TodoItemComponent;

      firstItem.update.emit({ id: "1", title: "Updated Title" });

      expect(component.update.emit).toHaveBeenCalledWith({
        id: "1",
        title: "Updated Title",
      });
    });

    it("should emit editInForm event when TodoItemComponent emits editInForm", () => {
      spyOn(component.editInForm, "emit");

      const todoItems = fixture.debugElement.queryAll(
        By.directive(TodoItemComponent)
      );
      const firstItem = todoItems[0].componentInstance as TodoItemComponent;

      firstItem.editInForm.emit(mockTodos[0]);

      expect(component.editInForm.emit).toHaveBeenCalledWith(mockTodos[0]);
    });
  });

  describe("TrackBy function", () => {
    it("should return todo id for trackBy", () => {
      const todo: Todo = { id: "test-id", title: "Test", completed: false };
      const result = component.trackByTodoId(0, todo);
      expect(result).toBe("test-id");
    });
  });
});

/**
 * Feature: component-driven-design, Property 3: TodoList rendering and event propagation
 * Validates: Requirements 3.2, 3.4
 *
 * For any non-empty todos array passed to TodoListComponent, THE TodoListComponent
 * SHALL render exactly one TodoItemComponent for each todo in the array, AND for any
 * event emitted by a child TodoItemComponent, THE TodoListComponent SHALL re-emit
 * the event to its parent.
 */
describe("Property 3: TodoList rendering and event propagation", () => {
  // Helper function to create a fresh component for each property test iteration
  function createComponent(
    todos: Todo[],
    loading = false
  ): {
    component: TodoListComponent;
    fixture: ComponentFixture<TodoListComponent>;
  } {
    const fixture = TestBed.createComponent(TodoListComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput("todos", todos);
    fixture.componentRef.setInput("loading", loading);
    fixture.detectChanges();
    return { component, fixture };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent, NoopAnimationsModule],
    }).compileComponents();
  });

  it("should render exactly one TodoItemComponent for each todo in any non-empty array", () => {
    fc.assert(
      fc.property(
        fc
          .array(todoArbitrary, { minLength: 1, maxLength: 20 })
          .map((todos) => {
            // Ensure unique IDs
            const seen = new Set<string>();
            return todos.filter((todo) => {
              if (seen.has(todo.id)) return false;
              seen.add(todo.id);
              return true;
            });
          }),
        (todos: Todo[]) => {
          if (todos.length === 0) return true; // Skip if filtering removed all todos

          const { fixture } = createComponent(todos);

          const todoItems = fixture.debugElement.queryAll(
            By.directive(TodoItemComponent)
          );

          expect(todoItems.length).toBe(todos.length);

          // Verify each TodoItemComponent has the correct todo
          todoItems.forEach((item, index) => {
            const itemComponent = item.componentInstance as TodoItemComponent;
            expect(itemComponent.todo).toEqual(todos[index]);
          });

          fixture.destroy();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should display empty state for empty todos array when not loading", () => {
    fc.assert(
      fc.property(fc.constant([] as Todo[]), (todos: Todo[]) => {
        const { fixture } = createComponent(todos, false);

        const emptyState = fixture.debugElement.query(By.css(".empty-state"));
        const todoList = fixture.debugElement.query(By.css(".todo-list"));

        expect(emptyState).toBeTruthy();
        expect(todoList).toBeFalsy();

        fixture.destroy();
        return true;
      }),
      { numRuns: 10 }
    );
  });

  it("should re-emit toggle event with correct id for any todo", () => {
    fc.assert(
      fc.property(
        fc
          .array(todoArbitrary, { minLength: 1, maxLength: 10 })
          .map((todos) => {
            const seen = new Set<string>();
            return todos.filter((todo) => {
              if (seen.has(todo.id)) return false;
              seen.add(todo.id);
              return true;
            });
          }),
        fc.nat(),
        (todos: Todo[], indexSeed: number) => {
          if (todos.length === 0) return true;

          const { component, fixture } = createComponent(todos);
          const targetIndex = indexSeed % todos.length;
          const targetTodo = todos[targetIndex];

          let emittedId: string | undefined;
          const subscription = component.toggle.subscribe(
            (id) => (emittedId = id)
          );

          const todoItems = fixture.debugElement.queryAll(
            By.directive(TodoItemComponent)
          );
          const targetItem = todoItems[targetIndex]
            .componentInstance as TodoItemComponent;

          targetItem.toggle.emit(targetTodo.id);

          expect(emittedId).toBe(targetTodo.id);

          subscription.unsubscribe();
          fixture.destroy();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should re-emit delete event with correct id for any todo", () => {
    fc.assert(
      fc.property(
        fc
          .array(todoArbitrary, { minLength: 1, maxLength: 10 })
          .map((todos) => {
            const seen = new Set<string>();
            return todos.filter((todo) => {
              if (seen.has(todo.id)) return false;
              seen.add(todo.id);
              return true;
            });
          }),
        fc.nat(),
        (todos: Todo[], indexSeed: number) => {
          if (todos.length === 0) return true;

          const { component, fixture } = createComponent(todos);
          const targetIndex = indexSeed % todos.length;
          const targetTodo = todos[targetIndex];

          let emittedId: string | undefined;
          const subscription = component.delete.subscribe(
            (id) => (emittedId = id)
          );

          const todoItems = fixture.debugElement.queryAll(
            By.directive(TodoItemComponent)
          );
          const targetItem = todoItems[targetIndex]
            .componentInstance as TodoItemComponent;

          targetItem.delete.emit(targetTodo.id);

          expect(emittedId).toBe(targetTodo.id);

          subscription.unsubscribe();
          fixture.destroy();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should re-emit update event with correct data for any todo", () => {
    fc.assert(
      fc.property(
        fc
          .array(todoArbitrary, { minLength: 1, maxLength: 10 })
          .map((todos) => {
            const seen = new Set<string>();
            return todos.filter((todo) => {
              if (seen.has(todo.id)) return false;
              seen.add(todo.id);
              return true;
            });
          }),
        fc.nat(),
        fc
          .string({ minLength: 1 })
          .filter((s) => s.trim().length > 0)
          .map((s) => s.trim()),
        (todos: Todo[], indexSeed: number, newTitle: string) => {
          if (todos.length === 0) return true;

          const { component, fixture } = createComponent(todos);
          const targetIndex = indexSeed % todos.length;
          const targetTodo = todos[targetIndex];

          let emittedUpdate: { id: string; title: string } | undefined;
          const subscription = component.update.subscribe(
            (data) => (emittedUpdate = data)
          );

          const todoItems = fixture.debugElement.queryAll(
            By.directive(TodoItemComponent)
          );
          const targetItem = todoItems[targetIndex]
            .componentInstance as TodoItemComponent;

          targetItem.update.emit({ id: targetTodo.id, title: newTitle });

          expect(emittedUpdate).toEqual({ id: targetTodo.id, title: newTitle });

          subscription.unsubscribe();
          fixture.destroy();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should re-emit editInForm event with correct todo for any todo", () => {
    fc.assert(
      fc.property(
        fc
          .array(todoArbitrary, { minLength: 1, maxLength: 10 })
          .map((todos) => {
            const seen = new Set<string>();
            return todos.filter((todo) => {
              if (seen.has(todo.id)) return false;
              seen.add(todo.id);
              return true;
            });
          }),
        fc.nat(),
        (todos: Todo[], indexSeed: number) => {
          if (todos.length === 0) return true;

          const { component, fixture } = createComponent(todos);
          const targetIndex = indexSeed % todos.length;
          const targetTodo = todos[targetIndex];

          let emittedTodo: Todo | undefined;
          const subscription = component.editInForm.subscribe(
            (todo) => (emittedTodo = todo)
          );

          const todoItems = fixture.debugElement.queryAll(
            By.directive(TodoItemComponent)
          );
          const targetItem = todoItems[targetIndex]
            .componentInstance as TodoItemComponent;

          targetItem.editInForm.emit(targetTodo);

          expect(emittedTodo).toEqual(targetTodo);

          subscription.unsubscribe();
          fixture.destroy();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
