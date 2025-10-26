const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const Project = require('./project');
const Task = require('./task');
const Team = require('./team');

// Initialize models
const models = {
  User: User.initModel(sequelize),
  Project: Project.initModel(sequelize),
  Task: Task.initModel(sequelize),
  Team: Team.initModel(sequelize),
};

// Run associations
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));



module.exports = { sequelize, Sequelize, ...models };
