const fetch = require('node-fetch'); // npm install node-fetch@2

const WEBHOOK_URL = 'https://rsolanoia.app.n8n.cloud/webhook-test/68fb32eb-6227-44ff-a22f-f4f14289aa4b'; // Reemplaza por tu URL real

const repo = {
  consultar: async ({ findObject }) => {
    try {
        console.log('findObject recibido en repo:', findObject);
      // Datos simulados (hardcodeados)
      const result = [
        { paciente: 'Juan Perez', documento: '12345', edad: 35 },
        { paciente: 'Maria Gomez', documento: '67890', edad: 28 },
        { paciente: 'Carlos Ruiz', documento: '54321', edad: 42 }
      ];


      // Simular envío al webhook
      const webhookResponse = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: findObject }),
      });
      
      console.log('Respuesta del webhook:', await webhookResponse.text());

      if (!webhookResponse.ok) {
        console.warn('Error enviando al webhook:', webhookResponse.status);
      } else {
        console.log('Webhook recibido con éxito');
      }

      // Retornar datos al handler
      return { status: 'success', datos: result };

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
