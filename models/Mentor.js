// models/Mentor.js
const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  // Bonus Information about Mentor (Edit Profile)
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  linkedIN: { type: String },
  instagram: { type: String },
  facebook: { type: String },
  portfolio: { type: String },
  portfolioName:{type:String},
  title: {type:String},
}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);

