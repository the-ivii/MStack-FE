const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, required: true },
  avatarUrl: { type: String },
  tenant_id: { type: String },
  organization_id: { type: String },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User; 