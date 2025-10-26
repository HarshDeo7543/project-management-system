const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const Project = require('./project');
const Task = require('./task');

// Initialize models
const models = {
  User: User.initModel(sequelize),
  Project: Project.initModel(sequelize),
  Task: Task.initModel(sequelize),
};

// Associations
models.User.hasMany(models.Task, { foreignKey: 'assignedToId' });
models.Task.belongsTo(models.User, { as: 'assignedTo', foreignKey: 'assignedToId' });

models.Project.hasMany(models.Task, { foreignKey: 'projectId' });
models.Task.belongsTo(models.Project, { foreignKey: 'projectId' });

models.Project.belongsToMany(models.User, { through: 'ProjectUsers', as: 'teamMembers', foreignKey: 'projectId' });
models.User.belongsToMany(models.Project, { through: 'ProjectUsers', as: 'projects', foreignKey: 'userId' });

module.exports = { sequelize, Sequelize, ...models };
