const express = require('express');
const router = express.Router();

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');

router.get('/', homeController.home);
router.get('/login', authController.login);
router.get('/register', authController.register);


router.get('/cart', cartController.home);
router.post('/update-cart', cartController.update);

module.exports = router;