import { useState, useEffect } from 'react';
import type { Todo } from '../../domain/entities/Todo';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
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
    <Card className="p-3">
      <form onSubmit={handleSubmit} className="p-fluid">
        <h2 className="text-xl mb-4">{isEditing ? 'Edit Todo' : 'Add New Todo'}</h2>
        
        <div className="field mb-4">
          <label htmlFor="title" className="block mb-2">Title:</label>
          <InputText
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            className="w-full"
          />
        </div>
        
        <div className="field-checkbox mb-4">
          <Checkbox
            inputId="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.checked)}
          />
          <label htmlFor="completed" className="ml-2">Completed</label>
        </div>
        
        <Button type="submit" label={`${isEditing ? 'Update' : 'Add'} Todo`} className="w-full" />
      </form>
    </Card>
  );
};

export default TodoForm;

