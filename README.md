# Clean Architecture React Todo App

A React application built using Clean Architecture principles and PrimeReact components.

## Features

- Built with React, TypeScript, and Vite
- Implements Clean Architecture principles for separation of concerns
- Uses PrimeReact component library for UI
- Responsive design with PrimeFlex
- Local storage for data persistence

## Architecture

This project follows Clean Architecture principles, separating the codebase into layers:

- **Domain**: Core business logic and entities
- **Use Cases**: Application-specific business rules
- **Interfaces/Adapters**: Adapters between use cases and infrastructure
- **Presentation**: UI components and state management

## UI Components

The app uses [PrimeReact](https://primereact.org/) for its UI components, offering a consistent and professional look and feel.

## Common Issues and Solutions

### CSS Conflicts

When integrating PrimeReact with an existing project, you might encounter styling conflicts between default CSS files and PrimeReact's styling system.

**Problem**: Conflicting styles in `index.css` and `App.css` can cause UI components to look inconsistent or break the layout.

**Solution**:
1. Simplify global CSS files to contain only the essential styles
2. Remove custom styling for elements that are replaced by PrimeReact components
3. Use PrimeFlex classes for layout instead of custom CSS
4. Ensure proper import order of CSS files in the main entry point

Example of simplified `index.css`:
```css
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  
  /* Keep text rendering properties */
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Basic document reset */
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  width: 100%;
}

body {
  /* Allow proper layout flow for PrimeReact components */
  display: block;
}
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Additional Resources

- [PrimeReact Documentation](https://primereact.org/documentation/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
