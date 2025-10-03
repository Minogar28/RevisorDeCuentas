const repository = require('../../repositories/n8n');

async function handler(req, res, next) {
  try {
    // Ignoramos findObject real, usamos body para simular
    const findObject = req.body || {};

    const response = await repository.consultar({ findObject });

    const statusCode = response.status === 'success' ? 200 : 500;

    const oResponse = {
      datos: response.datos || null,
      Error: statusCode !== 200,
      Mensaje: statusCode === 200 ? 'OK' : response.failure_message || 'Error',
    };

    res.status(statusCode).json(oResponse);

  } catch (error) {
    console.error('Error en handler n8n/consultar:', error);
    next(error);
  }
}

module.exports = handler;
