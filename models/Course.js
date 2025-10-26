// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  link: { type: String, required: true },
  previewImage:{type:String, required:true},
  previewVideo:{type:String, required:true},
  rating:{type:String, required:true},
  views:{type:String, required:true},
  title: { type: String, required: true },
  description: { type: String, required:true },
  level:{type:String, enum:['Beginner','Intermediate','Advanced'], required:true},
  pricing: { type: Number, required: true },
  mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

