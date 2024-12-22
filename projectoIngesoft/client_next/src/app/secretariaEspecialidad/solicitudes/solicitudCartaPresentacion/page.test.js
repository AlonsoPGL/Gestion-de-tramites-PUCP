import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import SolicitudCartaPresentacion from './page'; // Asegúrate de que la ruta es correcta
import { usePersona } from '@/app/PersonaContext';
import '@testing-library/jest-dom'; // Sin '/extend-expect'
import React from 'react';

// Importar y configurar fetch para pruebas en Node
const fetch = require('node-fetch');
global.fetch = fetch;

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
  global.fetch = fetch; // Asignar node-fetch a global.fetch
});

// Restaurar los mocks después de todas las pruebas
afterAll(() => {
  jest.restoreAllMocks(); // Restablece los mocks después de las pruebas
});

describe('SolicitudCartaPresentacion', () => {
  beforeEach(() => {
    axios.get.mockClear(); // Limpiar el mock antes de cada prueba
  });

  test('renders loading spinner initially', () => {
    render(<SolicitudCartaPresentacion />);

    // Verificar que el spinner se muestra mientras carga
    const loadingSpinner = screen.getByRole('progressbar');
    expect(loadingSpinner).toBeInTheDocument();
  });

  test('fetches and displays solicitudes', async () => {
    const solicitudesMock = [
      { id: 1, curso: 'Programacion 3', profesor: 'Estephany Elizabeth' },
      { id: 2, curso: 'Programacion 3', profesor: 'Estephany Elizabeth' },
    ];
    axios.get.mockResolvedValueOnce({ data: solicitudesMock });

    render(<SolicitudCartaPresentacion />);

    // Esperar hasta que desaparezca el spinner de carga (hasta 10 segundos)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(), { timeout: 10000 });

    // Usar getAllByText para obtener todas las solicitudes
    const solicitudes = screen.getAllByText('Programacion 3');
    expect(solicitudes.length).toBeGreaterThan(0);
  });
  test('downloads PDF when clicking the download icon', async () => {
    const solicitudesMock = [{ id: 1, curso: 'Programacion 3', profesor: 'Estephany Elizabeth' }];
    axios.get.mockResolvedValueOnce({ data: solicitudesMock });

    render(<SolicitudCartaPresentacion />);

    // Esperar hasta que desaparezca el spinner de carga (hasta 10 segundos)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(), { timeout: 20000 });

    // Usar queryAllByLabelText para obtener todos los íconos de descarga
    const downloadButtons = screen.queryAllByLabelText('download');

    // Verificar que se encontró al menos un botón de descarga
    expect(downloadButtons.length).toBeGreaterThan(0);

    // Simular el clic en el primer ícono de descarga (puedes ajustar esto si deseas un botón específico)
    fireEvent.click(downloadButtons[0]);

    // Aquí deberías agregar lógica para verificar que la descarga del PDF se completó
    // Verifica si se llama a la función de descarga o si el archivo está disponible
},10000);

});
