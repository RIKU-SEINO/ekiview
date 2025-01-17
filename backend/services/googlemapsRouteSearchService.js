const axios = require('axios');

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
 *           'building_level': { 'number': -1 },
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
  const { origin, destination, mode, language } = searchParams;
  const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${origin}&destination=place_id:${destination}&mode=${mode}&key=${GOOGLE_MAPS_API_KEY}&language=${language}`;

  try {
    const response = await axios.get(directionsUrl);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch directions: ' + error.message);
  };
}

/**
 * Transforms routes data into a usable structure
 *
 * @param {Array} routes - Array of routes returned from Google Maps Directions API
 * @returns {Array} - Transformed routes
 */
exports.transformRoutesService = (routes) => {
  return routes.map(route => {
    const allPolyline = [];
    const allBuildingLevels = [];
    const _allBuildingLevels = [];
    const allInstructions = [];
    const _allInstructions = [];
    let isInsideBuilding = true;
    let isFirstStep = true;

    const transformedLegs = route.legs.map(leg => {
      return {
        distance: leg.distance,
        duration: leg.duration,
        steps: leg.steps.map(step => {
          const decodedStepPolyline = decodePolyline(step.polyline.points);
          if (isFirstStep) {
            decodedStepPolyline.unshift(step.start_location);
            isFirstStep = false;
          };
          allPolyline.push(...decodedStepPolyline);

          const buildingLevel = step.building_level ? step.building_level.number : NaN;
          isInsideBuilding = isInsideBuilding && !isNaN(buildingLevel);

          // Fill building levels array
          decodedStepPolyline.forEach(() => {
            allBuildingLevels.push(buildingLevel);
            _allBuildingLevels.push(buildingLevel);
            allInstructions.push(step.html_instructions);
            _allInstructions.push(step.html_instructions);
          });

          return {
            distance: step.distance,
            duration: step.duration,
            end_location: step.end_location,
            html_instructions: step.html_instructions,
            polyline: { points: decodedStepPolyline },
            start_location: step.start_location,
            travel_mode: step.travel_mode
          };
        })
      };
    });

    // Update _allBuildingLevels for transitions
    for (let i = 0; i < allBuildingLevels.length - 1; i++) {
      if (allBuildingLevels[i] !== allBuildingLevels[i + 1]) {
        _allBuildingLevels[i] = allBuildingLevels[i + 1];
      }
    }

    // Update _allInstructions for transitions
    for (let i = 0; i < allInstructions.length - 1; i++) {
      if (allInstructions[i] !== allInstructions[i + 1]) {
        _allInstructions[i] = allInstructions[i + 1];
      }
    }

    // Remove duplicates in polylines, building levels and instructions
    const result = filterArrays(allPolyline, [_allBuildingLevels, _allInstructions]);

    return {
      overview_polyline: { points: decodePolyline(route.overview_polyline.points) },
      legs: transformedLegs,
      all_polyline: result.mainArray,
      all_building_levels: result.subArrays[0],
      is_inside_building: isInsideBuilding,
      all_instructions: result.subArrays[1]
    };
  });
};

/**
 * Filters two arrays to remove duplicates while keeping them in sync
 *
 * @param {Array} mainArray - The main array to filter
 * @param {Array<Array>} subArrays - The sub arrays to filter. Elements at the same indices as in the mainArray will be removed
 * @returns {Object} - Object containing filtered arrays
 */
function filterArrays(mainArray, subArrays) {
  for (let i = 0; i < subArrays.length; i++) {
    const subArray = subArrays[i];
    if (subArray.length !== mainArray.length) {
      throw new Error('Sub arrays must have the same length as the main array');
    };
  };

  const seen = new Set();
  const filteredMainArray = [];
  const filteredSubArrays = subArrays.map(() => []);

  mainArray.forEach((element, index) => {
    const key = JSON.stringify(element);
    if (!seen.has(key)) {
      seen.add(key);
      filteredMainArray.push(element);
      subArrays.forEach((subArray, i) => {
        filteredSubArrays[i].push(subArray[index]);
      });
    };
  });

  return { mainArray: filteredMainArray, subArrays: filteredSubArrays };
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
