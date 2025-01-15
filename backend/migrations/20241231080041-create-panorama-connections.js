'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PanoramaConnections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      station_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      connection_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      panorama_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      connected_panorama_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      building_level: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      building_level_comparison: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      heading: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      panorama_lat: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      panorama_lng: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      connected_panorama_lat: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      connected_panorama_lng: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PanoramaConnections');
  }
};