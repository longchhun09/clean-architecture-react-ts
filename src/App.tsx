import './App.css'
import { TodoProvider } from './presentation/state/TodoContext'
import TodoList from './presentation/components/TodoList'
import { Toolbar } from 'primereact/toolbar'
import { Card } from 'primereact/card'
function App() {
  return (
    <div className="app-container flex flex-column min-h-screen">
      <Toolbar className="mb-3 shadow-2" 
        start={
          <div className="flex flex-column">
            <h1 className="m-0">Todo App - Clean Architecture</h1>
            <p className="m-0">A React application built using Clean Architecture principles</p>
          </div>
        }
      />
      
      <main className="app-content flex-grow-1 px-4 py-5">
        <Card className="mx-auto" style={{ maxWidth: '1000px' }}>
          <TodoProvider initialRepositoryType="localStorage">
            <TodoList />
          </TodoProvider>
        </Card>
      </main>
      
      <footer className="py-3 px-4 text-center surface-200">
        <div className="text-sm">
          <p className="mb-1">Built with React + TypeScript + Vite</p>
          <p className="mb-0">Following Clean Architecture principles</p>
        </div>
      </footer>
    </div>
  )
}

export default App
