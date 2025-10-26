const jwt = require('jsonwebtoken');
const Course = require('../models/Course');
const dotenv = require('dotenv');
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const User = require('../models/User');
const payCourse = require('../models/PayedCourse');

dotenv.config();


// addCourse, deleteCourse, modifyCourse, getCourse, getCourses

exports.addCourse = async (req, res) => {
  try {

    const { link, previewImage, previewVideo, title, description, level, pricing } = req.body;
    const { mentor } = req

    const newCourse = await Course.create({
      link,
      previewImage,
      previewVideo,
      title,
      description,
      level,
      pricing,
      views: 0,
      rating: 0,
      mentor_id: mentor._id,
    });
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (e) {
    console.error('Error while creating the course:', e.message);
    res.status(400).json({ error: 'Error while creating the course' });
  }
};
exports.deleteCourse = async (req, res) => {
  const { id } = req.params
  try {
    //if mentor_id = decodedToken.id
    await Course.findByIdAndDelete(id);
    res.status(200).json({ 'message': 'Succesfully deleted' })
  } catch (e) {

  }
}
exports.modifyCourse = async (req, res) => {
  try {
    //verification if this mentor owns this course
    const { id } = req.params
    const { title, description, link, previewImage, previewVideo, level, pricing } = req.body
    const course = await Course.findById(id)
    course.title = title;
    course.description = description;
    course.link = link;
    course.previewImage = previewImage;
    course.previewVideo = previewVideo;
    course.level = level;
    course.pricing = pricing;
    await course.save();
    res.status(200).json({ "message": "Successfully updated the course" })
  }
  catch (e) { }
}
exports.getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the course by ID
    const course = await Course.findById(id)
      .populate({
        path: 'mentor_id',
        populate: {
          path: 'user_id',
          select: 'full_name' // Only get the username field
        }
      }); // => mentor_id.user_id.username
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (e) {
    console.error('Error while fetching course:', e.message);
    res.status(400).json({ error: 'Error while fetching course' });
  }
};
exports.payCourse = async (req, res) => {
  try {
    const token = retrieveToken(req.header('Authorization'));
    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing or invalid' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and student
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const student = await Student.findOne({ user_id: user._id });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const { id: courseId } = req.params;
    // Check if course already paid
    const existing = await payCourse.findOne({ student_id: student._id, course_id: courseId });
    if (existing) {
      return res.status(400).json({ error: 'You have already bought this course!' });
    }
    // Create a new paid course record
    const newPayment = new payCourse({
      student_id: student._id,
      course_id: courseId,
      payed_at: new Date(),
    });
    await newPayment.save();
    return res.status(200).json({ message: 'Successfully bought the course!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error while buying this course!' });
  }
};

exports.getCourses = async (req, res) => { }