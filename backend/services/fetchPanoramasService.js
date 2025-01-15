const { tilesApiGenerateSessionTokenService, tilesApiMetadataService, tilesApiStreetviewService } = require('./googlemapsTilesFetchService');
const { PanoramaConnections } = require('../models');
const { Op } = require('sequelize');

/**
 * Service to fetch all panorama ids and headings along the route
 * 
 * @param {Object} route - The route object
 * @param {string} currentPanoramaId - The current panorama ID
 * @returns {Object} - The object containing the panorama IDs and headings
 *  example: { panoramaIds: [panoramaId1, panoramaId2, ...], panoramaHeadings: [heading1, heading2, ...], routeStepIdsInPanoramaIds: [routeStepId1, routeStepId1, routeStepId2, routeStepId3, routeStepId3, ...] }
*/
exports.fetchAllPanoramasAlongRouteService = async (route, currentPanoramaId) => {
  console.log("Panorama Search Start");

  const sessionToken = await tilesApiGenerateSessionTokenService();
  const panoramaIds = [currentPanoramaId];
  const panoramaHeadings = [];
  const blacklistedPanoramaIds = [];
  const routeStepIdsInPanoramaIds = [];
  const connectionsIds = [];
  const targetPanoramaIds = []; // ルート上の各ステップで、ターゲットとしているパノラマIDを格納
  let cpaId = currentPanoramaId;
  let update = false;

  // ルート上で、階段の入り口のパノラマIDを全て取得
  for (let j=0; j<route['all_polyline'].length; j++) {
    targetPanoramaIds.push(null);

    const cpoBuildingLevel = route['all_building_levels'][j];
    const cpoLat = route['all_polyline'][j].lat;
    const cpoLng = route['all_polyline'][j].lng;
    const npoBuildingLevel = route['all_building_levels'][j + 1];
    const buildingLevelComparison = cpoBuildingLevel > npoBuildingLevel ? -1 : cpoBuildingLevel < npoBuildingLevel ? 1 : 0;
    if (buildingLevelComparison === 0) continue;

    const cpoPanoramaConnectionsWithDirection = await PanoramaConnections.findAll({
      where: {
        connection_id: {
          [Op.notIn]: connectionsIds
        },
        building_level_comparison: buildingLevelComparison,
        building_level: cpoBuildingLevel,
      }
    });

    // 各cpoPanoramaConnectionの中で、cpoからの距離が最も近いものを選択
    let minDistance = Infinity;
    for (const connectionWithDirection of cpoPanoramaConnectionsWithDirection) {
      const distance = haversineDistance(cpoLat, cpoLng, connectionWithDirection.panorama_lat, connectionWithDirection.panorama_lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestConnectionWithDirection = connectionWithDirection;
      }
    }
    // nearestConnectionWithDirectionが見つかった場合、ターゲットとしてのパノラマIDをnearestConnectionWithDirection.panorama_idに設定
    if (minDistance !== Infinity) {
      connectionsIds.push(nearestConnectionWithDirection.connection_id);
      // targetPanoramaIdsのnullを全てnearestConnectionWithDirection.panorama_idに置き換える
      for (let k=0; k<targetPanoramaIds.length; k++) {
        if (targetPanoramaIds[k] === null) {
          targetPanoramaIds[k] = nearestConnectionWithDirection.panorama_id;
        }
      }
    }
  };
  console.log("targetPanoramaIds: ", targetPanoramaIds);

  // targetPanoramaIdsのuniqueな値を取得
  const supportPanoramaIdsToTargetPanoramaId = {};
  const supportPanoramaHeadingsToTargetPanoramaId = {};
  await bfsFetchSupportPanoramaIds(sessionToken, targetPanoramaIds, 3);

  async function bfsFetchSupportPanoramaIds(sessionToken, targetPanoramaIds, depthLimit) {
    const uniqueTargetPanoramaIds = targetPanoramaIds.filter((x, i, self) => self.indexOf(x) === i);
  
    for (const targetPanoramaId of uniqueTargetPanoramaIds) {
      if (targetPanoramaId === null) continue;
      supportPanoramaIdsToTargetPanoramaId[targetPanoramaId] = {};
      supportPanoramaHeadingsToTargetPanoramaId[targetPanoramaId] = {};
  
      const queue = [{ panoramaId: targetPanoramaId, depth: 0 }];
      
      while (queue.length > 0) {
        const { panoramaId, depth } = queue.shift();
        if (depth > depthLimit) continue;
  
        const metadata = await tilesApiMetadataService(sessionToken, panoramaId);
        const links = metadata.links;
  
        for (const link of links) {
          const connectedPanoramaId = link.panoId;
          if (connectedPanoramaId === targetPanoramaId) continue;
  
          const panoramaIdsFromSearchPanoramaId = supportPanoramaIdsToTargetPanoramaId[targetPanoramaId][panoramaId] || [];
          const panoramaHeadingsFromSearchPanoramaId = supportPanoramaHeadingsToTargetPanoramaId[targetPanoramaId][panoramaId] || [];
  
          const oldHeadings = supportPanoramaHeadingsToTargetPanoramaId[targetPanoramaId][connectedPanoramaId] || [];
          const newPanoramaIds = [panoramaId, ...panoramaIdsFromSearchPanoramaId];
          const newHeadings = [180 + link.heading, ...panoramaHeadingsFromSearchPanoramaId];
  
          let oldAngleAve = 0;
          let newAngleAve = 0;
          if (oldHeadings.length > 0) {
            for (let i = 0; i < oldHeadings.length - 1; i++) {
              oldAngleAve += calculateAngleDifference(oldHeadings[i], oldHeadings[i + 1]);
            }
            for (let i = 0; i < newHeadings.length - 1; i++) {
              newAngleAve += calculateAngleDifference(newHeadings[i], newHeadings[i + 1]);
            }
          }
  
          if (oldAngleAve >= newAngleAve) {
            supportPanoramaIdsToTargetPanoramaId[targetPanoramaId][connectedPanoramaId] = newPanoramaIds;
            supportPanoramaHeadingsToTargetPanoramaId[targetPanoramaId][connectedPanoramaId] = newHeadings;
          }
  
          queue.push({ panoramaId: connectedPanoramaId, depth: depth + 1 });
        }
      }
    }
  }
  console.log("supportPanoramaIdsToTargetPanoramaId: ", supportPanoramaIdsToTargetPanoramaId);
  

  let i = 0;
  let backTrackingCount = 0;
  while (i < route['all_polyline'].length - 1) {
    if (!update) {
      const cpaMetadata = await tilesApiMetadataService(sessionToken, cpaId);

      // Handle empty links
      if (!cpaMetadata.links || cpaMetadata.links.length === 0) {
        console.error("No links available for panorama: ", cpaId);
        break;
      }
      var cpaCartesian = latLngToXY(cpaMetadata.originalLat, cpaMetadata.originalLng);

      var cpaLinks = cpaMetadata.links;
    }

    const cpo = route['all_polyline'][i];
    const npo = route['all_polyline'][i + 1];
    let cpoCartesian = latLngToXY(cpo.lat, cpo.lng);
    const npoCartesian = latLngToXY(npo.lat, npo.lng);

    const vecCpo2Npo = vec(cpoCartesian, npoCartesian);
    const vecNpo2Cpa = vec(npoCartesian, cpaCartesian);
    const vecNpo2Cpo = vec(npoCartesian, cpoCartesian);
    const npoHeadingFromCpo = degrees(Math.atan2(vecCpo2Npo.y, vecCpo2Npo.x));
    const cosine = cosineBetweenVectors(vecNpo2Cpa, vecNpo2Cpo);

    // If the cosine is negative, the cpa is ahead of the cpo, so update the cpo and npo
    if (cosine < 0) {
      update = true;
      i++;
      continue;
    }

    update = false;

    const targetPanoramaId = targetPanoramaIds[i];
    const support = supportPanoramaIdsToTargetPanoramaId[targetPanoramaId];
    const supportHeading = supportPanoramaHeadingsToTargetPanoramaId[targetPanoramaId];
    if (targetPanoramaId !== null && support[cpaId]) {
      const connections = await PanoramaConnections.findAll({
        where: {panorama_id: targetPanoramaId}
      })
      //階段の入り口は、targetPanoramaIdsの中で、targetPanoramaIdが最後に出現する位置に対応する
      const entrypoIndex = targetPanoramaIds.lastIndexOf(targetPanoramaId);
      const entrypo = route['all_polyline'][entrypoIndex];
      const exitpo = route['all_polyline'][entrypoIndex + 1];
      const entrypoCartesian = latLngToXY(entrypo.lat, entrypo.lng);
      const exitpoCartesian = latLngToXY(exitpo.lat, exitpo.lng);
      let _minScore = Infinity;
      let bestConnection = null;
      for (const connection of connections) {
        const connectionHeading = connection.heading;
        const heading = degrees(Math.atan2(exitpoCartesian.y - entrypoCartesian.y, exitpoCartesian.x - entrypoCartesian.x));
        const score = calculateAngleDifference(connectionHeading, heading);
        if (score < _minScore) {
          _minScore = score;
          bestConnection = connection;
        }
      }

      if (bestConnection === null) {
        console.error("No connection found for panorama: ", cpaId);
        break;
      }
      panoramaIds.push(...support[cpaId]);
      panoramaIds.push(bestConnection.connected_panorama_id);
      panoramaHeadings.push(...supportHeading[cpaId]);
      panoramaHeadings.push(bestConnection.heading);
      // support[cpaId]と同じ長さだけiを追加する
      for (let l=0; l<support[cpaId].length; l++) {
        routeStepIdsInPanoramaIds.push(entrypoIndex-1);
      };
      routeStepIdsInPanoramaIds.push(entrypoIndex);
      cpoCartesian = exitpoCartesian;
      cpaId = bestConnection.connected_panorama_id;
      i = entrypoIndex;
      console.log("階段あり, 次のパノラマID: ", cpaId);
      continue;
    }
    let minScore = Infinity;
    let npaId = cpaId;
    let bestHeading = null;
    for (const link of cpaLinks) {
      const apaId = link.panoId;
      const apaHeadingFromCpa = link.heading;
      const score = calculateAngleDifference(apaHeadingFromCpa, npoHeadingFromCpo);

      if (score < minScore && !panoramaIds.includes(apaId) && !blacklistedPanoramaIds.includes(apaId)) {
        minScore = score;
        npaId = apaId;
        bestHeading = apaHeadingFromCpa;
      }
    }

    // If no suitable panorama is found, backtrack
    if (npaId == cpaId) {
      console.error("Panorama Fetch along the route failed, backtracking...");
      blacklistedPanoramaIds.push(cpaId);
      panoramaIds.pop();
      panoramaHeadings.pop();
      cpaId = panoramaIds[panoramaIds.length - 1];
      continue;
    }
    if (backTrackingCount > 10) {
      console.warn("High angle difference detected, so stop searching");
      break;
    }
    // If the selected angle difference is too high, the route is likely incorrect, so backtrack
    if (minScore > 110 && cpaLinks.length > 1) {
      backTrackingCount++;
      console.warn("High angle difference detected, backtracking...");
      panoramaIds.pop();
      panoramaHeadings.pop();
      cpaId = panoramaIds[panoramaIds.length - 1];
      continue;
    }

    panoramaIds.push(npaId);
    panoramaHeadings.push(bestHeading);
    routeStepIdsInPanoramaIds.push(i);
    cpaId = npaId;
    cpoCartesian = npoCartesian;
    console.log("階段なし, 次のパノラマID: "+cpaId+" ターゲットパノラマID: "+targetPanoramaId);
  };

  return { 
    panoramaIds: panoramaIds,
    panoramaHeadings: panoramaHeadings,
    routeStepIdsInPanoramaIds: routeStepIdsInPanoramaIds
  };
};

/** Helper functions */

/**
 * Construct streetview URLs from panorama
 * 
 * @param {Array<String>} panoramaIds - The panorama IDs
 * @param {Array<Float>} panoramaHeadings - The panorama headings
 * 
 * @returns {Array<String>} - The streetview URLs
*/
exports.constructStreetviewUrls = async (panoramaIds, panoramaHeadings) => {
  const streetviewUrls = [];
  for (let i = 0; i < panoramaIds.length; i++) {
    const panoramaId = panoramaIds[i];
    const heading = panoramaHeadings[i];
    const pitch = 20;
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

/**
 * convert degrees to radians
 * 
 * @param {float} degrees
 * @returns {float} - radians
*/
const radians = (degrees) => degrees * (Math.PI / 180);

/**
 * convert latitude and longitude to plane rectangular coordinates (Gauss-Kruger projection)
 * 
 * @param {float} lat degree
 * @param {float} lng degree
 * @returns {Object} - { x: x-coordinate, y: y-coordinate }
 */
const latLngToXY = (lat, lng) => {
  const a = 6378137.0; // ellipsoidal semi-major axis (m)
  const f = 1 / 298.257222101; // inverse flattening
  const e2 = 2 * f - f * f; // eccentricity squared

  const latRad = radians(lat);
  const lonRad = radians(lng);
  const centralMeridian = 135; // central meridian (degree)
  const centralMeridianRad = centralMeridian * Math.PI / 180;

  const n = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
  const t = Math.tan(latRad);
  const eta2 = (e2 / (1 - e2)) * Math.cos(latRad) * Math.cos(latRad);

  const m0 = a * (
      (1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 * e2 * e2 / 256) * latRad
      - (3 * e2 / 8 + 3 * e2 * e2 / 32 + 45 * e2 * e2 * e2 / 1024) * Math.sin(2 * latRad)
      + (15 * e2 * e2 / 256 + 45 * e2 * e2 * e2 / 1024) * Math.sin(4 * latRad)
      - (35 * e2 * e2 * e2 / 3072) * Math.sin(6 * latRad)
  );

  const deltaLambda = lonRad - centralMeridianRad;

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
 * compute the haversine distance between two points
 * 
 * @param {*} lat1 
 * @param {*} lon1 
 * @param {*} lat2 
 * @param {*} lon2 
 * @returns {float} - haversine distance in metres
 */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const a1 = radians(lat1);
  const a2 = radians(lat2);
  const a3 = radians(lat2 - lat1);
  const a4 = radians(lon2 - lon1);

  const a = Math.sin(a3 / 2) * Math.sin(a3 / 2) +
    Math.cos(a1) * Math.cos(a2) *
    Math.sin(a4 / 2) * Math.sin(a4 / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

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