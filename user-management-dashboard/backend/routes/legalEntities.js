const router = require('express').Router();
const LegalEntity = require('../models/LegalEntity');
const Organization = require('../models/Organization');
const Tenant = require('../models/Tenant');

// List legal entities with pagination and optional org/tenant filter
router.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 10, organization, tenant } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const filter = {};
    if (organization) filter.organization = organization;
    if (tenant) filter.tenant = tenant;

    const [entities, total] = await Promise.all([
      LegalEntity.find(filter)
        .populate('organization', 'name')
        .populate('tenant', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 }),
      LegalEntity.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: entities,
      total,
      page,
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create legal entity
router.post('/', async (req, res) => {
  try {
    const now = new Date();
    const entity = new LegalEntity({
      ...req.body,
      created_at: now,
      updated_at: now
    });
    await entity.save();
    await entity.populate('organization', 'name');
    await entity.populate('tenant', 'name');
    res.json({ success: true, data: entity });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get legal entity by id
router.get('/:id', async (req, res) => {
  try {
    const entity = await LegalEntity.findById(req.params.id)
      .populate('organization', 'name')
      .populate('tenant', 'name');
    if (!entity) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: entity });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update legal entity
router.put('/:id', async (req, res) => {
  try {
    const entity = await LegalEntity.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    )
      .populate('organization', 'name')
      .populate('tenant', 'name');
    if (!entity) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: entity });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete legal entity
router.delete('/:id', async (req, res) => {
  try {
    const entity = await LegalEntity.findByIdAndDelete(req.params.id);
    if (!entity) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: entity });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router; 