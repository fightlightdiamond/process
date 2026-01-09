import { Action, Todo, TodoState } from '../../models/todo.model';
import { TodoActionTypes } from './todo.actions';

export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

export function todoReducer(
  state: TodoState = initialState,
  action: Action
): TodoState {
  switch (action.type) {
    // Load Todos
    case TodoActionTypes.LOAD_TODOS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case TodoActionTypes.LOAD_TODOS_SUCCESS:
      return {
        ...state,
        todos: action.payload as Todo[],
        loading: false,
        error: null,
      };

    case TodoActionTypes.LOAD_TODOS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as string,
      };

    // Add Todo
    case TodoActionTypes.ADD_TODO:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case TodoActionTypes.ADD_TODO_SUCCESS:
      return {
        ...state,
        todos: [...state.todos, action.payload as Todo],
        loading: false,
        error: null,
      };

    case TodoActionTypes.ADD_TODO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as string,
      };

    // Update Todo
    case TodoActionTypes.UPDATE_TODO:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case TodoActionTypes.UPDATE_TODO_SUCCESS:
      const updatedTodo = action.payload as Todo;
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        ),
        loading: false,
        error: null,
      };

    case TodoActionTypes.UPDATE_TODO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as string,
      };

    // Delete Todo
    case TodoActionTypes.DELETE_TODO:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case TodoActionTypes.DELETE_TODO_SUCCESS:
      const deletedId = action.payload as string;
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== deletedId),
        loading: false,
        error: null,
      };

    case TodoActionTypes.DELETE_TODO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as string,
      };

    default:
      return state;
  }
}
