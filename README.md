# Project Management System (Beginner-Friendly)

This repository contains a full-stack Project Management Tool built with modern technologies.

- **Backend**: `server/` (Node.js, Express, Sequelize, PostgreSQL)
- **Frontend**: `client/` (React + Vite + Tailwind CSS)
- **Database**: PostgreSQL (supports Neon for cloud deployment)
- **Deployment**: Vercel (full-stack with serverless functions)

## How to Run the Project

### Local Development Setup

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd project-management-system
   ```

2. **Set up PostgreSQL Database**:
   - Option 1: Using Docker (recommended for local development):
     ```
     cd server
     docker-compose up -d
     ```
   - Option 2: Using Neon (for cloud database):
     - Sign up at [neon.tech](https://neon.tech)
     - Create a new project and copy the connection string
     - Update `server/.env` with `DATABASE_URL=your_neon_connection_string`

3. **Configure Environment Variables**:
   - Copy the example env file:
     ```
     cd server
     cp .env.example .env
     ```
   - Edit `.env` to set:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `JWT_SECRET`: A secure random string for JWT tokens
     - `GROQ_API_KEY`: (Optional) For AI-powered user story generation

4. **Install Backend Dependencies and Run**:
   ```
   cd server
   npm install
   npm run dev
   ```

5. **Seed Sample Data (Optional)**:
   ```
   npm run seed
   ```

6. **Install Frontend Dependencies and Run**:
   ```
   cd ../client
   npm install
   npm run dev
   ```

7. **Access the Application**:
   - Frontend: http://localhost:5173 (Vite dev server)
   - Backend API: http://localhost:4000
   - API Documentation: http://localhost:4000/api/docs (Swagger UI)

### Production Deployment on Vercel

1. **Connect Repository to Vercel**:
   - Import your GitHub repository to Vercel
   - Vercel will automatically detect the build settings from `vercel.json`

2. **Set Environment Variables in Vercel**:
   - Go to Project Settings > Environment Variables
   - Add:
     - `DATABASE_URL`: Your Neon database connection string
     - `JWT_SECRET`: Secure random string
     - `GROQ_API_KEY`: (Optional) For AI features

3. **Deploy**:
   - Push changes to your main branch
   - Vercel will build and deploy automatically
   - Access your live application at the provided Vercel URL

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - Get all projects (with progress calculation)
- `GET /api/projects/:id` - Get single project with tasks and team members
- `POST /api/projects` - Create new project (Admin/ProjectManager only)
- `PUT /api/projects/:id` - Update project (Admin/ProjectManager only)
- `DELETE /api/projects/:id` - Delete project (Admin only)

### Tasks
- `GET /api/tasks` - Get all tasks (optional filter by assigned user)
- `POST /api/tasks` - Create new task (Admin/ProjectManager only)
- `PUT /api/tasks/:id` - Update task (role-based permissions)
- `DELETE /api/tasks/:id` - Delete task (Admin/ProjectManager only)

### Teams
- `GET /api/teams` - Get all teams (Admin only)
- `GET /api/teams/:id` - Get single team (Admin only)
- `POST /api/teams` - Create new team (Admin only)
- `PUT /api/teams/:id` - Update team (Admin only)
- `DELETE /api/teams/:id` - Delete team (Admin only)

### Users
- `GET /api/users` - Get all users (Admin/ProjectManager only)
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### AI Features
- `POST /api/ai/generate-user-stories` - Generate user stories using AI (requires GROQ_API_KEY)

## Assumptions and Possible Improvements

### Assumptions Made
- Users have basic familiarity with Node.js, React, and PostgreSQL
- Database schema uses Sequelize ORM with automatic sync (not migrations)
- JWT tokens expire after 8 hours
- Role-based access: Admin > ProjectManager > Developer
- Projects belong to teams, tasks belong to projects
- AI features require external API key (GROQ)

### Possible Improvements
- **Database**: Implement proper migrations instead of sync for production safety
- **Testing**: Add comprehensive unit and integration tests (Jest, Supertest)
- **Frontend UX**: Enhance forms, add drag-and-drop for task management, implement dark mode
- **Real-time Features**: Add WebSocket support for live updates (Socket.io)
- **File Upload**: Implement file attachments for tasks and projects
- **Notifications**: Email/SMS notifications for task assignments and deadlines
- **Advanced Analytics**: Project progress charts, time tracking, burndown charts
- **Security**: Rate limiting, input validation, CSRF protection
- **Performance**: Database indexing, caching (Redis), API pagination
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Documentation**: More detailed API docs, user guides, architecture diagrams

## Contact

**Harsh Deo**  
Email: harshdeo5142@gmail.com 

This project demonstrates full-stack development skills including authentication, role-based access control, database design, API development, and modern deployment practices.

