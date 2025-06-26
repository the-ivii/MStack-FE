const router = require('express').Router();

let tenants = [
  {
    id: '1',
    name: 'Acme Corp',
    description: 'Demo tenant',
    email: 'admin@acme.com',
    phone: '1234567890',
    website: 'https://acme.com',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// List tenants
router.get('/', (req, res) => {
  res.json({ success: true, data: tenants });
});

// Create tenant
router.post('/', (req, res) => {
  const newTenant = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  tenants.push(newTenant);
  res.json({ success: true, data: newTenant });
});

// Get tenant by id
router.get('/:id', (req, res) => {
  const tenant = tenants.find(t => t.id === req.params.id);
  if (!tenant) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: tenant });
});

// Update tenant
router.put('/:id', (req, res) => {
  const idx = tenants.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  tenants[idx] = {
    ...tenants[idx],
    ...req.body,
    updated_at: new Date().toISOString()
  };
  res.json({ success: true, data: tenants[idx] });
});

// Delete tenant
router.delete('/:id', (req, res) => {
  const idx = tenants.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  const deleted = tenants.splice(idx, 1);
  res.json({ success: true, data: deleted[0] });
});

module.exports = router;