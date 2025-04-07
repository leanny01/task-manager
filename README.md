# Task Manager

A full-stack task management system built with React, Node.js, MongoDB, and REST API.

## Project Structure

```
/TASK-MANAGER
│
├── /frontend             # React app (Netlify)
│   ├── public/
│   ├── src/
│   ├── .env
│   └── package.json
│
├── /backend              # Node.js API (Droplet)
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── pm2.config.js
│
├── .github/
│   └── workflows/
│       ├── frontend.yml  # Netlify CI/CD
│       └── backend.yml   # GitHub Actions to deploy to Droplet
│
├── README.md
└── .gitignore
```

## Tech Stack

### Frontend

- React 18
- React Router
- Axios
- Environment Variables

### Backend

- Node.js
- Express
- MongoDB
- JWT Authentication
- PM2 Process Manager

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB
- Git

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Frontend (Netlify)

The frontend is automatically deployed to Netlify through GitHub Actions when changes are pushed to the main branch.

### Backend (DigitalOcean Droplet)

The backend is automatically deployed to a DigitalOcean Droplet through GitHub Actions when changes are pushed to the main branch.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
