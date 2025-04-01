import type { Todo, TodoFilter } from '../entities/Todo';

export interface TodoRepository {
  getAll(filter?: TodoFilter): Promise<Todo[]>;
  getById(id: string): Promise<Todo | null>;
  create(todo: Omit<Todo, 'id'>): Promise<Todo>;
  update(id: string, todoData: Partial<Todo>): Promise<Todo>;
  delete(id: string): Promise<boolean>;
}
