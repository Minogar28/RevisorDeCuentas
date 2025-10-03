import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import React from 'react'; // Agrega esta línea si falta

import { PatientPage } from '../pages/PatientPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/patient/:id',
    element: <PatientPage />,
  },
  {
    path: '*',
    element: <div>404 - Página no encontrada</div>,

  },
]);