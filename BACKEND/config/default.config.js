var config = {
  env: 'dev',
  db: {

    mongo: {
      MONGO_HOST: 'mcp.xhad8oe.mongodb.net',
      MONGO_DATABASE: 'DataPlanes',
      MONGO_USER: 'MCPDevelop',
      MONGO_PASSWORD: 'Develop',
      MONGO_PORT:'27017',
      MONGO_AUTH_SOURCE: 'admin',
      MONGO_REPLICASET: 'atlas-fac6ox-shard-0'
    }

  }, server: {
    host: '0.0.0.0',
    port: 8090,
    enableDebugMode: true,
  }
};

module.exports = Object.freeze(config);