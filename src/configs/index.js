const devConfig = require('./development');
const prodConfig = require('./production');

const nodeEnv = _.toString(process.env.NODE_ENV);

let envConfig;

switch (nodeEnv) {
  case 'development':
    envConfig = devConfig;
    break;
  case 'production':
    envConfig = prodConfig;
    break;
  default:
    envConfig = {};
    break;
}

module.exports = envConfig;