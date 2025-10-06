const path = require('path');
// Detecta el entorno dinámicamente (dev por defecto si no se setea)
const env = process.env.NODE_ENV || 'development';  // 
let defaultConfig;
switch (env) {
 
  case 'production':
    defaultConfig = require('./production.config.js');  // Crea este archivo si necesitas config específica para prod
    break;
  default:  // dev o cualquier otro
    defaultConfig = require('./default.config.js');
    break;
}
// Sobrescribe con vars de entorno para flexibilidad (prioridad alta)
const configWithEnv = {
  ...defaultConfig,
  env: env,
  db: {
    ...defaultConfig.db,
    mongo: {
      ...defaultConfig.db.mongo,
      MONGO_HOST: process.env.MONGO_HOST || defaultConfig.db.mongo.MONGO_HOST,
      MONGO_DATABASE: process.env.MONGO_DATABASE || defaultConfig.db.mongo.MONGO_DATABASE,
      MONGO_USER: process.env.MONGO_USER || defaultConfig.db.mongo.MONGO_USER,
      MONGO_PASSWORD: process.env.MONGO_PASSWORD || defaultConfig.db.mongo.MONGO_PASSWORD,
      MONGO_PORT: process.env.MONGO_PORT || defaultConfig.db.mongo.MONGO_PORT,
      MONGO_AUTH_SOURCE: process.env.MONGO_AUTH_SOURCE || defaultConfig.db.mongo.MONGO_AUTH_SOURCE,
         MONGO_REPLICASET: process.env.MONGO_REPLICASET || defaultConfig.db.mongo.MONGO_REPLICASET,
    }
  },
  server: {
    ...defaultConfig.server,
    host: process.env.HOST || defaultConfig.server.host || '0.0.0.0',
    port: process.env.PORT || defaultConfig.server.port || 8090,  // Clave: PORT dinámico para Render
    enableDebugMode: process.env.ENABLE_DEBUG_MODE === 'true' || defaultConfig.server.enableDebugMode,  // Boolean via env
  }
};
module.exports = Object.freeze(configWithEnv);