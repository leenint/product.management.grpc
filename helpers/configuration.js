const configYaml = require('config-yaml');

const Configuration = {
  init() {
    // todo load config from api endpoint
    const env = process.env.NODE_ENV || 'local';
    const config = configYaml(`${__dirname}/../config/${env}.yml`);
    return config;
  },
};

module.exports = Configuration;
