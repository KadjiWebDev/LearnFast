const express = require('express');
const path = require('path');
const { authMentor, RedAuthMentor } = require('../../../middleware/authMentor');

const { RetrieveInfo, updatePortfolio } = require('../../../controllers/mentorController');
const router = express.Router();

router.get('/', RedAuthMentor, (req, res) => {
  res.sendFile(path.join(__dirname, '../../../views/dashboards/Mentors/index.html'));
});
router.get('/profile', RedAuthMentor, (req, res) => {
  res.sendFile(path.join(__dirname, '../../../views/dashboards/Mentors/profile.html'));
});
router.get('/edit-course', RedAuthMentor, (req, res) => {
  res.sendFile(path.join(__dirname, '../../../views/dashboards/Mentors/edit-course.html'));
});
router.get('/edit-profile', RedAuthMentor, (req, res) => {
  res.sendFile(path.join(__dirname, '../../../views/dashboards/Mentors/edit-profile.html'));
});
router.get('/create-room', RedAuthMentor, (req, res) => {
  res.sendFile(path.join(__dirname, '../../../views/dashboards/Mentors/create-room.html'));
});



router.get('/me', authMentor, RetrieveInfo)
router.post('/update/portfolio', authMentor, updatePortfolio)
module.exports = router;
