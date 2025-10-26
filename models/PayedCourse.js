// models/PayedCourse.js
const mongoose = require('mongoose');

const payedCourseSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 },
  payed_at: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PayedCourse', payedCourseSchema);
