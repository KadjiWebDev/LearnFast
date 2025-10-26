// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_picture: { type: String }, // Edit Profile
  full_name: { type: String },
  bio: { type: String }, // Edit Profile
  birthday: { type: Date },
  role: { type: String, enum: ['student', 'mentor'], required: true }
}, { timestamps: true }); // auto create createdAt updatedAt

module.exports = mongoose.model('User', userSchema);

