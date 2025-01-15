'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PanoramaConnections extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PanoramaConnections.init({
    station_name: DataTypes.STRING,
    connection_id: DataTypes.INTEGER,
    panorama_id: DataTypes.STRING,
    connected_panorama_id: DataTypes.STRING,
    building_level: DataTypes.INTEGER,
    building_level_comparison: DataTypes.INTEGER,
    heading: DataTypes.FLOAT,
    panorama_lat: DataTypes.FLOAT,
    panorama_lng: DataTypes.FLOAT,
    connected_panorama_lat: DataTypes.FLOAT,
    connected_panorama_lng: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'PanoramaConnections',
    underscored: false,
  });
  return PanoramaConnections;
};