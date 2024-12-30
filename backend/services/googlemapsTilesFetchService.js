const axios = require('axios');
// const { setCache, getCache } = require('./cacheService');
require('dotenv').config({ path: '../.env' });

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

exports.tilesApiGenerateSessionTokenService = async () => {
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

exports.tilesApiMetadataService = async (sessionToken, panoId) => {
  const metadataUrl = `https://tile.googleapis.com/v1/streetview/metadata?panoId=${panoId}&key=${GOOGLE_MAPS_API_KEY}&session=${sessionToken}`;

  try {
    const response = await axios.get(metadataUrl);
    const metadata = response.data;
    return metadata;
  } catch (error) {
    throw new Error('Failed to fetch metadata: ' + error.message);
  };

  // TODO: キャッシュの実装
  // Check if the metadata is already in the cache
  // const cacheKey = `metadata-${panoId}-${GOOGLE_MAPS_API_KEY}`;
  // try {
  //   const cachedMetadata = await getCache(cacheKey);
  //   if (cachedMetadata) {
  //     return JSON.parse(cachedMetadata);
  //   } else {
  //     const response = await axios.get(metadataUrl);
  //     const metadata = response.data;
  //     await setCache(cacheKey, JSON.stringify(metadata));
  //     return metadata;
  //   }
  // } catch (error) {
  //   throw new Error('Failed to fetch metadata: ' + error.message);
  // };
};

exports.tilesApiStreetviewService = async (panoId, heading, pitch, fov, height, width) => {
  const streetviewUrl = `https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=${panoId}&cb_client=maps_sv.tactile.gps&yaw=${heading}&pitch=${pitch}&thumbfov=${fov}&w=${width}&h=${height}`;

  return streetviewUrl;

  // base64形式の画像データをキャッシュする/取得する場合、以下のコードを使用
  // 現時点では、フロントに渡すデータはbase64データではなく、URLデータとしているため、キャッシュは行っていない
  // const cacheKey = `streetview-${panoId}-${heading}-${pitch}-${fov}-${height}-${width}-${GOOGLE_MAPS_API_KEY}`;
  // try {
  //   const cachedImage = await getCache(cacheKey);
  //   if (cachedImage) {
  //     return cachedImage;
  //   } else {
  //     const response = await axios.get(streetviewUrl, { responseType: 'arraybuffer' });
  //     const image = Buffer.from(response.data, 'binary').toString('base64');
  //     await setCache(cacheKey, image);
  //     return image;
  //   }
  // } catch (error) {
  //   throw new Error('Failed to fetch streetview image: ' + error.message);
  // };
};