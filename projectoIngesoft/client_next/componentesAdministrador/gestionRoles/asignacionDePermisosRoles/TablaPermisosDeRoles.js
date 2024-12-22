import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, FormControlLabel, Paper } from '@mui/material';

const TablaPermisos = ({ permisos, onToggle }) => {

  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflow: 'auto' }}>
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center', borderRight: '2px solid white' }}>Código</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center', borderRight: '2px solid white' }}>Permiso</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center', borderRight: '2px solid white' }}>Descripción</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center', borderRight: '2px solid white' }}>Sí</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center' }}>No</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {permisos.map((permiso) => {
            return (
              <TableRow key={permiso.permisoId} sx={{ height: '40px', lineHeight: '30px', backgroundColor: '#F8F9FA', borderBottom: '4px solid white'}}> 
                <TableCell sx={{ borderRight: '2px solid white', textAlign: 'center' }}>{permiso.permisoId}</TableCell> 
                <TableCell sx={{ borderRight: '2px solid white', textAlign: 'center' }}>{permiso.permisoNombre}</TableCell> 
                <TableCell sx={{ borderRight: '2px solid white'}}>{permiso.permisoDescripcion}</TableCell> 
                <TableCell align="center" sx={{ borderRight: '2px solid white', textAlign: 'center' }}> 
                  <FormControlLabel
                    control={
                      <Radio
                        checked={permiso.estado === true} // Verifica si el estado es true
                        onChange={() => onToggle(permiso.permisoId, true)} // Cambia el estado a true
                        sx={{ ml: '28px' }}
                      />
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <FormControlLabel
                    control={
                      <Radio
                        checked={permiso.estado === false} // Verifica si el estado es false
                        onChange={() => onToggle(permiso.permisoId, false)} // Cambia el estado a false
                        sx={{ ml: '28px' }}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaPermisos;
