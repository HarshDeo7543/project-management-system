const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

// Get all users (for assigning to projects, etc.)
// PMs can get a list of users to assign, Admins can get all for management
router.get('/', authenticateToken, permit('Admin', 'ProjectManager'), async (req, res) => {
  try {
    // For the form, we only need users that can be assigned to projects
    // For admins, we might want to show all, but this is safer for now.
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new user (Admin only)
router.post('/', authenticateToken, permit('Admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newUser = await User.create({ name, email, password, role });
    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a user (Admin only)
router.put('/:id', authenticateToken, permit('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body; // Do not allow password changes here for simplicity
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ name, email, role });
    
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user (Admin only)
router.delete('/:id', authenticateToken, permit('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;