import { Action, User, UserState } from "../models/user.model";
import { UserActionTypes } from "./user.actions";

export const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export function userReducer(
  state: UserState = initialState,
  action: Action
): UserState {
  switch (action.type) {
    case UserActionTypes.LOAD_USERS:
    case UserActionTypes.ADD_USER:
    case UserActionTypes.UPDATE_USER:
    case UserActionTypes.DELETE_USER:
      return { ...state, loading: true, error: null };

    case UserActionTypes.LOAD_USERS_SUCCESS:
      return { ...state, users: action.payload as User[], loading: false };

    case UserActionTypes.ADD_USER_SUCCESS:
      return {
        ...state,
        users: [...state.users, action.payload as User],
        loading: false,
      };

    case UserActionTypes.UPDATE_USER_SUCCESS: {
      const updated = action.payload as User;
      return {
        ...state,
        users: state.users.map((u) => (u.id === updated.id ? updated : u)),
        loading: false,
      };
    }

    case UserActionTypes.DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.payload),
        loading: false,
      };

    case UserActionTypes.LOAD_USERS_FAILURE:
    case UserActionTypes.ADD_USER_FAILURE:
    case UserActionTypes.UPDATE_USER_FAILURE:
    case UserActionTypes.DELETE_USER_FAILURE:
      return { ...state, loading: false, error: action.payload as string };

    default:
      return state;
  }
}
