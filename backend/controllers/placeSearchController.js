const googleMapsService = require('../services/googlemapsService');

/**
 * Controller to handle Place Autocomplete requests
 * 
 * @param {Object} req - Request object containing query parameters
 * @param {Object} res - Response object to send back results
 * @returns {Promise<void>} - Sends response to client
 */
exports.getPlaceSuggestions = async (req, res) => {
  const { input, sessiontoken, location, radius } = req.query;

  if (!input || !sessiontoken) {
    return res.status(400).json({ message: 'Input and sessiontoken are required.' });
  }

  try {
    const params = {
      input,
      sessiontoken,
      location: location ? JSON.parse(location) : undefined, // Parse location if provided
      radius: radius ? parseInt(radius, 10) : undefined,
    };

    const suggestions = await placesService.placesAutocomplete(params);

    // Return suggestions
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};