const express = require('express');
const router = express.Router();
const placeSearchController = require('../controllers/placeSearchController');

router.get('/placesearch', placeSearchController.getPlaceSuggestions);

module.exports = router;