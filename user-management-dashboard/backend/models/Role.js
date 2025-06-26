const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  privileges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Privilege' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', RoleSchema); 