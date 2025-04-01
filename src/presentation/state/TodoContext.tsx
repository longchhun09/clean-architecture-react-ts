import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Todo, TodoFilter } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { createTodoUseCases } from '../../domain/usecases/TodoUseCases';
import ApiTodoRepository from '../../data/repositories/ApiTodoRepository';
import { LocalStorageTodoRepository } from '../../data/repositories/LocalStorageTodoRepository';

type RepositoryType = 'api' | 'localStorage';

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filter: TodoFilter;
  repositoryType: RepositoryType;
  setFilter: (filter: TodoFilter) => void;
  setRepositoryType: (type: RepositoryType) => void;
  fetchTodos: () => Promise<void>;
  getTodoById: (id: string) => Promise<Todo | null>;
  createTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => Promise<Todo>;
  updateTodo: (id: string, todo: Partial<Todo>) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<boolean>;
  toggleTodo: (id: string) => Promise<Todo>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
  initialRepositoryType?: RepositoryType;
}

export const TodoProvider = ({ 
  children, 
  initialRepositoryType = 'localStorage' 
}: TodoProviderProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>({});
  const [repositoryType, setRepositoryType] = useState<RepositoryType>(initialRepositoryType);
  const [repository, setRepository] = useState<TodoRepository>(
    repositoryType === 'api' 
      ? new ApiTodoRepository() 
      : new LocalStorageTodoRepository()
  );
  const [useCases, setUseCases] = useState(createTodoUseCases(repository));

  useEffect(() => {
    const newRepository = 
      repositoryType === 'api' 
        ? new ApiTodoRepository() 
        : new LocalStorageTodoRepository();
    
    setRepository(newRepository);
    setUseCases(createTodoUseCases(newRepository));
  }, [repositoryType]);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTodos = await useCases.getTodos.execute(filter);
      setTodos(fetchedTodos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch todos when filter or repository changes
  useEffect(() => {
    fetchTodos();
  }, [filter, repository]);

  const getTodoById = async (id: string) => {
    try {
      return await useCases.getTodoById.execute(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(`Error getting todo ${id}:`, err);
      return null;
    }
  };

  const createTodo = async (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    try {
      const newTodo = await useCases.createTodo.execute(todo);
      setTodos(prevTodos => [...prevTodos, newTodo]);
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating todo:', err);
      throw err;
    }
  };

  const updateTodo = async (id: string, todoData: Partial<Todo>) => {
    try {
      const updatedTodo = await useCases.updateTodo.execute(id, todoData);
      setTodos(prevTodos => 
        prevTodos.map(todo => todo.id === id ? updatedTodo : todo)
      );
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(`Error updating todo ${id}:`, err);
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const success = await useCases.deleteTodo.execute(id);
      if (success) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(`Error deleting todo ${id}:`, err);
      return false;
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const updatedTodo = await useCases.toggleTodo.execute(id);
      setTodos(prevTodos => 
        prevTodos.map(todo => todo.id === id ? updatedTodo : todo)
      );
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(`Error toggling todo ${id}:`, err);
      throw err;
    }
  };

  const value = {
    todos,
    loading,
    error,
    filter,
    repositoryType,
    setFilter,
    setRepositoryType,
    fetchTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

