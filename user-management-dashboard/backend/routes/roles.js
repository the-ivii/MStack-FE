const router = require('express').Router();
const Role = require('../models/Role');
const Privilege = require('../models/Privilege');

// List roles with pagination
router.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const [roles, total] = await Promise.all([
      Role.find()
        .populate('privileges', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 }),
      Role.countDocuments()
    ]);

    res.json({
      success: true,
      data: roles,
      total,
      page,
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create role
router.post('/', async (req, res) => {
  try {
    const now = new Date();
    const role = new Role({
      ...req.body,
      created_at: now,
      updated_at: now
    });
    await role.save();
    await role.populate('privileges', 'name');
    res.json({ success: true, data: role });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get role by id
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate('privileges', 'name');
    if (!role) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: role });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update role
router.put('/:id', async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    ).populate('privileges', 'name');
    if (!role) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: role });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete role
router.delete('/:id', async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: role });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router; 