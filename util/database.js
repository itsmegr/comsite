const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('shopping-app', 'root', 'Govind@2000', {
    host: 'localhost',
    dialect:'mysql'
  });

module.exports = sequelize;
