const fetch = require('node-fetch'); // npm install node-fetch@2

const WEBHOOK_URL = process.env.WEBHOOK_URL; 

const repo = {
  consultar: async ({ findObject }) => {
    try {
      console.log('findObject recibido en repo:', findObject);
      // Datos simulados (hardcodeados)
     



      // Simular envío al webhook
      const webhookResponse = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: findObject }),
      });

      const data = await webhookResponse.json();
console.log('Datos recibidos del webhook:', data);

      if (!webhookResponse.ok) {
        console.warn('Error enviando al webhook:', webhookResponse.status);
      } else {
        console.log('Webhook recibido con éxito');
      }

      // Retornar datos al handler
      return { status: 'success', datos: data };

    } catch (error) {
      return {
        status: 'error',
        failure_message: error.message,
        failure_code: 'REPO_ERROR',
      };
    }
  }
};

module.exports = repo;
