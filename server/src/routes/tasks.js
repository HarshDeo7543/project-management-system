const express = require('express');
const router = express.Router();
const { Task, User, Project } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

// Get tasks (optionally filter by assignedTo)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { assignedTo } = req.query;
    const where = {};
    if (assignedTo) where.assignedToId = assignedTo;
    const tasks = await Task.findAll({ where, include: [{ model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] }, { model: Project }] });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task (Manager or Admin)
router.post('/', authenticateToken, permit('Admin', 'ProjectManager'), async (req, res) => {
  try {
    const { title, description, status, deadline, assignedToId, projectId } = req.body;
    const task = await Task.create({ title, description, status, deadline, assignedToId, projectId });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task (Manager, Admin or assigned Developer for status/comments)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ message: 'Not found' });

    const user = req.user;
    const isAssigned = task.assignedToId === user.id;

    // Admin or ProjectManager can edit everything
    if (user.role === 'Admin' || user.role === 'ProjectManager') {
      await task.update(req.body);
      return res.json(task);
    }

    // Developer: allow updating status and comments only on tasks assigned to them
    if (user.role === 'Developer' && isAssigned) {
      const { status, comments } = req.body;
      await task.update({ status, comments });
      return res.json(task);
    }

    return res.status(403).json({ message: 'Forbidden' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete
router.delete('/:id', authenticateToken, permit('Admin', 'ProjectManager'), async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    await task.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
