const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const aiRoutes = require('./routes/ai');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(cors({ allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/ai', aiRoutes);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// The Vercel environment will handle starting the server.
// We just need to export the configured express app.
module.exports = app;