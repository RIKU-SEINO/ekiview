const directionsApiService = require('../services/googlemapsRouteSearchService');

/**
 * Controller to call Google Maps Directions API
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<Object>} - Promise object represents the response from Google Maps Directions API
 * 
 * @example
 * // Request body
 * {
 *   origin: 'ChIJn8hH6fuLGGARvhUirnza1u0',
 *   destination: 'ChIJ5yuSzsaLGGARA5M1HqiKxqU'
 * }
 * 
 * // Response
 * {
 *  'routes': [
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
 *           'polyline': { 'points': decoded polyline },
 *           'start_location': {...},
 *           'travel_mode': 'WALKING'
 *          },
 *         ...
 *        ],
 *        ...
 *       }
 *      ],
 *     'overview_polyline': { 'points': decoded polyline },
 *  ]
 * }
 */
exports.routeSearch = async (req, res) => {
  
  const searchParams = {
    origin: req.query.origin,
    destination: req.query.destination,
    mode: 'walking'
  };

  try {
    const response = await directionsApiService.directionsApiService(searchParams);
    const { routes, status } = response;
    console.log(response);

    // Check if the response is successful
    if (status !== 'OK' || !routes || routes.length === 0) {
      throw new Error('Failed to get route information');
    }

    // 出力形式を変換
    const transformedRoutes = routes.map(route => ({
      overview_polyline: {
        points: decodePolyline(route.overview_polyline.points)
      },
      legs: route.legs.map(leg => ({
        distance: leg.distance,
        duration: leg.duration,
        steps: leg.steps.map(step => ({
          distance: step.distance,
          duration: step.duration,
          end_location: step.end_location,
          html_instructions: step.html_instructions,
          polyline: {
            points: decodePolyline(step.polyline.points)
          },
          start_location: step.start_location,
          travel_mode: step.travel_mode
        }))
      }))
    }));

    res.status(200).json({
      routes: transformedRoutes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
