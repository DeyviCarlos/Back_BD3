const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { adminAuth, userAuth } = require("../middleware/auth");

router.post('/login/admin',authController.login);
router.post('/login/user',authController.login);
router.post('/register',authController.register);
//router.get('/logout',authController.logout);

module.exports = router;