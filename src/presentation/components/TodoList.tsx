import React, { useState } from 'react';
import { useTodos } from '../state/TodoContext';
import TodoItem from './TodoItem';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
const TodoList: React.FC = () => {
  const { 
    todos, 
    loading, 
    error, 
    filter, 
    setFilter,
    repositoryType,
    setRepositoryType,
    toggleTodo,
    deleteTodo,
    createTodo 
  } = useTodos();

  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
  });

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.title.trim()) {
      try {
        await createTodo({
          title: newTodo.title,
          description: newTodo.description,
          completed: false,
        });
        setNewTodo({ title: '', description: '' });
      } catch (error) {
        console.error('Failed to create todo:', error);
      }
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      await toggleTodo(id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };
  const handleFilterChange = (e: { value: string }) => {
    const value = e.value;
    if (value === 'all') {
      setFilter({});
    } else if (value === 'completed') {
      setFilter({ completed: true });
    } else if (value === 'active') {
      setFilter({ completed: false });
    }
  };

  const handleRepositoryChange = (e: { value: 'api' | 'localStorage' }) => {
    setRepositoryType(e.value);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setFilter({ ...filter, searchTerm });
  };
  return (
    <div className="container mx-auto p-4" style={{ maxWidth: '800px' }}>
      <h1 className="text-3xl mb-4">Todo List</h1>
      
      <div className="flex justify-content-between align-items-center mb-4">
        <div className="flex align-items-center">
          <label htmlFor="repository-select" className="mr-2">Data Source: </label>
          <Dropdown
            id="repository-select"
            value={repositoryType}
            options={[
              { label: 'Local Storage', value: 'localStorage' },
              { label: 'API', value: 'api' }
            ]}
            onChange={handleRepositoryChange}
            className="w-12rem"
          />
        </div>

        <div className="flex align-items-center">
          <label htmlFor="filter-select" className="mr-2">Filter: </label>
          <Dropdown
            id="filter-select"
            value={
              filter.completed === undefined
                ? 'all'
                : filter.completed
                ? 'completed'
                : 'active'
            }
            options={[
              { label: 'All', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Completed', value: 'completed' }
            ]}
            onChange={handleFilterChange}
            className="w-12rem"
          />
        </div>

        <div className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Search todos..."
            value={filter.searchTerm || ''}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
      </div>
      <Card className="mb-4">
        <form onSubmit={handleCreateTodo}>
          <h2 className="mt-0 mb-3">Add New Todo</h2>
          
          <div className="mb-3">
            <InputText
              className="w-full mb-2"
              placeholder="Title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              required
            />
            
            <InputText
              className="w-full"
              placeholder="Description (optional)"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              style={{ minHeight: '80px' }}
            />
          </div>
          
          <Button
            type="submit"
            label="Add Todo"
            icon="pi pi-plus"
            severity="success"
          />
        </form>
      </Card>
      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : error ? (
        <Card className="bg-red-50 border-round border-1 border-red-500 text-red-700 mb-3">
          Error: {error}
        </Card>
      ) : todos.length === 0 ? (
        <Card className="text-center p-4 text-color-secondary mb-3">
          No todos found. Add one above!
        </Card>
      ) : (
        <Card>
          <div className="flex justify-content-between align-items-center mb-3">
            <h2 className="m-0">
              {filter.completed === undefined
                ? 'All Todos'
                : filter.completed
                ? 'Completed Todos'
                : 'Active Todos'}
            </h2>
            <span className="text-sm text-color-secondary ml-2">
              ({todos.length} item{todos.length === 1 ? '' : 's'})
            </span>
          </div>
          
          <Divider />
          
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </Card>
      )}
    </div>
  );
};

export default TodoList;
