export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface Action<T = unknown> {
  type: string;
  payload?: T;
}
