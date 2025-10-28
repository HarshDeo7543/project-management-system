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
const PORT = process.env.PORT || 4000;

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

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// For Vercel deployment
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development
  sequelize.authenticate()
    .then(() => {
      console.log('Database connected successfully.');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
      process.exit(1);
    });
}
