const axios = require('axios');
const cacheService = require('./cacheService');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// TODO: GoogleMaps APIなどのAPIクライアント(APIを呼び出すモジュール)を作成
// TODO: 目的地検索や経路検索する際にGoogle Maps APIを使用するのでここでクライアントを追加する感じかな

exports.generateTilesAPISessionToken = async (req, res) => {
  const createSessionUrl = `https://tile.googleapis.com/v1/createSession?key=${GOOGLE_MAPS_API_KEY}`;

  const data = {
    mapType: "streetview",
    language: "en-US",
    region: "US",
  };

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(createSessionUrl, data, { headers });
    const sessionToken = response.data.session;
    return sessionToken;
  } catch (error) {
    throw new Error('Failed to create session token: ' + error.message);
  };
};

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Call the Google Maps Place Autocomplete API
 * @param {string} input - User input for place search
 * @param {string} sessionToken - A session token for the request
 * @returns {Promise<Object>} - API response
 */
const callPlaceAutocompleteAPI = async (input, language, sessionToken) => {
  const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_MAPS_API_KEY}&sessiontoken=${sessionToken}&language=${language}&locationbias=ipbias`;

  const cacheKey = `autocomplete-${input}-${language}`;
  try {
    const cachedSuggestions = await cacheService.get(cacheKey);
    if (cachedSuggestions) {
      return JSON.parse(cachedSuggestions);
    } else {
      const response = await axios.get(autocompleteUrl);
      const suggestions = response.data;
      await cacheService.set(cacheKey, JSON.stringify(suggestions));
      return suggestions;
    }
  } catch (error) {
    throw new Error('Failed to fetch autocomplete suggestions: ' + error.message);
  }
};

/**
 * Call the Google Maps Place Details API
 * 
 * @param {string} placeId - A place ID for the request
 * @returns {Promise<Object>} - API response
 */
const callPlaceDetailsAPI = async (placeId, language) => {
  const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Cgeometry&place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}&language=${language}`;

  const cacheKey = `placeDetails-${placeId}-${language}`;
  try {
    const cachedDetails = await cacheService.get(cacheKey);
    if (cachedDetails) {
      return JSON.parse(cachedDetails);
    } else {
      const response = await axios.get(placeDetailsUrl);
      const details = response.data;
      await cacheService.set(cacheKey, JSON.stringify(details));
      return details;
    }
  } catch (error) {
    throw new Error('Failed to fetch place details: ' + error.message);
  }
};

module.exports = {
  generateUUID,
  callPlaceAutocompleteAPI,
  callPlaceDetailsAPI,
};