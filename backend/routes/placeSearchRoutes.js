const express = require('express');
const router = express.Router();
const placeSearchController = require('../controllers/placeSearchController');

router.get('/autocomplete', placeSearchController.autocompleteHandler);
router.get('/details', placeSearchController.placeDetailsHandler);

module.exports = router;