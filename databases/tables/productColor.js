const Sequelize = require('sequelize');

module.exports = {
  name: 'productColor',
  define: {
    productId: { type: Sequelize.INTEGER, primaryKey: true },
    colorId: { type: Sequelize.INTEGER, primaryKey: true },
    order: { type: Sequelize.INTEGER, allowNull: false, default: 0 },
  },
};
