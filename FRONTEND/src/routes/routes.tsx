import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import React from 'react'; // Agrega esta línea si falta

import { PatientCard } from '../components/PatientCard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/patient/:id',
    element: <PatientCard/>,
  },
  {
    path: '*',
    element: <div>404 - Página no encontrada</div>,

  },
]);