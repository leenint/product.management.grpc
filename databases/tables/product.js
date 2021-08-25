const Sequelize = require('sequelize');

module.exports = {
  name: 'product',
  define: {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING(250), allowNull: false },
    code: { type: Sequelize.STRING(50), allowNull: false },
    description: { type: Sequelize.STRING(2000) },
    branchId: { type: Sequelize.INTEGER, allowNull: false },
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
      type: 'belongsTo',
      modelName: 'branch',
    },
    {
      type: 'belongsToMany',
      modelName: 'color',
      options: {
        through: 'productColor',
      },
    },
    {
      type: 'hasMany',
      modelName: 'productColor',
      options: {
        as: 'productColors',
      },
    },
  ],
};
