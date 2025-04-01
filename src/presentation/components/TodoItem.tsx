import React from 'react';
import type { Todo } from '../../domain/entities/Todo';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onToggleComplete, 
  onDelete, 
  onEdit 
}) => {
  const handleToggleComplete = () => {
    onToggleComplete(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(todo);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <div className="todo-header">
          <h3 className="todo-title">{todo.title}</h3>
          <div className="todo-date">
            {todo.createdAt.toLocaleDateString()}
          </div>
        </div>
        
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
        
        <div className="todo-status">
          Status: {todo.completed ? 'Completed' : 'Pending'}
        </div>
      </div>
      
      <div className="todo-actions">
        <button 
          className={`toggle-btn ${todo.completed ? 'completed' : ''}`}
          onClick={handleToggleComplete}
        >
          {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        
        {onEdit && (
          <button className="edit-btn" onClick={handleEdit}>
            Edit
          </button>
        )}
        
        <button className="delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;

