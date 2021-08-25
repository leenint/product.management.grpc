const Sequelize = require('sequelize');

module.exports = {
  name: 'color',
  define: {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    color: { type: Sequelize.STRING(50), allowNull: false },
  },
  options: {
    indexes: [
      {
        unique: true,
        fields: ['color'],
      },
    ],
  },
};
