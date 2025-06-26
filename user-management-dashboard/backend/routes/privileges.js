const router = require('express').Router();
const Privilege = require('../models/Privilege');

// List privileges with pagination
router.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const [privileges, total] = await Promise.all([
      Privilege.find()
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 }),
      Privilege.countDocuments()
    ]);

    res.json({
      success: true,
      data: privileges,
      total,
      page,
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create privilege
router.post('/', async (req, res) => {
  try {
    const now = new Date();
    const privilege = new Privilege({
      ...req.body,
      created_at: now,
      updated_at: now
    });
    await privilege.save();
    res.json({ success: true, data: privilege });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get privilege by id
router.get('/:id', async (req, res) => {
  try {
    const privilege = await Privilege.findById(req.params.id);
    if (!privilege) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: privilege });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update privilege
router.put('/:id', async (req, res) => {
  try {
    const privilege = await Privilege.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    if (!privilege) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: privilege });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete privilege
router.delete('/:id', async (req, res) => {
  try {
    const privilege = await Privilege.findByIdAndDelete(req.params.id);
    if (!privilege) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: privilege });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router; 