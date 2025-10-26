// models/Follower.js
const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Follower', followerSchema);

