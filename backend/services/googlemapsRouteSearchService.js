const axios = require('axios');
require('dotenv').config('../.env');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Service to call Google Maps Directions API
 * 
 * @param {Object} searchParams - search parameters containing origin and destination place_id
 * @param {string} searchParams.origin - place_id of origin
 * @param {string} searchParams.destination - place_id of destination
 * @param {string} searchParams.mode - travel mode (please set 'walking' in controller)
 * @returns {Promise<Object>} - Promise object represents the response from Google Maps Directions API
 * 
 * @example
 * // Input
 * const searchParams = {
 *  origin: 'ChIJn8hH6fuLGGARvhUirnza1u0',
 *  destination: 'ChIJ5yuSzsaLGGARA5M1HqiKxqU',
 *  mode: 'walking'
 * };
 * 
 * const response = await directionsAPIService(searchParams);
 * 
 * // Output
 * {
 *  'geocoded_waypoints': [...],
 *  'routes': [
 *     'bounds': {...},
 *     'legs': [
 *      {
 *       'distance': {...},
 *        ...
 *       'steps': [
 *           {
 *           'distance': {...},
 *           'duration': {...},
 *           'end_location': {...},
 *           'html_instructions': hogehoge,
 *           'polyline': { 'points': encoded polyline },
 *           'start_location': {...},
 *           'travel_mode': 'WALKING'
 *          },
 *         ...
 *        ],
 *        ...
 *       }
 *      ],
 *     'overview_polyline': { 'points': encoded polyline },
 *      ...,
 *    ],
 * 'status': 'OK'
 * }
 * 
 * @see https://developers.google.com/maps/documentation/directions/get-directions?hl=ja
 */
exports.directionsApiService = async (searchParams) => {
  const { origin, destination, mode } = searchParams;
  const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${origin}&destination=place_id:${destination}&mode=${mode}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(directionsUrl);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch directions: ' + error.message);
  };
}
