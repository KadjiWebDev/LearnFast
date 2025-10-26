
const express = require('express');
const path = require('path');
const { RetrieveInfo } = require('../../../controllers/studentController');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../views/dashboards/Students/index.html'));
});
router.get('/enroll', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../views/dashboards/Students/enroll_payment.html'));
});
router.get('/join-room', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../views/dashboards/Students/join-room.html'));
});
router.get('/meeting', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../views/dashboards/Students/meeting.html'));
});

router.get('/me', RetrieveInfo)

module.exports = router;