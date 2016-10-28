/* Router and Handlers */
const express = require('express');
const router = express.Router();

const requireLoginMiddleware = require('./login-middleware');
const homeCtrl = require('../controllers/home');
const dashboardCtrl = require('../controllers/dashboard');
const authCtrl = require('../controllers/auth');
const storeCtrl = require('../controllers/store');

router.get('/', homeCtrl.home);

router.get('/dashboard', requireLoginMiddleware, dashboardCtrl.get);
router.post('/dashboard', requireLoginMiddleware, dashboardCtrl.post);

router.get('/signup', authCtrl.getSignup);
router.post('/signup', authCtrl.postSignup);
router.get('/login', authCtrl.getLogin);
router.post('/login', authCtrl.postLogin);
router.get('/logout', authCtrl.logout);

router.get('/manage', requireLoginMiddleware, storeCtrl.manageStore);
router.get('/store/:storeID', storeCtrl.viewStore);
router.post('/store/update', requireLoginMiddleware, storeCtrl.addItemToStore);

module.exports = router;
