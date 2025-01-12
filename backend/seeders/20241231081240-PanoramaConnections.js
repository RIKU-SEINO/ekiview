'use strict';

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const csvFilePath = path.join(__dirname, '..', 'data', '202501011834-panorama_connections_table.csv');
    const records = [];

    const readCsv = () => {
      return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (row) => {
            records.push({
              station_name: row.station_name,
              connection_id: row.connection_id,
              panorama_id: row.panorama_id,
              connected_panorama_id: row.connected_panorama_id,
              building_level_comparison: row.building_level_comparison,
              heading: row.heading,
              panorama_lat: row.panorama_lat,
              panorama_lng: row.panorama_lng,
              connected_panorama_lat: row.connected_panorama_lat,
              connected_panorama_lng: row.connected_panorama_lng,
            });
          })
          .on('end', resolve)
          .on('error', reject);
      });
    }

    await readCsv();
    await queryInterface.bulkInsert('PanoramaConnections', records);
  },

  async down (queryInterface) {
     await queryInterface.bulkDelete('PanoramaConnections', null, {});
  }
};
