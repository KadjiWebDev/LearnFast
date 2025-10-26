// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { payCourse, addCourse, deleteCourse, modifyCourse, getCourse, getCourses } = require('../../controllers/courseController');
const { authMentor } = require('../../middleware/authMentor');

router.post('/add', authMentor, addCourse);  // localhost:3000/api/courses/add

router.post('/delete/:id', authMentor, deleteCourse);

router.post('/modify/:id', authMentor, modifyCourse);

router.get('/:id', authMentor, getCourse);

router.post('/pay/:id', payCourse)
router.get('/', getCourses);


module.exports = router;

