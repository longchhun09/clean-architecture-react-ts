import type { Todo, TodoFilter } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/repositories/TodoRepository';
import ApiService from '../../infrastructure/services/ApiService';

/**
 * ApiTodoRepository - Implementation of TodoRepository that uses API calls
 */
export class ApiTodoRepository implements TodoRepository {
  private apiService: typeof ApiService;
  private baseUrl: string;

  /**
   * Constructor for ApiTodoRepository
   * @param apiService ApiService instance for making HTTP requests
   * @param baseUrl Base URL for API endpoints
   */
  constructor(
    apiService: ApiService = ApiService.getInstance(),
    baseUrl: string = '/todos'
  ) {
    this.apiService = apiService;
    this.baseUrl = baseUrl;
  }

  /**
   * Get all todos with optional filter
   * @param filter Optional filter criteria
   * @returns Promise of Todo array
   */
  async getAll(filter?: TodoFilter): Promise<Todo[]> {
    try {
      const todos: Todo[] = await this.apiService.get<Todo[]>(
        this.baseUrl,
        filter
      );
      // Convert date strings to Date objects
      return todos.map((todo) => this.mapTodoFromApi(todo));
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }

  /**
   * Get a todo by ID
   * @param id Todo ID
   * @returns Promise of Todo or null if not found
   */
  async getById(id: string): Promise<Todo | null> {
    try {
      const todo: Todo = await this.apiService.get<Todo>(
        `${this.baseUrl}/${id}`
      );
      return this.mapTodoFromApi(todo);
    } catch (error) {
      console.error(`Error fetching todo with ID ${id}:`, error);
      if ((error as any).response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create a new todo
   * @param todo Todo data without ID
   * @returns Promise of created Todo
   */
  async create(todo: Omit<Todo, 'id'>): Promise<Todo> {
    try {
      // Make sure we don't send any ID - the server should generate one
      const { id, ...todoData } = todo as Todo;

      const createdTodo: Todo = await this.apiService.post<Todo>(this.baseUrl, {
        ...todoData,
        createdAt: new Date().toISOString(), // Convert Date to ISO string for API
      });

      return this.mapTodoFromApi(createdTodo);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  /**
   * Update an existing todo
   * @param id Todo ID
   * @param todoData Updated todo data
   * @returns Promise of updated Todo
   */
  async update(id: string, todoData: Partial<Todo>): Promise<Todo> {
    try {
      // If todoData contains dates, convert them to ISO strings for the API
      const apiTodoData = { ...todoData };

      if (apiTodoData.createdAt instanceof Date) {
        apiTodoData.createdAt = apiTodoData.createdAt.toISOString();
      }

      if (apiTodoData.updatedAt instanceof Date) {
        apiTodoData.updatedAt = apiTodoData.updatedAt.toISOString();
      } else {
        // Always set updated date when updating
        apiTodoData.updatedAt = new Date().toISOString();
      }

      const updatedTodo: Todo = await this.apiService.put<Todo>(
        `${this.baseUrl}/${id}`,
        apiTodoData
      );

      return this.mapTodoFromApi(updatedTodo);
    } catch (error) {
      console.error(`Error updating todo with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a todo
   * @param id Todo ID
   * @returns Promise of boolean indicating success
   */
  async delete(id: string): Promise<boolean> {
    try {
      await this.apiService.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting todo with ID ${id}:`, error);
      return false;
    }
  }

  /**
   * Convert API todo response to Todo entity
   * @param todo Todo from API
   * @returns Todo with proper date objects
   */
  private mapTodoFromApi(todo: any): Todo {
    return {
      ...todo,
      // Convert date strings to Date objects
      createdAt: todo.createdAt ? new Date(todo.createdAt) : new Date(),
      updatedAt: todo.updatedAt ? new Date(todo.updatedAt) : undefined,
    };
  }
}

export default ApiTodoRepository;
