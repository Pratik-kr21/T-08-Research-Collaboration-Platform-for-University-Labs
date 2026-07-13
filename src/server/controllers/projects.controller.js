const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    if (req.user.role !== 'Faculty' && req.user.role !== 'PI') {
      return res.status(403).json({ message: 'Only Faculty or PI can create projects' });
    }

    const { title, abstract, domain, requiredSkills, teamSizeNeeded } = req.body;

    const newProject = new Project({
      title,
      abstract,
      domain,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills?.split(',').map(s => s.trim()),
      teamSizeNeeded,
      owner: req.user.id
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { q, domain, skills, status } = req.query;
    let query = {};

    if (q) {
      query.$text = { $search: q };
    }
    if (domain) {
      query.domain = domain;
    }
    if (status) {
      query.status = status;
    }
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.requiredSkills = { $in: skillsArray };
    }

    const projects = await Project.find(query)
      .populate('owner', 'name department')
      .sort({ createdAt: -1 });
      
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name department')
      .populate('collaborators', 'name role department');
      
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).send('Server error');
  }
};
