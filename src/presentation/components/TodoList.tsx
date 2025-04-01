import React, { useState } from 'react';
import { useTodos } from '../state/TodoContext';
import TodoItem from './TodoItem';

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      setFilter({});
    } else if (value === 'completed') {
      setFilter({ completed: true });
    } else if (value === 'active') {
      setFilter({ completed: false });
    }
  };

  const handleRepositoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRepositoryType(e.target.value as 'api' | 'localStorage');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setFilter({ ...filter, searchTerm });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Todo List</h1>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <label htmlFor="repository-select">Data Source: </label>
          <select
            id="repository-select"
            value={repositoryType}
            onChange={handleRepositoryChange}
            style={{ 
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="localStorage">Local Storage</option>
            <option value="api">API</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-select">Filter: </label>
          <select
            id="filter-select"
            value={
              filter.completed === undefined
                ? 'all'
                : filter.completed
                ? 'completed'
                : 'active'
            }
            onChange={handleFilterChange}
            style={{ 
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search todos..."
            value={filter.searchTerm || ''}
            onChange={handleSearchChange}
            style={{ 
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '200px'
            }}
          />
        </div>
      </div>

      <form
        onSubmit={handleCreateTodo}
        style={{ 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}
      >
        <h2 style={{ marginTop: 0 }}>Add New Todo</h2>
        
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Title"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            style={{ 
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              marginBottom: '10px'
            }}
            required
          />
          
          <textarea
            placeholder="Description (optional)"
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            style={{ 
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              minHeight: '80px'
            }}
          ></textarea>
        </div>
        
        <button
          type="submit"
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Add Todo
        </button>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
      ) : error ? (
        <div style={{ 
          color: 'red', 
          padding: '10px', 
          border: '1px solid red',
          borderRadius: '4px',
          background: '#ffebee'
        }}>
          Error: {error}
        </div>
      ) : todos.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#888'
        }}>
          No todos found. Add one above!
        </div>
      ) : (
        <div>
          <h2>
            {filter.completed === undefined
              ? 'All Todos'
              : filter.completed
              ? 'Completed Todos'
              : 'Active Todos'}
            <span style={{ 
              fontSize: '0.8rem',
              color: '#888',
              marginLeft: '10px'
            }}>
              ({todos.length} item{todos.length === 1 ? '' : 's'})
            </span>
          </h2>
          
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
