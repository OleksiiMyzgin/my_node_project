const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// req is object full of info that coming in
// res is object full of methods that sending data back to user 
// Do work here

router.get('/', storeController.homePage)

module.exports = router;