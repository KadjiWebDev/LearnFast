// routes/api/apiRoutes.js
const express = require('express');
const router = express.Router();
const courseAPIRoutes = require('./courseAPIRoutes')
const { updateProfile, getProfile } = require('../../controllers/mentorController')
const upload = require('../../middleware/uploadMiddleware')
const { authMentor } = require('../../middleware/authMentor')
router.use('/courses', courseAPIRoutes) // localhost:3000/api/courses

router.post('/mentor/profile', authMentor, upload.single('profile_picture'), updateProfile);
router.get('/mentor/profile', getProfile)



module.exports = router;



