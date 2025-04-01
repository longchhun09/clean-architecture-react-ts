import { useState, useEffect } from 'react';
import type { Todo } from '../../domain/entities/Todo';

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  initialValues?: Todo;
  isEditing?: boolean;
}

const TodoForm = ({ onSubmit, initialValues, isEditing = false }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Initialize form when editing an existing todo
    if (initialValues) {
      setTitle(initialValues.title);
      setCompleted(initialValues.completed);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      return;
    }
    
    // Create todo object without id and createdAt (those will be handled by the repository)
    const todoData: Omit<Todo, 'id' | 'createdAt'> = {
      title,
      completed
    };
    
    // Call the onSubmit handler
    onSubmit(todoData);
    
    // Reset form if not editing
    if (!isEditing) {
      setTitle('');
      setCompleted(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h2>{isEditing ? 'Edit Todo' : 'Add New Todo'}</h2>
      
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="completed">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          Completed
        </label>
      </div>
      
      <button type="submit" className="btn-submit">
        {isEditing ? 'Update' : 'Add'} Todo
      </button>
    </form>
  );
};

export default TodoForm;

