const { directionsApiService, transformRoutesService } = require('../services/googlemapsRouteSearchService');
const { fetchAllPanoramasAlongRouteService, constructStreetviewUrls } = require('../services/fetchPanoramasService');

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
    const response = await directionsApiService(searchParams);
    const { routes, status } = response;
    console.log(response);

    // Check if the response is successful
    if (status !== 'OK' || !routes || routes.length === 0) {
      throw new Error('Failed to get route information');
    }

    let transformedRoutes = transformRoutesService(routes);

    const currentPanoramaId = req.query.currentPanoramaId;
    console.log(currentPanoramaId);
    const panoramas =  await fetchAllPanoramasAlongRouteService(transformedRoutes[0], currentPanoramaId);
    const panoramaIds = panoramas.panoramaIds;
    const panoramaHeadings = panoramas.panoramaHeadings;
    console.log(panoramaIds);
    const streetviewUrls = await constructStreetviewUrls(panoramaIds, panoramaHeadings);
    transformedRoutes[0].streetviewUrls = streetviewUrls;
    transformedRoutes[0].headings = panoramaHeadings;

    res.status(200).json({
      routes: transformedRoutes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
