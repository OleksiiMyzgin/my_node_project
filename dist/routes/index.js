'use strict';

var express = require('express');
var router = express.Router();
var storeController = require('../controllers/storeController');
var userController = require('../controllers/userController');
var authController = require('../controllers/authController');
var reviewController = require('../controllers/reviewController');

var _require = require('../handlers/errorHandlers'),
    catchErrors = _require.catchErrors;

// req is object full of info that coming in
// res is object full of methods that sending data back to user 
// Do work here

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));
router.get('/add', authController.isLoggedIn, storeController.addStore);

router.post('/add', storeController.upload, catchErrors(storeController.resize), catchErrors(storeController.createStore));

router.post('/add/:id', storeController.upload, catchErrors(storeController.resize), catchErrors(storeController.updateStore));

router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoreByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoreByTag));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);

// 1. Validate the registration data
// 2. register the user
// 3. we need to log them in
router.post('/register', userController.validateRegister, userController.register, authController.login);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', authController.confirmedPassword, catchErrors(authController.update));

router.get('/map', storeController.mapPage);
router.get('/hearts', authController.isLoggedIn, catchErrors(storeController.getHearts));
router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));

router.get('/top', catchErrors(storeController.getTopStores));

/*
    API
 */

router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

module.exports = router;
//# sourceMappingURL=index.js.map