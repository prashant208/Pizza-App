const express = require('express');
const router = express.Router();
const passport = require('passport');


const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const AdminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');
const admin = require('../app/http/middlewares/admin');



router.get('/', homeController.home);

router.get('/login', authController.login);
router.get('/register', authController.register);

router.get('/cart', cartController.cart);
router.post('/update-cart', cartController.update);

// Customer routes
router.post('/orders', passport.checkAuthentication, orderController.store);
router.get('/customer/orders', passport.checkAuthentication, orderController.custm);
router.get('/customer/orders/:id', passport.checkAuthentication, orderController.show);

// Admin Routes
router.get('/admin/orders', admin, AdminOrderController.adminorder);
router.post('/admin/order/status', admin, statusController.update);


router.post('/create', authController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/login'},
), authController.createSession);


router.get('/logout', authController.destroySession);

module.exports = router;