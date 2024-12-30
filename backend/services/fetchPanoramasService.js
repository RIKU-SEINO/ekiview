const { tilesApiGenerateSessionTokenService, tilesApiMetadataService, tilesApiStreetviewService } = require('./googlemapsTilesFetchService');

/**
 * Service to fetch all panorama ids and headings along the route
 * 
 * @param {Object} route - The route object
 * @param {string} currentPanoramaId - The current panorama ID
 * @returns {Object} - The object containing the panorama IDs and headings
 *  example: { panoramaIds: [panoramaId1, panoramaId2, ...], panoramaHeadings: [heading1, heading2, ...] }
*/
exports.fetchAllPanoramasAlongRouteService = async (route, currentPanoramaId) => {
  console.log("Panorama Search Start");

  const sessionToken = await tilesApiGenerateSessionTokenService();

  const panoramaIds = [currentPanoramaId];
  const panoramaHeadings = [];
  let cpaId = currentPanoramaId;
  let update = false;

  let i = 0;
  while (i < route['all_polyline'].length - 1) {
    if (!update) {
      const cpaMetadata = await tilesApiMetadataService(sessionToken, cpaId);

      // Handle empty links
      if (!cpaMetadata.links || cpaMetadata.links.length === 0) {
        console.error("No links available for panorama: ", cpaId);
        break;
      }

      var cpaLinks = cpaMetadata.links;
      var cpaCartesian = latLngToXY(cpaMetadata.originalLat, cpaMetadata.originalLng);
    }

    const cpo = route['all_polyline'][i];
    const npo = route['all_polyline'][i + 1];
    const cpoCartesian = latLngToXY(cpo.lat, cpo.lng);
    const npoCartesian = latLngToXY(npo.lat, npo.lng);

    const vecCpo2Npo = vec(cpoCartesian, npoCartesian);
    const vecNpo2Cpa = vec(npoCartesian, cpaCartesian);
    const vecNpo2Cpo = vec(npoCartesian, cpoCartesian);
    const cosine = cosineBetweenVectors(vecNpo2Cpa, vecNpo2Cpo);

    // If the cosine is negative, the next point is ahead of the current point, update the cpo and npo
    if (cosine < 0) {
      update = true;
      i++;
      continue;
    }

    update = false;
    let minScore = Infinity;
    let npaId = cpaId;
    let bestHeading = null;

    // Find the best panorama along the route
    for (const link of cpaLinks) {
      const apaId = link.panoId;
      const apaHeadingFromCpa = link.heading;
      const npoHeadingFromCpo = degrees(Math.atan2(vecCpo2Npo.y, vecCpo2Npo.x));
      const score = calculateAngleDifference(apaHeadingFromCpa, npoHeadingFromCpo);

      if (score < minScore && !panoramaIds.includes(apaId)) {
        minScore = score;
        npaId = apaId;
        bestHeading = apaHeadingFromCpa;
      }
    }

    if (npaId === cpaId) {
      console.error("Panorama Fetch along the route failed");
      break;
    }

    // If the angle difference is too high, the route is likely incorrect, so backtrack
    if (minScore > 70) {
      console.warn("High angle difference detected, backtracking...");
      panoramaIds.pop();
      panoramaHeadings.pop();
      cpaId = panoramaIds[panoramaIds.length - 1];
      continue;
    }

    panoramaIds.push(npaId);
    panoramaHeadings.push(bestHeading);
    cpaId = npaId;
    cpaCartesian = npoCartesian;
    console.log("次のid: " + cpaId);
  };

  return { 
    panoramaIds: panoramaIds,
    panoramaHeadings: panoramaHeadings
  };
};

exports.constructStreetviewUrls = async (panoramaIds, panoramaHeadings) => {
  const streetviewUrls = [];
  for (let i = 0; i < panoramaIds.length; i++) {
    const panoramaId = panoramaIds[i];
    const heading = panoramaHeadings[i];
    const pitch = 10;
    const fov = 90;
    const height = 450;
    const width = 600;

    const streetviewUrl = await tilesApiStreetviewService(
      panoramaId,
      heading,
      pitch,
      fov,
      height,
      width
    );
    streetviewUrls.push(streetviewUrl);
  }
  return streetviewUrls;
}

/**
 * convert radians to degrees
 * 
 * @param {float} radians
 * @returns {float} - degrees
*/
const degrees = (radians) => radians * (180 / Math.PI);

const radians = (degrees) => degrees * (Math.PI / 180);

/**
 * convert latitude and longitude to plane rectangular coordinates (Gauss-Kruger projection)
 * 
 * @param {float} lat degree
 * @param {float} lng degree
 * @returns {Object} - { x: x-coordinate, y: y-coordinate }
 */
const latLngToXY = (lat, lng) => {
  // 楕円体定数 (GRS80)
  const a = 6378137.0; // 長半径 (m)
  const f = 1 / 298.257222101; // 扁平率
  const e2 = 2 * f - f * f; // 第一離心率の2乗

  // ラジアンに変換
  const latRad = radians(lat);
  const lonRad = radians(lng);
  const centralMeridian = 135; // 中央子午線 (度)
  const centralMeridianRad = centralMeridian * Math.PI / 180;

  // 子午線弧長を計算
  const n = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
  const t = Math.tan(latRad);
  const eta2 = (e2 / (1 - e2)) * Math.cos(latRad) * Math.cos(latRad);

  // 子午線弧長 (m)
  const m0 = a * (
      (1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 * e2 * e2 / 256) * latRad
      - (3 * e2 / 8 + 3 * e2 * e2 / 32 + 45 * e2 * e2 * e2 / 1024) * Math.sin(2 * latRad)
      + (15 * e2 * e2 / 256 + 45 * e2 * e2 * e2 / 1024) * Math.sin(4 * latRad)
      - (35 * e2 * e2 * e2 / 3072) * Math.sin(6 * latRad)
  );

  // 経度差
  const deltaLambda = lonRad - centralMeridianRad;

  // 平面直角座標系の計算
  const x = m0 + n * t * (
      deltaLambda * deltaLambda / 2
      + (5 - t * t + 9 * eta2 + 4 * eta2 * eta2) * deltaLambda * deltaLambda * deltaLambda * deltaLambda / 24
      + (61 - 58 * t * t + t * t * t * t) * deltaLambda * deltaLambda * deltaLambda * deltaLambda * deltaLambda * deltaLambda / 720
  );
  const y = n * (
      deltaLambda
      + (1 - t * t + eta2) * deltaLambda * deltaLambda * deltaLambda / 6
      + (5 - 18 * t * t + t * t * t * t + 14 * eta2 - 58 * t * t * eta2) * deltaLambda * deltaLambda * deltaLambda * deltaLambda * deltaLambda / 120
  );
  
  return { x: x, y: y };
};

/**
 * compute the vector between two points
 * 
 * @param {Object} point1 - { x: x-coordinate, y: y-coordinate }
 * @param {Object} point2 - { x: x-coordinate, y: y-coordinate }
 * @returns {Object} - { x: x-coordinate, y: y-coordinate }
 */
const vec = (point1, point2) => {
  return {
    x: point2.x - point1.x,
    y: point2.y - point1.y
  }
}

/**
 * compute the cosine of the angle between two vectors
 * 
 * @param {Array} v1
 * @param {Array} v2
 * @returns {float} - cosine of the angle between two vectors
 */
const cosineBetweenVectors = (v1, v2) => {
  const dotProduct = v1.x * v2.x + v1.y * v2.y;
  const magnitudeV1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
  const magnitudeV2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
  
  return dotProduct / (magnitudeV1 * magnitudeV2);
};

/**
 * normalize the angle to be within -180 to 180 degrees
 * 
 * @param {float} angle
 * @returns {float} - normalized angle
 */
const normalizeAngle = (angle) => {
  while (angle > 180) {
    angle -= 360
  };
  while (angle < -180) {
    angle += 360
  };

  return angle;
}

/**
 * calculate the angle difference between two angles
 * 
 * @param {float} angle1
 * @param {float} angle2
 * @returns {float} - angle difference
 */
const calculateAngleDifference = (angle1, angle2) => {
  const diff = angle1 - angle2;
  return Math.abs(normalizeAngle(diff));
};