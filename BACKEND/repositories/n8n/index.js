const fetch = require('node-fetch'); // npm install node-fetch@2

const WEBHOOK_URL = 'https://rsolanoia.app.n8n.cloud/webhook-test/68fb32eb-6227-44ff-a22f-f4f14289aa4b'; // Reemplaza por tu URL real

const repo = {
  consultar: async ({ findObject }) => {
    try {
      console.log('findObject recibido en repo:', findObject);
      // Datos simulados (hardcodeados)
      const result = [
        {
          paciente: 'Juan Perez',
          documento: '12345',
          edad: 35,
          historia: {
            numeroHistoria: 'HIS-001',
            identificacion: '12345',
            caso: 'Hipertensión arterial',
            fecha: '2025-10-02',
            analisis: 'Presión elevada persistente. Se descarta daño renal.',
            plan: 'Iniciar tratamiento con enalapril y seguimiento mensual.',
            estructura: {
              consultas: [],
              estancias: [],
              medicamentos: [
                { nombre: 'Enalapril', via: 'oral', dosis: '10mg cada 12h' }
              ],
              laboratorios: [
                { nombre: 'Perfil lipídico' }
              ],
              imagenes: [
                { nombre: 'Electrocardiograma' }
              ],
              insumos: [
                { codigo: 'BP001', Nombre: 'Tensiómetro digital' }
              ]
            }
          }
        },
        {
          paciente: 'Maria Gomez',
          documento: '67890',
          edad: 28,
          historia: {
            numeroHistoria: 'HIS-002',
            identificacion: '67890',
            caso: 'Infección urinaria',
            fecha: '2025-09-28',
            analisis: 'Disuria y fiebre. Urocultivo positivo para E. coli.',
            plan: 'Antibiótico por 7 días y control post-tratamiento.',
            estructura: {
              consultas: [],
              estancias: [],
              medicamentos: [
                { nombre: 'Nitrofurantoína', via: 'oral', dosis: '100mg cada 6h' }
              ],
              laboratorios: [
                { nombre: 'Urocultivo' }
              ],
              imagenes: [],
              insumos: [
                { codigo: 'LAB002', Nombre: 'Frasco estéril para muestra' }
              ]
            }
          }
        },
        {
          paciente: 'Carlos Ruiz',
          documento: '54321',
          edad: 42,
          historia: {
            numeroHistoria: 'HIS-003',
            identificacion: '54321',
            caso: 'Diabetes tipo 2',
            fecha: '2025-09-15',
            analisis: 'Glicemia en ayunas > 126 mg/dL. HbA1c elevada.',
            plan: 'Metformina, dieta baja en carbohidratos y control mensual.',
            estructura: {
              consultas: [],
              estancias: [],
              medicamentos: [
                { nombre: 'Metformina', via: 'oral', dosis: '850mg cada 12h' }
              ],
              laboratorios: [
                { nombre: 'Hemoglobina glicosilada (HbA1c)' }
              ],
              imagenes: [],
              insumos: [
                { codigo: 'GLU001', Nombre: 'Glucómetro digital' }
              ]
            }
          }
        }
      ];



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
