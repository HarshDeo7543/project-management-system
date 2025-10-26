const express = require('express');
const router = express.Router();
const { Task, Project } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get dashboard stats
router.get('/', authenticateToken, async (req, res) => {
  try {
    const totalProjects = await Project.count();
    const totalTasks = await Task.count();

    const tasksByStatus = await Task.findAll({
      group: ['status'],
      attributes: ['status', [Task.sequelize.fn('COUNT', 'status'), 'count']],
    });

    const overdueTasks = await Task.count({
      where: {
        deadline: {
          [Op.lt]: new Date(),
        },
        status: {
          [Op.ne]: 'Done',
        },
      },
    });

    const stats = {
      totalProjects,
      totalTasks,
      tasksByStatus: tasksByStatus.reduce((acc, item) => {
        acc[item.status] = item.get('count');
        return acc;
      }, {}),
      overdueTasks,
    };

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
