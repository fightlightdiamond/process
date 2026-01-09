import * as fc from 'fast-check';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { TodoEffects } from './todo.effects';
import { TodoApiService } from '../../services/todo-api.service';
import { Action, Todo } from '../../models/todo.model';
import {
  TodoActionTypes,
  loadTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from './todo.actions';

// Arbitrary for generating valid Todo objects
const todoArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 10 }),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  completed: fc.boolean(),
});

describe('Todo Effects', () => {
  let effects: TodoEffects;
  let httpMock: HttpTestingController;
  let actions$: Subject<Action>;
  let dispatchedActions: Action[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoEffects, TodoApiService],
    });

    effects = TestBed.inject(TodoEffects);
    httpMock = TestBed.inject(HttpTestingController);
    actions$ = new Subject<Action>();
    dispatchedActions = [];

    // Initialize effects with action stream and dispatch function
    effects.init(actions$, (action: Action) => {
      dispatchedActions.push(action);
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Unit Tests - Fallback Error Messages', () => {
    it('should use fallback message for LOAD_TODOS when error.message is undefined', fakeAsync(() => {
      // Arrange
      dispatchedActions = [];
      // Act
      actions$.next(loadTodos());
      tick();
      const req = httpMock.expectOne('http://localhost:3000/todos');
      req.flush({}, { status: 500, statusText: 'Server Error' }); // No message property
      tick();
      // Assert
      expect(dispatchedActions[0].type).toBe(
        TodoActionTypes.LOAD_TODOS_FAILURE
      );
      expect(dispatchedActions[0].payload).toBe('Failed to load todos');
    }));

    it('should use fallback message for ADD_TODO when error.message is undefined', fakeAsync(() => {
      // Arrange
      dispatchedActions = [];
      // Act
      actions$.next(addTodo('Test'));
      tick();
      const req = httpMock.expectOne('http://localhost:3000/todos');
      req.flush({}, { status: 500, statusText: 'Server Error' });
      tick();
      // Assert
      expect(dispatchedActions[0].type).toBe(TodoActionTypes.ADD_TODO_FAILURE);
      expect(dispatchedActions[0].payload).toBe('Failed to add todo');
    }));

    it('should use fallback message for UPDATE_TODO when error.message is undefined', fakeAsync(() => {
      // Arrange
      dispatchedActions = [];
      // Act
      actions$.next(updateTodo({ id: '1', updates: { title: 'Updated' } }));
      tick();
      const req = httpMock.expectOne('http://localhost:3000/todos/1');
      req.flush({}, { status: 500, statusText: 'Server Error' });
      tick();
      // Assert
      expect(dispatchedActions[0].type).toBe(
        TodoActionTypes.UPDATE_TODO_FAILURE
      );
      expect(dispatchedActions[0].payload).toBe('Failed to update todo');
    }));

    it('should use fallback message for DELETE_TODO when error.message is undefined', fakeAsync(() => {
      // Arrange
      dispatchedActions = [];
      // Act
      actions$.next(deleteTodo('1'));
      tick();
      const req = httpMock.expectOne('http://localhost:3000/todos/1');
      req.flush({}, { status: 500, statusText: 'Server Error' });
      tick();
      // Assert
      expect(dispatchedActions[0].type).toBe(
        TodoActionTypes.DELETE_TODO_FAILURE
      );
      expect(dispatchedActions[0].payload).toBe('Failed to delete todo');
    }));
  });

  describe('Property Tests', () => {
    /**
     * Feature: json-server-rxjs-store, Property 5: Effects dispatch correct actions on API response
     * For any API call triggered by an effect, a successful response SHALL result in dispatching
     * the corresponding SUCCESS action, and an error response SHALL result in dispatching
     * the corresponding FAILURE action with error message.
     * Validates: Requirements 4.6
     */
    it('Property 5: Effects dispatch correct actions on API response - LOAD_TODOS success', fakeAsync(() => {
      fc.assert(
        fc.property(
          fc.array(todoArbitrary, { minLength: 0, maxLength: 5 }),
          (todos: Todo[]) => {
            dispatchedActions = [];

            // Dispatch LOAD_TODOS action
            actions$.next(loadTodos());
            tick();

            // Mock successful API response
            const req = httpMock.expectOne('http://localhost:3000/todos');
            expect(req.request.method).toBe('GET');
            req.flush(todos);
            tick();

            // Verify SUCCESS action was dispatched with correct payload
            expect(dispatchedActions.length).toBe(1);
            expect(dispatchedActions[0].type).toBe(
              TodoActionTypes.LOAD_TODOS_SUCCESS
            );
            expect(dispatchedActions[0].payload).toEqual(todos);

            return true;
          }
        ),
        { numRuns: 10 } // Reduced runs due to async nature
      );
    }));

    it('Property 5: Effects dispatch correct actions on API response - LOAD_TODOS failure', fakeAsync(() => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (errorMessage: string) => {
            dispatchedActions = [];

            // Dispatch LOAD_TODOS action
            actions$.next(loadTodos());
            tick();

            // Mock error API response
            const req = httpMock.expectOne('http://localhost:3000/todos');
            req.flush(
              { message: errorMessage },
              { status: 500, statusText: 'Server Error' }
            );
            tick();

            // Verify FAILURE action was dispatched
            expect(dispatchedActions.length).toBe(1);
            expect(dispatchedActions[0].type).toBe(
              TodoActionTypes.LOAD_TODOS_FAILURE
            );

            return true;
          }
        ),
        { numRuns: 10 }
      );
    }));

    it('Property 5: Effects dispatch correct actions on API response - ADD_TODO success', fakeAsync(() => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          todoArbitrary,
          (title: string, responseTodo: Todo) => {
            dispatchedActions = [];

            // Dispatch ADD_TODO action
            actions$.next(addTodo(title));
            tick();

            // Mock successful API response
            const req = httpMock.expectOne('http://localhost:3000/todos');
            expect(req.request.method).toBe('POST');
            expect(req.request.body.title).toBe(title);
            expect(req.request.body.completed).toBe(false);
            req.flush(responseTodo);
            tick();

            // Verify SUCCESS action was dispatched with correct payload
            expect(dispatchedActions.length).toBe(1);
            expect(dispatchedActions[0].type).toBe(
              TodoActionTypes.ADD_TODO_SUCCESS
            );
            expect(dispatchedActions[0].payload).toEqual(responseTodo);

            return true;
          }
        ),
        { numRuns: 10 }
      );
    }));

    it('Property 5: Effects dispatch correct actions on API response - ADD_TODO failure', fakeAsync(() => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          (title: string, errorMessage: string) => {
            dispatchedActions = [];

            // Dispatch ADD_TODO action
            actions$.next(addTodo(title));
            tick();

            // Mock error API response
            const req = httpMock.expectOne('http://localhost:3000/todos');
            req.flush(
              { message: errorMessage },
              { status: 500, statusText: 'Server Error' }
            );
            tick();

            // Verify FAILURE action was dispatched
            expect(dispatchedActions.length).toBe(1);
            expect(dispatchedActions[0].type).toBe(
              TodoActionTypes.ADD_TODO_FAILURE
            );

            return true;
          }
        ),
        { numRuns: 10 }
      );
    }));

    it('Property 5: Effects dispatch correct actions on API response - UPDATE_TODO success', fakeAsync(() => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 10 }),
          fc.record({
            title: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
              nil: undefined,
            }),
            completed: fc.option(fc.boolean(), { nil: undefined }),
          }),
          todoArbitrary,
          (id: string, updates: Partial<Todo>, responseTodo: Todo) => {
            dispatchedActions = [];

            // Dispatch UPDATE_TODO action
            actions$.next(updateTodo({ id, updates }));
            tick();

            // Mock successful API response
            const req = httpMock.expectOne(`http://localhost:3000/todos/${id}`);
            expect(req.request.method).toBe('PATCH');
            req.flush(responseTodo);
            tick();

            // Verify SUCCESS action was dispatched with correct payload
            expect(dispatchedActions.length).toBe(1);
            expect(dispatchedActions[0].type).toBe(
              TodoActionTypes.UPDATE_TODO_SUCCESS
            );
            expect(dispatchedActions[0].payload).toEqual(responseTodo);

            return true;
          }
        ),
        { numRuns: 10 }
      );
    }));

    it('Property 5: Effects dispatch correct actions on API response - UPDATE_TODO failure', fakeAsync(() => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 10 }),
          fc.record({
            title: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
              nil: undefined,
            }),
            completed: fc.option(fc.boolean(), { nil: undefined }),
          }),
          fc.string({ minLength: 1, maxLength: 50 }),
          (id: string, updates: Partial<Todo>, errorMessage: string) => {
            dispatchedActions = [];

            // Dispatch UPDATE_TODO action
            actions$.next(updateTodo({ id, updates }));
            tick();

            // Mock error API response
            const req = httpMock.expectOne(`http://localhost:3000/todos/${id}`);
            req.flush(
              { message: errorMessage },
              { status: 500, statusText: 'Server Error' }
            );
            tick();

            // Verify FAILURE action was dispatched
            expect(dispatchedActions.length).toBe(1);
            expect(dispatchedActions[0].type).toBe(
              TodoActionTypes.UPDATE_TODO_FAILURE
            );

            return true;
          }
        ),
        { numRuns: 10 }
      );
    }));

    it('Property 5: Effects dispatch correct actions on API response - DELETE_TODO success', fakeAsync(() => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 10 }),
          (id: string) => {
            dispatchedActions = [];

            // Dispatch DELETE_TODO action
            actions$.next(deleteTodo(id));
            tick();

            // Mock successful API response
            const req = httpMock.expectOne(`http://localhost:3000/todos/${id}`);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
            tick();

            // Verify SUCCESS action was dispatched with correct payload (the id)
            expect(dispatchedActions.length).toBe(1);
            expect(dispatchedActions[0].type).toBe(
              TodoActionTypes.DELETE_TODO_SUCCESS
            );
            expect(dispatchedActions[0].payload).toBe(id);

            return true;
          }
        ),
        { numRuns: 10 }
      );
    }));

    it('Property 5: Effects dispatch correct actions on API response - DELETE_TODO failure', fakeAsync(() => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 10 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          (id: string, errorMessage: string) => {
            dispatchedActions = [];

            // Dispatch DELETE_TODO action
            actions$.next(deleteTodo(id));
            tick();

            // Mock error API response
            const req = httpMock.expectOne(`http://localhost:3000/todos/${id}`);
            req.flush(
              { message: errorMessage },
              { status: 500, statusText: 'Server Error' }
            );
            tick();

            // Verify FAILURE action was dispatched
            expect(dispatchedActions.length).toBe(1);
            expect(dispatchedActions[0].type).toBe(
              TodoActionTypes.DELETE_TODO_FAILURE
            );

            return true;
          }
        ),
        { numRuns: 10 }
      );
    }));
  });
});
