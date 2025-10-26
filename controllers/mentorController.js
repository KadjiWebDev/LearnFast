const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const Mentor = require('../models/Mentor');
const Course = require('../models/Course');

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
  const mentor = await Mentor.findOne({ 'user_id': user._id })
  const courses = await Course.find({ 'mentor_id': mentor._id })
  res.status(200).json({
    "user": {
      "username": user.username,
      "full_name": user.full_name,
      "profile_picture": user.profile_picture || '/default_image.jpg',
      "bio": user.bio || 'Hello LearnFast! I am here to give you best experience in learning',
      "birthday": user.birthday,
      "role": user.role
    },

    "mentor": {
      "linkedIN": mentor.linkedIN || 'Not provided yet',
      "instagram": mentor.instagram || 'Not provided yet',
      "facebook": mentor.facebook || 'Not provided yet',
      "portfolio": mentor.portfolio || 0,
      "portfolioName": mentor.portfolioName || 'Not completed yet',
      "title": mentor.title || 'Profesional Mentor',
      "courses": courses.map(course => ({
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
      }))

    }
  })
}

exports.updatePortfolio = async (req, res) => {
  token = retrieveToken(req.header('Authorization'))
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing or invalid' });
  }

  decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decodedToken.id).select('-password'); // exclude password
  const mentor = await Mentor.findOne({ 'user_id': user._id })
  mentor.portfolio = req.body.file
  mentor.portfolioName = req.body.title
  const result = await mentor.save();
  if (result) {
    res.status(200)
  }

}

exports.updateProfile = async (req, res) => {
  try {
    const { user, mentor } = req;
    const { full_name, username, bio, birthday, title, linkedIN, instagram, facebook, portfolio } = req.body;

    user.full_name = full_name;
    user.username = username;
    user.bio = bio;
    user.birthday = birthday;
    mentor.title = title;
    mentor.linkedIN = linkedIN;
    mentor.instagram = instagram;
    mentor.facebook = facebook;
    mentor.portfolio = portfolio;
    if (req.file) {
      const oldProfile = user.profile_picture;

      if (oldProfile && oldProfile !== '/default_image.jpg') {
        const oldPath = path.join(__dirname, '..', '..', oldProfile);

        fs.access(oldPath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldPath, (unlinkErr) => {
              if (unlinkErr) console.error('Error deleting old profile:', unlinkErr);
              else console.log('Deleted old profile picture:', oldProfile);
            });
          }
        });
      }
      user.profile_picture = `/uploads/${req.file.filename}`;
    }

    await user.save();
    await mentor.save();


    await user.save();
    await mentor.save();

    res.status(200).json({ message: 'Successfully updated your profile' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error while updating profile' });
  }
};

exports.getProfile = async (req, res) => {

  try {
    token = retrieveToken(req.header('Authorization'))
    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing or invalid' });
    }

    decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decodedToken.id).select('-password'); // exclude password
    const mentor = await Mentor.findOne({ 'user_id': user._id })
    res.status(200).json({
      full_name: user.full_name,
      username: user.username,
      bio: user.bio,
      birthday: user.birthday,
      title: mentor.title,
      linkedIN: mentor.linkedIN,
      instagram: mentor.instagram,
      facebook: mentor.facebook,
      portfolio: mentor.portfolio,
      profile_picture: user.profile_picture
    })
  } catch (e) {
    res.status(400)
  }
}
