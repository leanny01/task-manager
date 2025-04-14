# Task Manager

A modern task management application built with React and TypeScript, featuring offline support and a clean, intuitive interface.

## Problem it Solves

Task Manager addresses the need for a simple, efficient, and user-friendly way to manage daily tasks. It provides:

- Centralized task organization
- Priority-based task management
- Task status tracking
- Local data persistence
- Clean and intuitive user interface

## 🚀 Live Demo

Check out the live demo at [https://nova-task-manager.netlify.app/](https://nova-task-manager.netlify.app/)

## ✨ Features

- **Task Management**

  - Add new tasks with title and description
  - Delete tasks
  - Mark tasks as complete/incomplete
  - View task details and status
  - Archive completed tasks

- **User Experience**
  - Clean and intuitive interface
  - Responsive design for all devices
  - Offline support with local storage
  - Real-time task status updates
  - Error handling and loading states

## 🏗️ Architecture

The application follows a modern, scalable architecture split between frontend and backend services.

### Detailed Architecture Documentation

- [Frontend Architecture](frontend/README.md) - React-based SPA with modern state management
- [Backend Architecture](backend/README.md) - Node.js API with MongoDB integration

Key architectural features:

- Clean separation of concerns
- Error handling at every layer
- Built-in monitoring and logging
- Comprehensive testing approach
- Scalable data access patterns

## 🛠️ Tech Stack

- **Frontend**

  - React 18
  - TypeScript
  - Styled Components
  - React Router
  - Context API for state management

- **Backend**

  - Node.js
  - Express
  - MongoDB
  - TypeScript
  - JWT Authentication

- **Development Tools**
  - Vite
  - ESLint
  - Prettier
  - Jest & React Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

2. Install dependencies:

```bash
# Install frontend dependencies
cd frontend
yarn install

# Install backend dependencies
cd ../backend
yarn install
```

3. Start the development servers:

```bash
# Start backend server
cd backend
yarn dev

# Start frontend server (in a new terminal)
cd frontend
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
# Build frontend
cd frontend
yarn build

# Build backend
cd ../backend
yarn build
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
