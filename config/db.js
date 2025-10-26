// db.js
const mongoose = require('mongoose');

function connect(){
  mongoose.connect('mongodb://localhost:27017/LearnFast')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));
}
module.exports = connect;