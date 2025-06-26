const router = require('express').Router();
const User = require('../models/User');
const Organization = require('../models/Organization');
const Tenant = require('../models/Tenant');
// const Role = require('../models/Role'); // Uncomment when Role model exists

// List users with pagination and optional org/tenant filter
router.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 10, organization, tenant } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const filter = {};
    if (organization) filter.organization = organization;
    if (tenant) filter.tenant = tenant;

    const [users, total] = await Promise.all([
      User.find(filter)
        .populate('organization', 'name')
        .populate('tenant', 'name')
        // .populate('roles', 'name') // Uncomment when Role model exists
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 }),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: users,
      total,
      page,
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const now = new Date();
    const user = new User({
      ...req.body,
      created_at: now,
      updated_at: now
    });
    await user.save();
    await user.populate('organization', 'name');
    await user.populate('tenant', 'name');
    // await user.populate('roles', 'name'); // Uncomment when Role model exists
    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('organization', 'name')
      .populate('tenant', 'name');
      // .populate('roles', 'name'); // Uncomment when Role model exists
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    )
      .populate('organization', 'name')
      .populate('tenant', 'name');
      // .populate('roles', 'name'); // Uncomment when Role model exists
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router; 