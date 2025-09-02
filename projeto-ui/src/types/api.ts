export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface UserSchema {
  username: string;
  email: string;
  password: string;
}

export interface UserPublic {
  username: string;
  email: string;
}

export interface UserList {
  users: UserPublic[];
}

export enum TodoState {
  DRAFT = 'draft',
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done',
  TRASH = 'trash'
}

export interface TodoSchema {
  title: string;
  description: string;
  state: TodoState;
}

export interface TodoPublic extends TodoSchema {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface TodoList {
  todos: TodoPublic[];
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  state?: TodoState;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Message {
  message: string;
}

export interface FilterPage {
  offset?: number;
  limit?: number;
}

export interface FilterTodo extends FilterPage {
  title?: string;
  description?: string;
  state?: TodoState;
}

export interface LoginForm {
  username: string;
  password: string;
}
