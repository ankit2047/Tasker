
// Public auth routes — no JWT required

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register — Create a new user account
router.post('/register', register);

// POST /api/auth/login — Authenticate and receive JWT
router.post('/login', login);

module.exports = router;
