import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { Visibility } from '@mui/icons-material';
import { useConvocatoria } from '../../src/app/convocatoriaContext';

export default function TablaConvocatorias({ convocatorias }) {
  const router = useRouter();
  const { setConvocatoria } = useConvocatoria();

  const formatDate = (dateString) => {
    const date = new Date(dateString);  // Crea un objeto Date a partir de la fecha ISO
    return date.toLocaleDateString('es-ES');  // Convierte la fecha al formato español (día/mes/año)
  };

  const editarConvocatoria = (convocatoria) => {
    setConvocatoria(convocatoria);
    router.push('/asistenteSeccion/convocatorias/nuevaConvocatoria');
  };

  const detalleConvocatoria = (convocatoria) => {
    setConvocatoria(convocatoria);
    router.push('/asistenteSeccion/convocatorias/detalleConvocatoria');
  };

  return (

    <TableContainer component={Paper} sx={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', overflow: 'auto' }}>
      <Table sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Nombre</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Fecha Inicio</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Fecha Fin</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>Acción</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {convocatorias.map((convocatoria) => (
            <TableRow key={convocatoria.id} sx={{ backgroundColor: '#F8F9FA' }}>
              <TableCell align='left'>{convocatoria.puesto}</TableCell>
              <TableCell align='center'>{formatDate(convocatoria.fechaInicio)}</TableCell>
              <TableCell align='center'>{formatDate(convocatoria.fechaFin)}</TableCell>
              <TableCell align='center'>

                <IconButton aria-label="modificar" onClick={() => detalleConvocatoria(convocatoria)}>
                  <Visibility color="primary" />
                </IconButton>

                {/* Icono de editar */}
                <IconButton
                  aria-label="modificar"
                  onClick={() => editarConvocatoria(convocatoria)}
                  sx={{ cursor: 'pointer', color: '#363581' }}
                >
                  <EditIcon />
                </IconButton>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
