// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payed_courses: { type: Number, default: 0 },
  hours_spent: { type: Number, default: 0 },
  title:{type:String},
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);

