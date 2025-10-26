
// models/BroadcastLink.js
const mongoose = require('mongoose');

const broadcastLinkSchema = new mongoose.Schema({
  mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  slug: { type: String, required: true } // randomCharacters
}, { timestamps: true });

module.exports = mongoose.model('BroadcastLink', broadcastLinkSchema);

