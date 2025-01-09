'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class qrcode extends Model {
    static associate(models) {
      // define association here
    }
  };
  qrcode.init({
    id: {
      type: DataTypes.INTEGER, // 整数型
      primaryKey: true, // 主キー
      autoIncrement: true, // 自動増分
    },
    place_id: DataTypes.STRING,
    panorama_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Qrcode',
    underscored: true,
  });

  return qrcode;
};

