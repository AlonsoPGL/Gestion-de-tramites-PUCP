import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import SolicitudCartaPresentacion from './page'; // Asegúrate de que la ruta es correcta
import { usePersona } from '@/app/PersonaContext';
import '@testing-library/jest-dom'; // Sin '/extend-expect'
import React from 'react';

// Mockear axios para pruebas de subida de archivos y obtener solicitudes
jest.mock('axios'); // Mover la declaración de mock de axios aquí, fuera de beforeEach

// Mockear useRouter para manejar redirecciones
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mockear usePersona
jest.mock('@/app/PersonaContext', () => ({
  usePersona: () => ({
    persona: { id: 1, nombre: 'Persona Mock' }, // Mockea un objeto persona
  }),
}));

// Configurar fetch antes de todas las pruebas
beforeAll(() => {
  global.fetch = require('node-fetch'); // Asignar node-fetch a global.fetch
});

// Restaurar los mocks después de todas las pruebas
afterAll(() => {
  jest.restoreAllMocks(); // Restablece los mocks después de las pruebas
});

describe('SolicitudCartaPresentacion', () => {
  beforeEach(() => {
    axios.get.mockClear(); // Limpiar el mock antes de cada prueba
  });

  test('debe renderizar el spinner de carga inicialmente', () => {
    render(<SolicitudCartaPresentacion />);

    // Verificar que el spinner se muestra mientras carga
    const loadingSpinner = screen.getByRole('progressbar');
    expect(loadingSpinner).toBeInTheDocument();
  }, 100000);

  test('fetches and displays solicitude', async () => {
    render(<SolicitudCartaPresentacion />);

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(), { timeout: 20000 });

    //console.log(document.body.innerHTML);

    const solicitudes = screen.getAllByText((content, element) => {
      return element.textContent.includes('Alonso');
    });

    expect(solicitudes.length).toBeGreaterThan(0);
  }, 100000);

  test('debe descargar el PDF al hacer clic en el ícono de descarga', async () => {
    const solicitudesMock = [{ id: 1, curso: 'Programación 3', profesor: 'Estephany Elizabeth' }];
    axios.get.mockResolvedValueOnce({ data: solicitudesMock });

    render(<SolicitudCartaPresentacion />);

    // Esperar hasta que desaparezca el spinner de carga (hasta 10 segundos)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(), { timeout: 10000 });

    // Obtener todos los íconos de descarga
    const downloadButtons = screen.queryAllByLabelText('download');

    // Verificar que se encontró al menos un ícono de descarga
    expect(downloadButtons.length).toBeGreaterThan(0);

    // Simular el clic en el primer ícono de descarga
    fireEvent.click(downloadButtons[0]);

    // Aquí deberías agregar lógica para verificar que la descarga del PDF se completó.
    // Por ejemplo, si utilizas `jsPDF` para generar el PDF, puedes verificar su llamada:
    // expect(mockJsPDF).toHaveBeenCalled();
  }, 10000);
});
