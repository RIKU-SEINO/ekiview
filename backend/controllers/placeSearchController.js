const googleMapsService = require('../services/googlemapsService');

exports.placeSearchHandler = async (req, res) => {
  const { input, sessionToken: existingSessionToken } = req.query;

  // Step 1: Generate or use provided session token
  const sessionToken = existingSessionToken || googleMapsService.generateUUID();

  // Step 2: If input is empty, return session token only
  if (!input) {
    return res.status(200).json({ sessionToken });
  }

  try {
    // Step 3: Call Google Maps Place Autocomplete API
    const autocompleteSuggestions = await googleMapsService.callPlaceAutocompleteAPI(
      input,
      sessionToken
    );

    res.status(200).json({
      sessionToken,
      autocompleteSuggestions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};