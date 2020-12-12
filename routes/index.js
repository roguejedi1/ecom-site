const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});
const passport = require('passport');
const { getRegister ,postRegister, getLogin, postLogin, getLogout, getProfile, updateProfile, getForgotPw, putForgotPw, getReset, putReset } = require('../controllers/index');
const { asyncErrorHandler, isLoggedIn, isValidPassword, changePassword, deleteProfileImage} = require('../middleware');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ecommerce-Home' });
});

/* GET Register page. */
router.get('/register', getRegister);

/* POST Register page. */
router.post('/register', upload.single('image') ,postRegister);

/* GET login page. */
router.get('/login', getLogin);

/* GET home page. */
router.post('/login', postLogin);

// GET logout page
router.get('/logout', getLogout);

/* GET profile page. */
router.get('/profile', isLoggedIn ,getProfile);

/* PUT specific users profile page. */
router.put('/profile', isLoggedIn, upload.single('image') ,isValidPassword, changePassword, updateProfile);

/* GET forgot password page */
router.get('/forgot-password', getForgotPw);

/* PUT forgot password page */
router.put('/forgot-password', putForgotPw);

/* GET forgot password page */
router.get('/reset/:token', getReset);

/* GET forgot password page */
router.put('/reset/:token', putReset);

module.exports = router;
