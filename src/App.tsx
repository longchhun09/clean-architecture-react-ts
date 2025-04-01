import './App.css'
import { TodoProvider } from './presentation/state/TodoContext'
import TodoList from './presentation/components/TodoList'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Todo App - Clean Architecture</h1>
        <p>A React application built using Clean Architecture principles</p>
      </header>
      
      <main className="app-content">
        <TodoProvider initialRepositoryType="localStorage">
          <TodoList />
        </TodoProvider>
      </main>
      
      <footer className="app-footer">
        <p>Built with React + TypeScript + Vite</p>
        <p>Following Clean Architecture principles</p>
      </footer>
    </div>
  )
}

export default App
