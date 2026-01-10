import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import * as fc from "fast-check";
import { Observable } from "rxjs";
import { TodoApiService } from "./todo-api.service";
import { Todo } from "../models/todo.model";
import { environment } from "../../environments/environment";

const API_URL = `${environment.apiBaseUrl}/todos`;

describe("TodoApiService", () => {
  let service: TodoApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoApiService],
    });
    service = TestBed.inject(TodoApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe("Property Tests", () => {
    /**
     * Feature: json-server-rxjs-store, Property 6: API Service returns Observables
     * For any method call on TodoApiService (getTodos, addTodo, updateTodo, deleteTodo),
     * the return value SHALL be an Observable.
     * Validates: Requirements 7.3
     */
    it("Property 6: API Service returns Observables", () => {
      // Test getTodos returns Observable - verify the return type is Observable
      // without triggering HTTP requests (checking the type before subscription)
      fc.assert(
        fc.property(fc.constant(null), () => {
          const result = service.getTodos();
          return result instanceof Observable;
        }),
        { numRuns: 100 }
      );

      // Test addTodo returns Observable for any valid todo input
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1 }),
            completed: fc.boolean(),
          }),
          (todoInput: Omit<Todo, "id">) => {
            const result = service.addTodo(todoInput);
            return result instanceof Observable;
          }
        ),
        { numRuns: 100 }
      );

      // Test updateTodo returns Observable for any valid id and updates
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          fc.record({
            title: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
            completed: fc.option(fc.boolean(), { nil: undefined }),
          }),
          (id: string, updates: Partial<Todo>) => {
            const result = service.updateTodo(id, updates);
            return result instanceof Observable;
          }
        ),
        { numRuns: 100 }
      );

      // Test deleteTodo returns Observable for any valid id
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (id: string) => {
          const result = service.deleteTodo(id);
          return result instanceof Observable;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Unit Tests", () => {
    it("should be created", () => {
      expect(service).toBeTruthy();
    });

    it("getTodos should make GET request to correct URL", () => {
      const mockTodos: Todo[] = [
        { id: "1", title: "Test Todo", completed: false },
      ];

      service.getTodos().subscribe((todos) => {
        expect(todos).toEqual(mockTodos);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe("GET");
      req.flush(mockTodos);
    });

    it("addTodo should make POST request with todo data", () => {
      const newTodo: Omit<Todo, "id"> = { title: "New Todo", completed: false };
      const mockResponse: Todo = { id: "1", ...newTodo };

      service.addTodo(newTodo).subscribe((todo) => {
        expect(todo).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(newTodo);
      req.flush(mockResponse);
    });

    it("updateTodo should make PATCH request with updates", () => {
      const id = "1";
      const updates: Partial<Todo> = { title: "Updated Title" };
      const mockResponse: Todo = {
        id,
        title: "Updated Title",
        completed: false,
      };

      service.updateTodo(id, updates).subscribe((todo) => {
        expect(todo).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/${id}`);
      expect(req.request.method).toBe("PATCH");
      expect(req.request.body).toEqual(updates);
      req.flush(mockResponse);
    });

    it("deleteTodo should make DELETE request to correct URL", () => {
      const id = "1";

      service.deleteTodo(id).subscribe();

      const req = httpMock.expectOne(`${API_URL}/${id}`);
      expect(req.request.method).toBe("DELETE");
      req.flush(null);
    });
  });
});
