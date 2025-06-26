const router = require('express').Router();
const User = require('../models/user.model');

// @desc    Get all users
// @route   GET /users/
router.route('/').get(async (req, res) => {
  try {
    console.log('[GET /users] Request received');
    const users = await User.find();
    console.log('[GET /users] Returning users:', users.length);
    res.json(users);
  } catch (err) {
    console.error('[GET /users] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch users: ' + err.message });
  }
});

// @desc    Add a new user
// @route   POST /users/add
router.route('/add').post(async (req, res) => {
  try {
    const { name, email, role, status, avatarUrl } = req.body;
    const newUser = new User({ name, email, role, status, avatarUrl });

    await newUser.save();
    res.json({ message: '✅ User added successfully!' });
  } catch (err) {
    console.error('[POST /users/add] Error:', err.message);
    res.status(500).json({ error: 'Failed to add user: ' + err.message });
  }
});

// @desc    Get user by ID
// @route   GET /users/:id
router.route('/:id').get(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('[GET /users/:id] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user: ' + err.message });
  }
});

// @desc    Delete user by ID
// @route   DELETE /users/:id
router.route('/:id').delete(async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ User deleted successfully' });
  } catch (err) {
    console.error('[DELETE /users/:id] Error:', err.message);
    res.status(500).json({ error: 'Failed to delete user: ' + err.message });
  }
});

// @desc    Update user by ID
// @route   POST /users/update/:id
router.route('/update/:id').post(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, email, role, status, avatarUrl } = req.body;

    user.name = name;
    user.email = email;
    user.role = role;
    user.status = status;
    user.avatarUrl = avatarUrl;

    await user.save();
    res.json({ message: '✅ User updated successfully!' });
  } catch (err) {
    console.error('[POST /users/update/:id] Error:', err.message);
    res.status(500).json({ error: 'Failed to update user: ' + err.message });
  }
});

module.exports = router;