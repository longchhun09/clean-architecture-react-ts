import React from 'react';
import type { Todo } from '../../domain/entities/Todo';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';

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
    <Card className={`${todo.completed ? 'surface-200' : 'surface-0'}`}>
      <div className="p-d-flex p-flex-column">
        <div className="p-d-flex p-jc-between p-ai-center mb-3">
          <h3 className="font-bold m-0">{todo.title}</h3>
          <Tag value={todo.createdAt.toLocaleDateString()} severity="info" />
        </div>
        
        {todo.description && (
          <p className="mt-2 mb-3">{todo.description}</p>
        )}
        
        <div className="mb-3">
          <Badge 
            value={todo.completed ? 'Completed' : 'Pending'} 
            severity={todo.completed ? 'success' : 'warning'} 
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-content-end mt-3">
        <Button 
          label={todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
          icon={todo.completed ? 'pi pi-times' : 'pi pi-check'}
          className={todo.completed ? 'p-button-secondary' : 'p-button-success'}
          onClick={handleToggleComplete}
        />
        
        {onEdit && (
          <Button 
            label="Edit"
            icon="pi pi-pencil"
            className="p-button-primary"
            onClick={handleEdit}
          />
        )}
        
        <Button 
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={handleDelete}
        />
      </div>
    </Card>
  );
};

export default TodoItem;

