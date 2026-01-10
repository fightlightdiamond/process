import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";
import { BehaviorSubject } from "rxjs";
import * as fc from "fast-check";

import { TodoContainerComponent } from "./todo-container.component";
import { TodoFacade } from "../../store";
import { TodoFormComponent } from "../todo-form/todo-form.component";
import { TodoListComponent } from "../todo-list/todo-list.component";
import { Todo } from "../../models";

describe("TodoContainerComponent", () => {
  let component: TodoContainerComponent;
  let fixture: ComponentFixture<TodoContainerComponent>;
  let mockFacade: jasmine.SpyObj<TodoFacade>;

  // BehaviorSubjects to control observable values
  let todosSubject: BehaviorSubject<Todo[]>;
  let loadingSubject: BehaviorSubject<boolean>;
  let errorSubject: BehaviorSubject<string | null>;

  const mockTodos: Todo[] = [
    { id: "1", title: "First Todo", completed: false },
    { id: "2", title: "Second Todo", completed: true },
  ];

  beforeEach(async () => {
    // Create BehaviorSubjects for observables
    todosSubject = new BehaviorSubject<Todo[]>(mockTodos);
    loadingSubject = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<string | null>(null);

    // Create mock facade
    mockFacade = jasmine.createSpyObj("TodoFacade", [
      "addTodo",
      "updateTodo",
      "deleteTodo",
      "toggleTodo",
    ]);

    // Set up observable properties
    Object.defineProperty(mockFacade, "todos$", {
      get: () => todosSubject.asObservable(),
    });
    Object.defineProperty(mockFacade, "loading$", {
      get: () => loadingSubject.asObservable(),
    });
    Object.defineProperty(mockFacade, "error$", {
      get: () => errorSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [TodoContainerComponent, NoopAnimationsModule],
      providers: [{ provide: TodoFacade, useValue: mockFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("Component Creation", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should inject TodoFacade", () => {
      expect(component["facade"]).toBeTruthy();
    });

    it("should initialize observables from facade on ngOnInit", () => {
      expect(component.todos$).toBeDefined();
      expect(component.loading$).toBeDefined();
      expect(component.error$).toBeDefined();
    });

    it("should have editingTodo as null initially", () => {
      expect(component.editingTodo).toBeNull();
    });
  });

  describe("Template Composition", () => {
    it("should render TodoFormComponent", () => {
      const formComponent = fixture.debugElement.query(
        By.directive(TodoFormComponent)
      );
      expect(formComponent).toBeTruthy();
    });

    it("should render TodoListComponent", () => {
      const listComponent = fixture.debugElement.query(
        By.directive(TodoListComponent)
      );
      expect(listComponent).toBeTruthy();
    });

    it("should pass editingTodo to TodoFormComponent", () => {
      const formComponent = fixture.debugElement.query(
        By.directive(TodoFormComponent)
      ).componentInstance as TodoFormComponent;

      expect(formComponent.editingTodo).toBeNull();

      // Set editingTodo
      component.editingTodo = mockTodos[0];
      fixture.detectChanges();

      expect(formComponent.editingTodo).toEqual(mockTodos[0]);
    });

    it("should pass todos to TodoListComponent", () => {
      const listComponent = fixture.debugElement.query(
        By.directive(TodoListComponent)
      ).componentInstance as TodoListComponent;

      expect(listComponent.todos).toEqual(mockTodos);
    });

    it("should pass loading to TodoListComponent", () => {
      const listComponent = fixture.debugElement.query(
        By.directive(TodoListComponent)
      ).componentInstance as TodoListComponent;

      expect(listComponent.loading).toBe(false);

      loadingSubject.next(true);
      fixture.detectChanges();

      expect(listComponent.loading).toBe(true);
    });
  });

  describe("Loading State", () => {
    it("should display loading indicator when loading is true", () => {
      loadingSubject.next(true);
      fixture.detectChanges();

      const loadingContainer = fixture.debugElement.query(
        By.css(".loading-container")
      );
      expect(loadingContainer).toBeTruthy();
    });

    it("should not display loading indicator when loading is false", () => {
      loadingSubject.next(false);
      fixture.detectChanges();

      const loadingContainer = fixture.debugElement.query(
        By.css(".loading-container")
      );
      expect(loadingContainer).toBeFalsy();
    });
  });

  describe("Error State", () => {
    it("should display error message when error exists", () => {
      errorSubject.next("Test error message");
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css("p-message"));
      expect(errorMessage).toBeTruthy();
    });

    it("should not display error message when error is null", () => {
      errorSubject.next(null);
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css("p-message"));
      expect(errorMessage).toBeFalsy();
    });
  });

  describe("Event Handling - onSubmitTodo", () => {
    it("should call facade.addTodo when not editing", () => {
      component.editingTodo = null;
      component.onSubmitTodo("New Todo");

      expect(mockFacade.addTodo).toHaveBeenCalledWith("New Todo");
    });

    it("should call facade.updateTodo when editing", () => {
      component.editingTodo = mockTodos[0];
      component.onSubmitTodo("Updated Title");

      expect(mockFacade.updateTodo).toHaveBeenCalledWith("1", {
        title: "Updated Title",
      });
    });

    it("should reset editingTodo after update", () => {
      component.editingTodo = mockTodos[0];
      component.onSubmitTodo("Updated Title");

      expect(component.editingTodo).toBeNull();
    });
  });

  describe("Event Handling - onCancelEdit", () => {
    it("should reset editingTodo to null", () => {
      component.editingTodo = mockTodos[0];
      component.onCancelEdit();

      expect(component.editingTodo).toBeNull();
    });
  });

  describe("Event Handling - onToggle", () => {
    it("should call facade.toggleTodo with correct id", () => {
      component.onToggle("1");

      expect(mockFacade.toggleTodo).toHaveBeenCalledWith("1");
    });
  });

  describe("Event Handling - onDelete", () => {
    it("should call facade.deleteTodo with correct id", () => {
      component.onDelete("1");

      expect(mockFacade.deleteTodo).toHaveBeenCalledWith("1");
    });
  });

  describe("Event Handling - onUpdate", () => {
    it("should call facade.updateTodo with correct id and title", () => {
      component.onUpdate({ id: "1", title: "Updated Title" });

      expect(mockFacade.updateTodo).toHaveBeenCalledWith("1", {
        title: "Updated Title",
      });
    });
  });

  describe("Event Handling - onEditInForm", () => {
    it("should set editingTodo to the provided todo", () => {
      component.onEditInForm(mockTodos[0]);

      expect(component.editingTodo).toEqual(mockTodos[0]);
    });
  });

  describe("Integration with Child Components", () => {
    it("should handle submitTodo event from TodoFormComponent", () => {
      const formComponent = fixture.debugElement.query(
        By.directive(TodoFormComponent)
      ).componentInstance as TodoFormComponent;

      formComponent.submitTodo.emit("New Todo from Form");

      expect(mockFacade.addTodo).toHaveBeenCalledWith("New Todo from Form");
    });

    it("should handle cancelEdit event from TodoFormComponent", () => {
      component.editingTodo = mockTodos[0];
      fixture.detectChanges();

      const formComponent = fixture.debugElement.query(
        By.directive(TodoFormComponent)
      ).componentInstance as TodoFormComponent;

      formComponent.cancelEdit.emit();

      expect(component.editingTodo).toBeNull();
    });

    it("should handle toggle event from TodoListComponent", () => {
      const listComponent = fixture.debugElement.query(
        By.directive(TodoListComponent)
      ).componentInstance as TodoListComponent;

      listComponent.toggle.emit("1");

      expect(mockFacade.toggleTodo).toHaveBeenCalledWith("1");
    });

    it("should handle delete event from TodoListComponent", () => {
      const listComponent = fixture.debugElement.query(
        By.directive(TodoListComponent)
      ).componentInstance as TodoListComponent;

      listComponent.delete.emit("1");

      expect(mockFacade.deleteTodo).toHaveBeenCalledWith("1");
    });

    it("should handle update event from TodoListComponent", () => {
      const listComponent = fixture.debugElement.query(
        By.directive(TodoListComponent)
      ).componentInstance as TodoListComponent;

      listComponent.update.emit({ id: "1", title: "Inline Updated" });

      expect(mockFacade.updateTodo).toHaveBeenCalledWith("1", {
        title: "Inline Updated",
      });
    });

    it("should handle editInForm event from TodoListComponent", () => {
      const listComponent = fixture.debugElement.query(
        By.directive(TodoListComponent)
      ).componentInstance as TodoListComponent;

      listComponent.editInForm.emit(mockTodos[0]);

      expect(component.editingTodo).toEqual(mockTodos[0]);
    });
  });
});

/**
 * Feature: component-driven-design, Property 4: Container event handling
 * Validates: Requirements 4.4, 4.5
 *
 * For any event emitted by child presentational components (submitTodo, toggle, delete, update),
 * THE TodoContainerComponent SHALL call the corresponding facade method with correct parameters.
 */
describe("Property 4: Container event handling", () => {
  let mockFacade: jasmine.SpyObj<TodoFacade>;
  let todosSubject: BehaviorSubject<Todo[]>;
  let loadingSubject: BehaviorSubject<boolean>;
  let errorSubject: BehaviorSubject<string | null>;

  // Arbitrary for generating valid Todo objects
  const todoArbitrary = fc.record({
    id: fc.uuid(),
    title: fc
      .string({ minLength: 1 })
      .filter((s) => s.trim().length > 0)
      .map((s) => s.trim()),
    completed: fc.boolean(),
  });

  // Arbitrary for generating valid title strings
  const titleArbitrary = fc
    .string({ minLength: 1 })
    .filter((s) => s.trim().length > 0)
    .map((s) => s.trim());

  function createComponent(): {
    component: TodoContainerComponent;
    fixture: ComponentFixture<TodoContainerComponent>;
  } {
    const fixture = TestBed.createComponent(TodoContainerComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { component, fixture };
  }

  beforeEach(async () => {
    todosSubject = new BehaviorSubject<Todo[]>([]);
    loadingSubject = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<string | null>(null);

    mockFacade = jasmine.createSpyObj("TodoFacade", [
      "addTodo",
      "updateTodo",
      "deleteTodo",
      "toggleTodo",
    ]);

    Object.defineProperty(mockFacade, "todos$", {
      get: () => todosSubject.asObservable(),
    });
    Object.defineProperty(mockFacade, "loading$", {
      get: () => loadingSubject.asObservable(),
    });
    Object.defineProperty(mockFacade, "error$", {
      get: () => errorSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [TodoContainerComponent, NoopAnimationsModule],
      providers: [{ provide: TodoFacade, useValue: mockFacade }],
    }).compileComponents();
  });

  it("should call facade.addTodo with correct title for any valid submitTodo event when not editing", () => {
    fc.assert(
      fc.property(titleArbitrary, (title: string) => {
        mockFacade.addTodo.calls.reset();

        const { component, fixture } = createComponent();
        component.editingTodo = null;

        component.onSubmitTodo(title);

        expect(mockFacade.addTodo).toHaveBeenCalledWith(title);
        expect(mockFacade.addTodo).toHaveBeenCalledTimes(1);

        fixture.destroy();
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it("should call facade.updateTodo with correct id and title for any valid submitTodo event when editing", () => {
    fc.assert(
      fc.property(
        todoArbitrary,
        titleArbitrary,
        (todo: Todo, newTitle: string) => {
          mockFacade.updateTodo.calls.reset();

          const { component, fixture } = createComponent();
          component.editingTodo = todo;

          component.onSubmitTodo(newTitle);

          expect(mockFacade.updateTodo).toHaveBeenCalledWith(todo.id, {
            title: newTitle,
          });
          expect(mockFacade.updateTodo).toHaveBeenCalledTimes(1);
          expect(component.editingTodo).toBeNull();

          fixture.destroy();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should call facade.toggleTodo with correct id for any toggle event", () => {
    fc.assert(
      fc.property(fc.uuid(), (id: string) => {
        mockFacade.toggleTodo.calls.reset();

        const { component, fixture } = createComponent();

        component.onToggle(id);

        expect(mockFacade.toggleTodo).toHaveBeenCalledWith(id);
        expect(mockFacade.toggleTodo).toHaveBeenCalledTimes(1);

        fixture.destroy();
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it("should call facade.deleteTodo with correct id for any delete event", () => {
    fc.assert(
      fc.property(fc.uuid(), (id: string) => {
        mockFacade.deleteTodo.calls.reset();

        const { component, fixture } = createComponent();

        component.onDelete(id);

        expect(mockFacade.deleteTodo).toHaveBeenCalledWith(id);
        expect(mockFacade.deleteTodo).toHaveBeenCalledTimes(1);

        fixture.destroy();
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it("should call facade.updateTodo with correct id and title for any update event", () => {
    fc.assert(
      fc.property(fc.uuid(), titleArbitrary, (id: string, title: string) => {
        mockFacade.updateTodo.calls.reset();

        const { component, fixture } = createComponent();

        component.onUpdate({ id, title });

        expect(mockFacade.updateTodo).toHaveBeenCalledWith(id, { title });
        expect(mockFacade.updateTodo).toHaveBeenCalledTimes(1);

        fixture.destroy();
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it("should set editingTodo correctly for any editInForm event", () => {
    fc.assert(
      fc.property(todoArbitrary, (todo: Todo) => {
        const { component, fixture } = createComponent();

        component.onEditInForm(todo);

        expect(component.editingTodo).toEqual(todo);

        fixture.destroy();
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it("should reset editingTodo to null for any cancelEdit event", () => {
    fc.assert(
      fc.property(todoArbitrary, (todo: Todo) => {
        const { component, fixture } = createComponent();
        component.editingTodo = todo;

        component.onCancelEdit();

        expect(component.editingTodo).toBeNull();

        fixture.destroy();
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
