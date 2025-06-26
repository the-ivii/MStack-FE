const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// More robust CORS config
const allowedOrigins = ['http://localhost:3000', 'http://192.168.245.19:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

// API Routes
const authRouter = require('./routes/auth');
app.use('/api/v1/auth', authRouter);

const tenantRouter = require('./routes/tenants');
app.use('/api/v1/tenants', tenantRouter);

const organizationRouter = require('./routes/organizations');
app.use('/api/v1/organizations', organizationRouter);

const userRouter = require('./routes/users');
app.use('/api/v1/users', userRouter);

const roleRouter = require('./routes/roles');
app.use('/api/v1/roles', roleRouter);

const privilegeRouter = require('./routes/privileges');
app.use('/api/v1/privileges', privilegeRouter);

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});