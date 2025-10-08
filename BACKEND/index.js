const path = require('path');
const config = require('./config');  // Config dinámica con process.env
const NODE_ENV = config.env;  // 'production' en Render
const PORT = config.server.port;  // process.env.PORT en Render
const HOST = config.server.host;  // '0.0.0.0'
require('dotenv').config();

// Conexión a MongoDB (primero, como en tu código)
const mongo = require('./helpers/mongo');
mongo.connect().then((res) => {
    if (res) {
        // Express Server (solo si DB conecta)
        const app = require('./app');
        app.listen(PORT, HOST, () => {  // Usa HOST de config para consistencia
            console.log(`Your app is running at: http://localhost:${PORT}`);
            console.log(`Escuchando on port ${PORT} running ${NODE_ENV} environment`);
            if (mongo.isConnected()) {
                console.log(`Mongo isConnected: ${mongo.isConnected()} on ${NODE_ENV} environment`);
            }
        });
    }
}).catch(err => {
    console.error('Error conectando a MongoDB:', err);  // Mejor logging
    process.exit(1);  // Sale si falla (Render detecta y maneja)
});