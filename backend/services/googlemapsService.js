const axios = require('axios');
require('dotenv').config({ path: '../.env' });

//const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const GOOGLE_MAPS_API_KEY="AIzaSyDG9PtzfIGV-IbS9mbpSTLkM3UxmPnyrVY"
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
const callPlaceAutocompleteAPI = async (input, sessionToken) => {
  const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${GOOGLE_MAPS_API_KEY}&sessiontoken=${sessionToken}`;

  try {
    const response = await axios.get(autocompleteUrl);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch autocomplete suggestions: ' + error.message);
  }
};

module.exports = {
  generateUUID,
  callPlaceAutocompleteAPI,
};