// middleware/authMentor.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Mentor = require('../models/Mentor');
const { retrieveToken } = require('../utils/token'); // assuming you already have this helper

exports.authMentor = async (req, res, next) => {
    try {
        const token = retrieveToken(req.header('Authorization'));
        if (!token) {
            return res.status(401).json({ error: 'Authorization token missing or invalid' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const mentor = await Mentor.findOne({ user_id: user._id });
        if (!mentor) {
            return res.status(404).json({ error: 'Mentor profile not found' });
        }
        req.user = user;
        req.mentor = mentor;

        next();
    } catch (err) {
        console.error('AuthMentor error:', err);
        res.status(401).json({ error: 'Unauthorized or invalid token' });
    }
};

exports.RedAuthMentor = async (req, res, next) => {
    try {
        const token = req.cookies.login_jwt;
        if (!token) {
            return res.status(401).redirect('/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).redirect('/login');
        }

        const mentor = await Mentor.findOne({ user_id: user._id });
        if (!mentor) {
            return res.status(404).redirect('/login');
        }
        req.user = user;
        req.mentor = mentor;

        next();
    } catch (err) {
        console.error('AuthMentor error:', err);
        res.status(401).redirect('/login');
    }
};