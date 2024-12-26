const axios = require('axios');
require('dotenv').config({ path: '../.env' });

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

exports.placesAutocomplete = async (params) => {
  const { input, sessiontoken, location, radius } = params;

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_MAPS_API_KEY}`;
  const query = {
    input,
    key: GOOGLE_MAPS_API_KEY,
    sessiontoken,
    ...(location && { location: `${location.lat},${location.lng}` }),
    ...(radius && { radius }),
  };

  try {
    const response = await axios.get(url, { params: query });
    return response.data; // Return the API response
  } catch (error) {
    throw new Error('Failed to fetch autocomplete suggestions: ' + error.message);
  }
};