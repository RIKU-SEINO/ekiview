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

exports.transformRoutesService = (routes) => {
  const transformedRoutes = routes.map(route => {
    const allPolyline = [];
  
    const transformedLegs = route.legs.map(leg => ({
      distance: leg.distance,
      duration: leg.duration,
      steps: leg.steps.map(step => {
        const decodedStepPolyline = decodePolyline(step.polyline.points);
        decodedStepPolyline.unshift(step.start_location);
        for (let i = 0; i < decodedStepPolyline.length - 1; i++) {
          if (decodedStepPolyline[i].lat === decodedStepPolyline[i + 1].lat && decodedStepPolyline[i].lng === decodedStepPolyline[i + 1].lng) {
            decodedStepPolyline.splice(i, 1);
            i--;
          };
        };
        allPolyline.push(...decodedStepPolyline);
  
        return {
          distance: step.distance,
          duration: step.duration,
          end_location: step.end_location,
          html_instructions: step.html_instructions,
          polyline: {
            points: decodedStepPolyline
          },
          start_location: step.start_location,
          travel_mode: step.travel_mode
        };
      })
    }));
  
    return {
      overview_polyline: {
        points: decodePolyline(route.overview_polyline.points)
      },
      legs: transformedLegs,
      all_polyline: allPolyline
    };
  });

  return transformedRoutes;
};

/**
 * Decodes an encoded polyline string into an array of coordinates.
 *
 * @param {string} encoded - The encoded polyline string.
 * @returns {Array<Object>} An array of decoded coordinates (latitude and longitude).
 * 
 * @see https://stackoverflow.com/questions/15924834/decoding-polyline-with-new-google-maps-api
 */
const decodePolyline = (encoded) => {
  let index = 0;
  const length = encoded.length;
  const coordinates = [];
  let lat = 0;
  let lng = 0;

  while (index < length) {
    let shift = 0;
    let result = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += deltaLat;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += deltaLng;

    coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return coordinates;
};
