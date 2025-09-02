"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { apiClient } from "@/lib/api";
import { TodoPublic, TodoSchema, TodoState, TodoUpdate } from "@/types/api";

export default function Todos() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [todos, setTodos] = useState<TodoPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoPublic | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState<TodoState>(TodoState.TODO);

  // Filter states
  const [filterTitle, setFilterTitle] = useState("");
  const [filterState, setFilterState] = useState<TodoState | "">("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      const loadInitialTodos = async () => {
        try {
          setIsLoading(true);
          const response = await apiClient.getTodos();
          setTodos(response.todos);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load todos");
        } finally {
          setIsLoading(false);
        }
      };

      loadInitialTodos();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const filters: Record<string, string> = {};
      if (filterTitle) filters.title = filterTitle;
      if (filterState) filters.state = filterState;

      const response = await apiClient.getTodos(filters);
      setTodos(response.todos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newTodo: TodoSchema = { title, description, state };
      const createdTodo = await apiClient.createTodo(newTodo);
      setTodos([createdTodo, ...todos]);

      // Reset form
      setTitle("");
      setDescription("");
      setState(TodoState.TODO);
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
    }
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingTodo) return;

    try {
      const updates: TodoUpdate = { title, description, state };
      const updatedTodo = await apiClient.updateTodo(editingTodo.id, updates);

      setTodos(
        todos.map((todo) => (todo.id === editingTodo.id ? updatedTodo : todo))
      );

      // Reset form
      setTitle("");
      setDescription("");
      setState(TodoState.TODO);
      setEditingTodo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      await apiClient.deleteTodo(todoId);
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
    }
  };

  const startEditing = (todo: TodoPublic) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
    setState(todo.state);
    setShowCreateForm(false);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setTitle("");
    setDescription("");
    setState(TodoState.TODO);
  };

  const getStateColor = (state: TodoState) => {
    switch (state) {
      case TodoState.DRAFT:
        return "bg-gray-100 text-gray-800";
      case TodoState.TODO:
        return "bg-blue-200 text-blue-900";
      case TodoState.DOING:
        return "bg-yellow-100 text-yellow-800";
      case TodoState.DONE:
        return "bg-green-100 text-green-800";
      case TodoState.TRASH:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {showCreateForm ? "Cancel" : "Create Todo"}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Filter by title
                </label>
                <input
                  type="text"
                  value={filterTitle}
                  onChange={(e) => setFilterTitle(e.target.value)}
                  className="block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Search titles..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Filter by state
                </label>
                <select
                  value={filterState}
                  onChange={(e) =>
                    setFilterState(e.target.value as TodoState | "")
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">All states</option>
                  <option value={TodoState.DRAFT}>Draft</option>
                  <option value={TodoState.TODO}>Todo</option>
                  <option value={TodoState.DOING}>Doing</option>
                  <option value={TodoState.DONE}>Done</option>
                  <option value={TodoState.TRASH}>Trash</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={loadTodos}
                  className="bg-gray-600 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Create/Edit Form */}
          {(showCreateForm || editingTodo) && (
            <div className="mb-6 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">
                {editingTodo ? "Edit Todo" : "Create New Todo"}
              </h3>
              <form
                onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm text-black focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="text-black">
                    <label className="block text-sm font-medium text-black mb-1">
                      State
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value as TodoState)}
                      className="block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option className="text-black" value={TodoState.DRAFT}>Draft</option>
                      <option value={TodoState.TODO}>Todo</option>
                      <option value={TodoState.DOING}>Doing</option>
                      <option value={TodoState.DONE}>Done</option>
                      <option value={TodoState.TRASH}>Trash</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {editingTodo ? "Update Todo" : "Create Todo"}
                  </button>
                  {editingTodo && (
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="bg-gray-600 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Todos List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600">Loading todos...</div>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600">No todos found</div>
              <p className="text-sm text-gray-500 mt-2">
                Create your first todo to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {todo.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStateColor(
                          todo.state
                        )}`}
                      >
                        {todo.state}
                      </span>
                      <button
                        onClick={() => startEditing(todo)}
                        className="text-blue-700 hover:text-blue-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{todo.description}</p>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(todo.created_at).toLocaleDateString()}{" "}
                    {todo.updated_at !== todo.created_at && (
                      <span>
                        • Updated:{" "}
                        {new Date(todo.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
