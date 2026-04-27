const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { authMiddleware } = require('../middleware/auth');

// Get team settings
router.get('/', authMiddleware, async (req, res) => {
    try {
        let team = await Team.findOne();
        if (!team) {
            team = await Team.create({});
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update team names
router.put('/', authMiddleware, async (req, res) => {
    try {
        let team = await Team.findOne();
        if (team) {
            team.names = req.body.names;
            team.updatedAt = Date.now();
            await team.save();
        } else {
            team = await Team.create(req.body);
        }
        res.json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update team colors
router.put('/colors', authMiddleware, async (req, res) => {
    try {
        let team = await Team.findOne();
        if (team) {
            team.colors = req.body.colors;
            team.updatedAt = Date.now();
            await team.save();
        } else {
            team = await Team.create({ colors: req.body.colors });
        }
        res.json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;