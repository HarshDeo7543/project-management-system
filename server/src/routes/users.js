const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

// Get all users (for assigning to projects)
router.get('/', authenticateToken, permit('Admin', 'ProjectManager'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'role'],
      where: { role: ['ProjectManager', 'Developer'] }
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
