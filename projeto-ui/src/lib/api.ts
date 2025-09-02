import { 
  User, 
  UserSchema, 
  UserList, 
  TodoSchema, 
  TodoList, 
  TodoUpdate, 
  Token, 
  Message, 
  FilterTodo,
  LoginForm 
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    
    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginForm): Promise<Token> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${this.baseURL}/auth/token`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }

    const token = await response.json();
    this.setToken(token.access_token);
    return token;
  }

  async refreshToken(): Promise<Token> {
    return this.request<Token>('/auth/refresh_token', {
      method: 'POST',
    });
  }

  // User endpoints
  async createUser(user: UserSchema): Promise<User> {
    return this.request<User>('/users/', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async getUsers(offset = 0, limit = 10): Promise<UserList> {
    return this.request<UserList>(`/users/?offset=${offset}&limit=${limit}`);
  }

  async getAllUsers(): Promise<UserList> {
    return this.request<UserList>('/users/all');
  }

  async updateUser(userId: number, user: UserSchema): Promise<User> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(userId: number): Promise<Message> {
    return this.request<Message>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Todo endpoints
  async createTodo(todo: TodoSchema): Promise<TodoList['todos'][0]> {
    return this.request<TodoList['todos'][0]>('/todos/', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
  }

  async getTodos(filters: FilterTodo = {}): Promise<TodoList> {
    const params = new URLSearchParams();
    
    if (filters.offset !== undefined) params.append('offset', filters.offset.toString());
    if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
    if (filters.title) params.append('title', filters.title);
    if (filters.description) params.append('description', filters.description);
    if (filters.state) params.append('state', filters.state);

    const queryString = params.toString();
    const endpoint = queryString ? `/todos/?${queryString}` : '/todos/';
    
    return this.request<TodoList>(endpoint);
  }

  async updateTodo(todoId: number, todo: TodoUpdate): Promise<TodoList['todos'][0]> {
    return this.request<TodoList['todos'][0]>(`/todos/${todoId}`, {
      method: 'PATCH',
      body: JSON.stringify(todo),
    });
  }

  async deleteTodo(todoId: number): Promise<Message> {
    return this.request<Message>(`/todos/${todoId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/');
  }
}

export const apiClient = new ApiClient();
