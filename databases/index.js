const Sequelize = require('sequelize');
const includeAll = require('include-all');
const path = require('path');

const dbConfig = global.config.db;

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    // operatorsAliases: false,
    logging: (msg) => (process.env.NODE_ENV !== 'local' ? false : console.log(`\n${msg}`)),
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  },
);

const db = {
  sequelize,
};

const modelInfo = includeAll({
  dirname: path.resolve(__dirname, './tables'),
  filter: /(.+)\.js$/,
}) || {};

for (const fileName in modelInfo) {
  if (Object.hasOwnProperty.call(modelInfo, fileName)) {
    const model = modelInfo[fileName];
    if (model && model.name && model.define) {
      db[fileName] = sequelize.define(model.name, model.define, { ...model.options });
    }
  }
}

for (const fileName in modelInfo) {
  if (Object.hasOwnProperty.call(modelInfo, fileName)) {
    const model = modelInfo[fileName];
    if (model && Array.isArray(model.associations) && model.associations.length > 0) {
      model.associations.forEach(ass => {
        if (ass.type && ass.modelName) {
          db[fileName][ass.type](db[ass.modelName], ass.options);
        }
      });
    }
  }
}

module.exports = db;
