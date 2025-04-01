import type { Todo, TodoFilter } from '../entities/Todo';
import type { TodoRepository } from '../repositories/TodoRepository';

export class GetTodosUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(filter?: TodoFilter): Promise<Todo[]> {
    return this.todoRepository.getAll(filter);
  }
}

export class GetTodoByIdUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: string): Promise<Todo | null> {
    return this.todoRepository.getById(id);
  }
}

export class CreateTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(todoData: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> {
    const newTodo = {
      ...todoData,
      createdAt: new Date(),
    };
    return this.todoRepository.create(newTodo);
  }
}

export class UpdateTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: string, todoData: Partial<Todo>): Promise<Todo> {
    const updatedTodo = {
      ...todoData,
      updatedAt: new Date(),
    };
    return this.todoRepository.update(id, updatedTodo);
  }
}

export class DeleteTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.todoRepository.delete(id);
  }
}

export class ToggleTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: string): Promise<Todo> {
    const todo = await this.todoRepository.getById(id);
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    return this.todoRepository.update(id, {
      completed: !todo.completed,
      updatedAt: new Date(),
    });
  }
}

export function createTodoUseCases(todoRepository: TodoRepository) {
  return {
    getTodos: new GetTodosUseCase(todoRepository),
    getTodoById: new GetTodoByIdUseCase(todoRepository),
    createTodo: new CreateTodoUseCase(todoRepository),
    updateTodo: new UpdateTodoUseCase(todoRepository),
    deleteTodo: new DeleteTodoUseCase(todoRepository),
    toggleTodo: new ToggleTodoUseCase(todoRepository),
  };
}
