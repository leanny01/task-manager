# Task Manager

A task management application built with React and TypeScript, using local storage for data persistence.

## Problem it Solves

Task Manager addresses the need for a simple, efficient, and user-friendly way to manage daily tasks. It provides:

- Centralized task organization
- Priority-based task management
- Task status tracking
- Local data persistence
- Clean and intuitive user interface

## Architecture Overview

The application follows a modern, component-based architecture:

### Frontend Architecture

- **Component-Based Structure**: Organized into shared, domain-specific, and page components
- **State Management**: Custom hooks for task management and local storage
- **Service Layer**: Abstracted data operations through service classes
- **Type Safety**: Full TypeScript implementation for better code quality
- **Data Persistence**: Local storage for task data

## Tech Stack

### Frontend

- React 18
- TypeScript
- Styled Components
- React Router
- Local Storage API

## Project Structure

```
/TASK-MANAGER
│
├── /frontend             # React app
│   ├── public/
│   ├── src/
│   │   ├── domains/     # Domain-specific components and logic
│   │   │   └── task/    # Task-related components and hooks
│   │   ├── shared/      # Reusable components and utilities
│   │   ├── services/    # Data access and business logic
│   │   └── pages/       # Page components
│   ├── .env
│   └── package.json
│
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup

1. Clone the repository:

   ```bash
   git clone [repository-url]
   ```

2. Navigate to the project directory:

   ```bash
   cd frontend
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

4. Start the development server:
   ```bash
   yarn dev
   ```

## Features

- Create, read, update, and delete tasks
- Set task priorities (Low, Medium, High)
- Mark tasks as complete/incomplete
- Persistent storage using browser's local storage
- Responsive design for all screen sizes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
