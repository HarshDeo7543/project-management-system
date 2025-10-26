# Project Management Server

Backend for the beginner-friendly Project Management Tool.

Stack: Node.js, Express, Sequelize, PostgreSQL, JWT

Quick start

1. Copy .env.example to .env and adjust DATABASE_URL and JWT_SECRET.
2. Start a Postgres DB (you can use the included docker-compose):

   docker-compose up -d

3. Install dependencies and run server:

   npm install
   npm run dev

4. Seed sample data (optional):

   npm run seed

API docs

Visit http://localhost:4000/api/docs after starting the server to view Swagger UI.

Notes

- Uses Sequelize sync for simplicity. For production use migrations.
- JWT secret + DB credentials must be set in .env.
