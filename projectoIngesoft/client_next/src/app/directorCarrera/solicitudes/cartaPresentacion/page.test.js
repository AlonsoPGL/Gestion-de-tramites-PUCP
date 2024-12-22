import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SolicitudCartaPresentacion from './page';
import { useRouter } from 'next/router';
import React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

// Importar y configurar fetch para pruebas en Node
const fetch = require('node-fetch');
global.fetch = fetch;

// Mockear useRouter para manejar redirecciones
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mockear usePersona
jest.mock('@/app/PersonaContext', () => ({
  usePersona: () => ({
    persona: { id: 1, nombre: 'Persona Mock' },
  }),
}));

jest.mock('axios');
jest.mock('file-saver', () => ({ saveAs: jest.fn() }));

beforeAll(() => {
  global.fetch = fetch;
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('SolicitudCartaPresentacion', () => {
  
  test('renders loading spinner initially', () => {
    render(<SolicitudCartaPresentacion />);

    const loadingSpinner = screen.getByRole('progressbar');
    expect(loadingSpinner).toBeInTheDocument();
  },20000);

  test('fetches and displays solicitude', async () => {
    render(<SolicitudCartaPresentacion />);

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(), { timeout: 20000 });

    //console.log(document.body.innerHTML);

    const solicitudes = screen.getAllByText((content, element) => {
      return element.textContent.includes('Javi');
    });

    expect(solicitudes.length).toBeGreaterThan(0);
  }, 100000);

  test('should download the file when clicking on the download icon', async () => {
    // Configura el mock de axios para simular la respuesta de descarga
    axios.get.mockResolvedValueOnce({
      data: new Blob(['contenido del archivo'], { type: 'application/pdf' }),
    });

    render(<SolicitudCartaPresentacion />);

    // Esperar hasta que desaparezca el spinner de carga (hasta 10 segundos)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(), { timeout: 10000 });

    // Usar queryAllByLabelText para obtener todos los íconos de descarga
    const downloadButtons = screen.queryAllByLabelText('download');

    // Verificar que se encontró al menos un botón de descarga
    expect(downloadButtons.length).toBeGreaterThan(0);

    // Simular el clic en el primer ícono de descarga (puedes ajustar esto si deseas un botón específico)
    fireEvent.click(downloadButtons[3]);
  },20000);
});

