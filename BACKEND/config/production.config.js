// src/config/production.config.js
var config = {
    env: 'production',
    db: {
        mongo: {
            MONGO_HOST: 'mcp.xhad8oe.mongodb.net',
            MONGO_DATABASE: 'DataPlanes',
            MONGO_USER: 'MCPDevelop',
            MONGO_PASSWORD: 'Develop',
            MONGO_PORT: '27017',
            MONGO_AUTH_SOURCE: 'admin',
            MONGO_REPLICASET: 'atlas-fac6ox-shard-0'
        }
    },
    server: {
        host: '0.0.0.0',
        port: process.env.PORT || 8090,  // Siempre dinámico
        enableDebugMode: false,  // False en prod por seguridad
    }
};

module.exports = Object.freeze(config);