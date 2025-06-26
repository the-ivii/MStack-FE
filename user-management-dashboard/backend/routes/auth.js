const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock user database
const users = [];

// Pre-create a user for testing
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('password123', salt);
users.push({
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    email: 'user@example.com',
    password: hashedPassword,
    first_name: 'John',
    last_name: 'Doe',
    tenant_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    organization_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    roles: ['Admin']
});


router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
        user: {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            tenant_id: user.tenant_id,
            organization_id: user.organization_id
        }
    };

    jwt.sign(
        payload,
        'your_jwt_secret', // In a real app, use an environment variable
        { expiresIn: 3600 },
        (err, token) => {
            if (err) throw err;
            res.json({
                success: true,
                data: {
                    access_token: token,
                    token_type: 'bearer',
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    user_id: user.id,
                    tenant_id: user.tenant_id,
                    organization_id: user.organization_id,
                },
                message: 'Login successful'
            });
        }
    );
});

module.exports = router; 