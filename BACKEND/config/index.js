const env =  'dev';

var defaultConfig;

switch (env) {
  case 'test':
    defaultConfig = require('./test.config.js');
    break;

  default:
    defaultConfig = require('./default.config.js');
    break;
}

module.exports = defaultConfig;
