const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  registerLocal,
  loginLocal,
  logout,
} = require('./auth');

router.post('/login', loginLocal);
router.get('/logout', logout);
router.post('/register', registerLocal);

module.exports = router;