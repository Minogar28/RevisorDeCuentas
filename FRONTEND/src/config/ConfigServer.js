   export const gsUrlApi = import.meta.env.VITE_API_URL || 'http://localhost:8090'; // Fallback para desarrollo si no hay var

   const environment = import.meta.env.MODE || 'development'; // 'development' o 'production' según Vite
   console.log(`Entorno actual: ${environment}`); // Para debugging
   