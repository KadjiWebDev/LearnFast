const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const Student = require('../models/Student');
const Course = require('../models/Course');
const PayedCourse = require('../models/PayedCourse')

dotenv.config();

function retrieveToken(authHeader) {
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    return (token)
}

exports.RetrieveInfo = async (req, res) => {
    token = retrieveToken(req.header('Authorization'))
    if (!token) {
        return res.status(401).json({ error: 'Authorization token missing or invalid' });
    }

    decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decodedToken.id).select('-password'); // exclude password
    const student = await Student.findOne({ 'user_id': user._id })
    const Allcourses = await Course.find();
    const payedCourse = await PayedCourse.find({ 'student_id': student._id }).populate('course_id');
    res.status(200).json({
        "user": {
            "username": user.username,
            "full_name": user.full_name,
            "profile_picture": user.profile_picture || '/default_image.jpg',
            "bio": user.bio || 'Hello LearnFast! I am here to give you best experience in learning',
            "birthday": user.birthday,
            "role": user.role
        },

        "student": {
            "hours_spent": student.hours_spent || 0,
            "title": student.title || 'Not provided yet',
            "AllCourses": Allcourses.map(course => ({
                "id": course._id,
                "link": course.link,
                "previewImage": course.previewImage,
                "previewVideo": course.previewVideo,
                "rating": course.rating,
                "views": course.views,
                "title": course.title,
                "description": course.description,
                "level": course.level,
                "pricing": course.pricing
            })),
            "PayedCourses": payedCourse.map(course => ({
                "progress": course.progress,
                "payed_at": course.payed_at,
                "title":course.course_id.title,
                "description":course.course_id.description
            }))

        }
    })
}