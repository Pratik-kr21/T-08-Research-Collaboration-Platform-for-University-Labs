const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const projectsController = require('../controllers/projects.controller');

// @route   POST api/projects
// @desc    Create a project (Faculty/PI only)
// @access  Private
router.post('/', auth, projectsController.createProject);

// @route   GET api/projects
// @desc    Get all projects (searchable via query params)
// @access  Private
router.get('/', auth, projectsController.getProjects);

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', auth, projectsController.getProjectById);

module.exports = router;
