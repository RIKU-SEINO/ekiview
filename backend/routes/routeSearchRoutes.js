const express = require('express');
const router = express.Router();
const routeSearchController = require('../controllers/routeSearchController');

module.exports = router;

router.get('/search', routeSearchController.routeSearch);
