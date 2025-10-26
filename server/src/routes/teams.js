const express = require('express');
const router = express.Router();
const { Team, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

// Middleware to protect all routes in this file
router.use(authenticateToken, permit('Admin'));

// GET all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.findAll({ include: 'members' });
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, { include: 'members' });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new team
router.post('/', async (req, res) => {
  try {
    const { name, memberIds } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const newTeam = await Team.create({ name });

    if (memberIds && memberIds.length > 0) {
      await newTeam.setMembers(memberIds);
    }

    const teamWithMembers = await Team.findByPk(newTeam.id, { include: 'members' });

    res.status(201).json(teamWithMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT to update a team
router.put('/:id', async (req, res) => {
  try {
    const { name, memberIds } = req.body;
    const team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (name) {
      team.name = name;
      await team.save();
    }

    if (memberIds) {
      await team.setMembers(memberIds);
    }

    const updatedTeam = await Team.findByPk(req.params.id, { include: 'members' });

    res.json(updatedTeam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a team
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.destroy();
    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
