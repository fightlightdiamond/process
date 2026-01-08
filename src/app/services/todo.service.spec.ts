import { TestBed } from '@angular/core/testing';
import * as fc from 'fast-check';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Property Tests', () => {
    /**
     * Feature: rxjs-todo-crud, Property 1: Adding a valid todo grows the list
     * For any todo list and any valid (non-empty, non-whitespace) title string,
     * adding it to the todo list should result in the list length growing by one
     * and the new todo being present in the list.
     * Validates: Requirements 1.1
     */
    it('Property 1: Adding a valid todo grows the list', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          (title) => {
            const freshService = new TodoService();
            const initialLength = freshService.getTodos().length;
            const result = freshService.addTodo(title);
            const newLength = freshService.getTodos().length;
            const todos = freshService.getTodos();

            return (
              result === true &&
              newLength === initialLength + 1 &&
              todos.some((t) => t.title === title.trim())
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: rxjs-todo-crud, Property 2: Empty/whitespace todos are rejected
     * For any string composed entirely of whitespace (including empty string),
     * attempting to add it as a todo should be rejected, and the todo list should remain unchanged.
     * Validates: Requirements 1.2
     */
    it('Property 2: Empty/whitespace todos are rejected', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('', ' ', '  ', '\t', '\n', '   \t\n  '),
          (whitespaceTitle) => {
            const freshService = new TodoService();
            const initialTodos = [...freshService.getTodos()];
            const result = freshService.addTodo(whitespaceTitle);
            const finalTodos = freshService.getTodos();

            return (
              result === false && finalTodos.length === initialTodos.length
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: rxjs-todo-crud, Property 3: Toggle flips completed status
     * For any todo in the list, toggling it should flip its completed status
     * from true to false or false to true, while keeping all other properties unchanged.
     * Validates: Requirements 3.1
     */
    it('Property 3: Toggle flips completed status', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          fc.boolean(),
          (title, initialCompleted) => {
            const freshService = new TodoService();
            freshService.addTodo(title);
            const todos = freshService.getTodos();
            const todoId = todos[0].id;

            // Set initial completed state
            if (initialCompleted) {
              freshService.toggleTodo(todoId);
            }

            const beforeToggle = freshService.getTodos()[0];
            const completedBefore = beforeToggle.completed;

            freshService.toggleTodo(todoId);

            const afterToggle = freshService.getTodos()[0];

            return (
              afterToggle.completed === !completedBefore &&
              afterToggle.id === beforeToggle.id &&
              afterToggle.title === beforeToggle.title
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: rxjs-todo-crud, Property 4: Update changes only the specified todo's title
     * For any todo in the list and any new valid title, updating that todo's title
     * should change only that todo's title while leaving all other todos unchanged.
     * Validates: Requirements 3.2
     */
    it("Property 4: Update changes only the specified todo's title", () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
            { minLength: 2, maxLength: 5 }
          ),
          fc.nat(),
          fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          (titles, indexSeed, newTitle) => {
            const freshService = new TodoService();
            titles.forEach((t) => freshService.addTodo(t));

            const todos = freshService.getTodos();
            const targetIndex = indexSeed % todos.length;
            const targetId = todos[targetIndex].id;
            const otherTodos = todos.filter((_, i) => i !== targetIndex);

            freshService.updateTodo(targetId, newTitle);

            const updatedTodos = freshService.getTodos();
            const updatedTarget = updatedTodos.find((t) => t.id === targetId);
            const updatedOthers = updatedTodos.filter((t) => t.id !== targetId);

            const othersUnchanged = otherTodos.every(
              (original, i) =>
                updatedOthers[i].id === original.id &&
                updatedOthers[i].title === original.title &&
                updatedOthers[i].completed === original.completed
            );

            return (
              updatedTarget !== undefined &&
              updatedTarget.title === newTitle &&
              othersUnchanged
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: rxjs-todo-crud, Property 5: Delete removes the specified todo
     * For any todo in the list, deleting it should remove exactly that todo
     * from the list, reducing the list length by one.
     * Validates: Requirements 4.1
     */
    it('Property 5: Delete removes the specified todo', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
            { minLength: 1, maxLength: 5 }
          ),
          fc.nat(),
          (titles, indexSeed) => {
            const freshService = new TodoService();
            titles.forEach((t) => freshService.addTodo(t));

            const todosBefore = freshService.getTodos();
            const targetIndex = indexSeed % todosBefore.length;
            const targetId = todosBefore[targetIndex].id;
            const lengthBefore = todosBefore.length;

            freshService.deleteTodo(targetId);

            const todosAfter = freshService.getTodos();

            return (
              todosAfter.length === lengthBefore - 1 &&
              !todosAfter.some((t) => t.id === targetId)
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should toggle only the specified todo when multiple todos exist', () => {
      // Add multiple todos
      service.addTodo('Todo 1');
      service.addTodo('Todo 2');
      service.addTodo('Todo 3');

      const todos = service.getTodos();
      const targetId = todos[1].id; // Toggle the middle one

      // Store original states
      const originalStates = todos.map((t) => ({
        id: t.id,
        completed: t.completed,
      }));

      // Toggle only the second todo
      service.toggleTodo(targetId);

      const updatedTodos = service.getTodos();

      // Verify only the target todo was toggled
      expect(updatedTodos[0].completed).toBe(originalStates[0].completed);
      expect(updatedTodos[1].completed).toBe(!originalStates[1].completed);
      expect(updatedTodos[2].completed).toBe(originalStates[2].completed);
    });
  });
});
