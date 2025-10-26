# Project Management System (Beginner-Friendly)

This repository contains a starter full-stack Project Management Tool:

- Backend: `server/` (Node.js, Express, Sequelize, PostgreSQL)
- Frontend: `client/` (React + Vite + Tailwind)

Quick start (recommended using Docker for PostgreSQL)

1. Start Postgres via Docker in the `server/` folder:

   cd server
   docker-compose up -d

2. Copy environment file and edit if needed:

   cp .env.example .env

3. Install and run backend:

   npm install
   npm run dev

4. Seed sample data (optional):

   npm run seed

5. Start the frontend:

   cd ../client
   npm install
   npm run dev

Open the frontend (Vite dev server). API docs are available at http://localhost:4000/api/docs

What's included

- JWT authentication (`/api/auth/register`, `/api/auth/login`)
- Role-based access control (Admin, ProjectManager, Developer)
- Projects endpoints: CRUD + assign team members
- Tasks endpoints: CRUD + assign to users, status updates, comments
- Swagger UI for API docs
- Sample seed script to create an admin, PM, dev and a sample project/task

Next steps and improvements

- Add proper migrations instead of sync
- Add tests (Jest / Supertest)
- Improve frontend UX and add forms for editing/assigning
- Add file upload, notifications, and real-time updates (WebSockets)

