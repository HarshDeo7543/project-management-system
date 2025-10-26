const express = require('express');
const router = express.Router();
const { Project, User, Task } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

// Get all projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.findAll({ include: [{ model: User, as: 'teamMembers', attributes: ['id', 'name', 'email', 'role'] }, { model: Task }] });
    // compute simple progress
    const result = projects.map(p => {
      const tasks = p.Tasks || [];
      const done = tasks.filter(t => t.status === 'Done').length;
      const total = tasks.length;
      const progress = total === 0 ? 0 : Math.round((done / total) * 100);
      return { ...p.toJSON(), progress };
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project (Manager or Admin)
router.post('/', authenticateToken, permit('Admin', 'ProjectManager'), async (req, res) => {
  try {
    const { name, description, deadline, teamMemberIds } = req.body;
    const project = await Project.create({ name, description, deadline });
    if (Array.isArray(teamMemberIds) && teamMemberIds.length) {
      const users = await User.findAll({ where: { id: teamMemberIds } });
      await project.addTeamMembers(users);
    }
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update
router.put('/:id', authenticateToken, permit('Admin', 'ProjectManager'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, deadline, teamMemberIds } = req.body;
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    await project.update({ name, description, deadline });
    if (Array.isArray(teamMemberIds)) {
      const users = await User.findAll({ where: { id: teamMemberIds } });
      await project.setTeamMembers(users);
    }
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete
router.delete('/:id', authenticateToken, permit('Admin', 'ProjectManager'), async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    await project.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
