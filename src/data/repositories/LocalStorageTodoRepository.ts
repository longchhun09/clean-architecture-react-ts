import type { Todo, TodoFilter } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/repositories/TodoRepository';

export class LocalStorageTodoRepository implements TodoRepository {
  private STORAGE_KEY = 'todos';
  private useLocalStorage = true;
  private inMemoryTodos: Todo[] = [];

  constructor() {
    try {
      const storedTodos = localStorage.getItem(this.STORAGE_KEY);
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        // Convert string dates back to Date objects
        this.inMemoryTodos = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        }));
      }
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      this.useLocalStorage = false;
    }
  }

  private saveToStorage(todos: Todo[]): void {
    if (!this.useLocalStorage) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      this.useLocalStorage = false;
    }
  }

  async getAll(filter?: TodoFilter): Promise<Todo[]> {
    let filteredTodos = [...this.inMemoryTodos];
    
    if (filter) {
      // Filter by completed status if specified
      if (filter.completed !== undefined) {
        filteredTodos = filteredTodos.filter(todo => todo.completed === filter.completed);
      }
      
      // Filter by search term if specified
      if (filter.searchTerm) {
        const searchTermLower = filter.searchTerm.toLowerCase();
        filteredTodos = filteredTodos.filter(todo => 
          todo.title.toLowerCase().includes(searchTermLower) || 
          (todo.description && todo.description.toLowerCase().includes(searchTermLower))
        );
      }
    }
    
    return Promise.resolve(filteredTodos);
  }

  async getById(id: string): Promise<Todo | null> {
    const todo = this.inMemoryTodos.find((todo) => todo.id === id);
    return Promise.resolve(todo || null);
  }

  async create(todo: Omit<Todo, 'id'>): Promise<Todo> {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
    };

    this.inMemoryTodos.push(newTodo);
    this.saveToStorage(this.inMemoryTodos);

    return Promise.resolve(newTodo);
  }

  async update(id: string, updatedTodo: Partial<Todo>): Promise<Todo> {
    const index = this.inMemoryTodos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }

    const todo = this.inMemoryTodos[index];
    const updatedItem: Todo = {
      ...todo,
      ...updatedTodo,
      id, // Ensure ID doesn't change
    };

    this.inMemoryTodos[index] = updatedItem;
    this.saveToStorage(this.inMemoryTodos);

    return Promise.resolve(updatedItem);
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.inMemoryTodos.length;
    this.inMemoryTodos = this.inMemoryTodos.filter((todo) => todo.id !== id);

    if (initialLength !== this.inMemoryTodos.length) {
      this.saveToStorage(this.inMemoryTodos);
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }
}
