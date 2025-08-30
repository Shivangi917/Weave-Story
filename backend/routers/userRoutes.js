const express = require('express');
const { signupController, verifyEmailController, loginController } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', signupController);
router.post('/verifyEmail', verifyEmailController);
router.post('/login', loginController);

module.exports = router;