const express = require('express');
const router = express.Router();
const passport = require('passport');


const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');



router.get('/', passport.checkAuthentication, homeController.home);

router.get('/login', authController.login);
router.get('/register', authController.register);

router.get('/cart', cartController.home);
router.post('/update-cart', cartController.update);

router.post('/create', authController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/login'},
), authController.createSession);


router.get('/logout', authController.destroySession);

module.exports = router;