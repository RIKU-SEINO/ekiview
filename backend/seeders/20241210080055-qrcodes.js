'use strict';

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

module.exports = {
  up: async (queryInterface) => {
    const csvFilePath = path.join(__dirname, '..', 'data', '202412311759-qrcode_table.csv');
    const records = [];

    const readCsv = () => {
      return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (row) => {
            records.push({
              place_id: row.place_id,
              panorama_id: row.panorama_id,
            });
          })
          .on('end', resolve)
          .on('error', reject);
      });
    }

    await readCsv();
    await queryInterface.bulkInsert('qrcodes', records);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('qrcodes', null, {});
  }
};
