const router = require('express').Router();
const Organization = require('../models/Organization');
const Tenant = require('../models/Tenant');

// List organizations with pagination and optional tenant filter
router.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 10, tenant } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const filter = tenant ? { tenant } : {};

    const [organizations, total] = await Promise.all([
      Organization.find(filter)
        .populate('tenant', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 }),
      Organization.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: organizations,
      total,
      page,
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create organization
router.post('/', async (req, res) => {
  try {
    const now = new Date();
    const org = new Organization({
      ...req.body,
      created_at: now,
      updated_at: now
    });
    await org.save();
    await org.populate('tenant', 'name');
    res.json({ success: true, data: org });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get organization by id
router.get('/:id', async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id).populate('tenant', 'name');
    if (!org) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: org });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update organization
router.put('/:id', async (req, res) => {
  try {
    const org = await Organization.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    ).populate('tenant', 'name');
    if (!org) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: org });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete organization
router.delete('/:id', async (req, res) => {
  try {
    const org = await Organization.findByIdAndDelete(req.params.id);
    if (!org) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: org });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router; 