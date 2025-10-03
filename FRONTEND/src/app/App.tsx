import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from '../routes/routes';
import React from 'react'; // Agrega esta línea si falta

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}