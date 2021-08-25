const Sequelize = require('sequelize');

module.exports = {
  name: 'branch',
  define: {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING(250), allowNull: false },
    code: { type: Sequelize.STRING(250), allowNull: false },
    address: { type: Sequelize.STRING(250) },
  },
  options: {
    indexes: [
      {
        unique: true,
        fields: ['code'],
      },
    ],
  },
  associations: [
    {
      type: 'hasMany',
      modelName: 'product',
      options: {
        as: 'products',
      },
    },
  ],
};
