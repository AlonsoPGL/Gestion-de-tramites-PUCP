import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, FormControlLabel, Paper } from '@mui/material';

const TablaAsignacionRoles = ({ roles, onToggle }) => {

  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflow: 'auto' }}>
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center', borderRight: '2px solid white' }}>Código</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center', borderRight: '2px solid white' }}>Rol</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center', borderRight: '2px solid white' }}>Descripción</TableCell>
            <TableCell sx={{ backgroundColor: '#363581', color: 'white', textAlign: 'center', borderRight: '2px solid white' }}>Tipo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((rol) => {
            return (
              <TableRow key={rol.rolId} sx={{ height: '40px', lineHeight: '30px', backgroundColor: '#F8F9FA', borderBottom: '4px solid white'}}> 
                <TableCell sx={{ borderRight: '2px solid white', textAlign: 'center' }}>{rol.rolId || ""}</TableCell> 
                <TableCell sx={{ borderRight: '2px solid white', textAlign: 'center' }}>{rol.rolNombre || ""}</TableCell> 
                <TableCell sx={{ borderRight: '2px solid white'}}>{rol.rolDescripcion || ""}</TableCell> 
                <TableCell sx={{ borderRight: '2px solid white'}}>{rol.tipo || ""}</TableCell> 
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaAsignacionRoles;
