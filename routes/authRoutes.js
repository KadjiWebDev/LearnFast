// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');

// Signup
router.post('/signup', signup); //localhost:3000/auth/signup

// Login
router.post('/login', login); //localhost:3000/auth/login

// Logout

router.post('/logout', logout);
module.exports = router;

