# Clean Architecture React Todo App

## Project Overview

This is a Todo application built with React and TypeScript that demonstrates the implementation of Clean Architecture principles in a frontend application. The project showcases how to structure a React application following domain-driven design, with clear separation of concerns and dependencies pointing inward.

The application allows users to create, read, update, and delete todo items, with data persistence implemented using local storage. The UI is built using PrimeReact components, providing a modern and responsive user interface.

## Clean Architecture

This project strictly adheres to Clean Architecture principles as defined by Robert C. Martin (Uncle Bob). The codebase is organized into concentric layers, each with a specific responsibility:

### Layers

- **Domain Layer**: The innermost layer containing business entities and business rules. This layer is independent of any external frameworks or tools.
  - Entities: Core business models (like Todo)
  - Repository Interfaces: Contracts for data operations
  - Use Cases: Business logic operations

- **Data Layer**: Implements repository interfaces defined in the domain layer, handling the actual data operations.
  - Repositories: Concrete implementations of repository interfaces
  - Data Sources: APIs, local storage, or other external data sources

- **Presentation Layer**: Contains UI components and view logic.
  - Components: React components
  - Hooks: Custom React hooks for state management and business logic access
  - Pages: Complete page compositions

### Key Principles Implemented

1. **Independence of Frameworks**: Core business logic does not depend on UI or data storage frameworks
2. **Testability**: Business rules can be tested without UI, database, or external elements
3. **Dependency Rule**: Dependencies point inward, with inner layers having no knowledge of outer layers
4. **Separation of Concerns**: Each layer has a distinct responsibility

## Project Structure

The project follows a feature-based organization within the Clean Architecture layers:

```
src/
├── domain/         # Core business logic
│   ├── entities/   # Business models
│   ├── repositories/ # Repository interfaces
│   └── usecases/   # Business operations
├── data/           # Data access implementation
│   └── repositories/ # Repository implementations
└── presentation/   # UI components and pages
    ├── components/ # Reusable UI components
    ├── hooks/      # Custom React hooks
    └── pages/      # Complete page compositions
```

## Technologies Used

- **Core**:
  - React 18
  - TypeScript
  - Vite (for fast development and optimized builds)

- **UI Components**:
  - PrimeReact (component library)
  - PrimeFlex (responsive grid system)
  - PrimeIcons (icon set)

- **State Management**:
  - React Context API
  - Custom hooks for domain access

- **Data Storage**:
  - Local Storage (browser-based persistence)

- **Development Tools**:
  - ESLint (code quality)
  - Prettier (code formatting)
  - Jest (for testing - configured but no tests written yet)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/clean-architecture-react-ts.git
   cd clean-architecture-react-ts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173/

### Building for Production

```bash
npm run build
```

The compiled assets will be in the `dist` directory.

## Features

- **Todo Management**:
  - Create, read, update, and delete todo items
  - Mark todos as completed
  - Filter todos by status (all, active, completed)

- **Architecture Highlights**:
  - Implements Clean Architecture principles for separation of concerns
  - Domain-driven design with clear business entities and use cases
  - Repository pattern for data access abstraction

- **UI Features**:
  - Responsive design with PrimeFlex
  - Modern UI components from PrimeReact
  - Theme customization options

- **Data Persistence**:
  - Local storage for data persistence across browser sessions

## Directory Structure

```
clean-architecture-react-ts/
├── public/                     # Static assets
├── src/
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   ├── domain/                 # Domain layer
│   │   ├── entities/           # Business entities
│   │   │   └── Todo.ts         # Todo entity definition
│   │   ├── repositories/       # Repository interfaces
│   │   │   └── TodoRepository.ts # Todo repository interface
│   │   └── usecases/           # Business use cases
│   │       └── TodoUseCases.ts # Todo-related business operations
│   ├── data/                   # Data layer
│   │   └── repositories/       # Repository implementations
│   │       └── LocalStorageTodoRepository.ts # Local storage implementation
│   └── presentation/           # Presentation layer
│       ├── components/         # UI components
│       │   ├── TodoList.tsx    # Todo list component
│       │   ├── TodoItem.tsx    # Individual todo item component
│       │   └── TodoForm.tsx    # Form for creating/editing todos
│       ├── hooks/              # Custom React hooks
│       │   └── useTodo.ts      # Hook for Todo operations
│       └── pages/              # Page components
│           └── TodoPage.tsx    # Main todo page
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # Project documentation
```

## Additional Resources

- [PrimeReact Documentation](https://primereact.org/documentation/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
