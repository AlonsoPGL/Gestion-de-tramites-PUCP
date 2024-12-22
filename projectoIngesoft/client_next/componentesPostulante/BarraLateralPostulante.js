"use client";
import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useRouter } from 'next/navigation';
import { usePersona } from '@/app/PersonaContext';
import { useInstitucion } from '@/app/InstitucionContext';

const estiloNavPill = {
  justifyContent: 'flex-start',
  textAlign: 'left',
  minHeight: '40px',
};

const BarraLateralPostulante = () => {
  const { institucion } = useInstitucion();
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const { logout } = usePersona();

  const cerrarSesionClick = () => {
    logout();
    router.push("/");
  };

  const handleTabClick = (tabIndex, route) => {
    setTabValue(tabIndex);
    router.push(route);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#363581',
        padding: '10px',
        color: '#FFFFFF',
        height: '100vh',
        width: '220px',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ marginBottom: '30px', marginTop: '30px' }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={`data:image/jpeg;base64,${institucion.logo}`}
            alt={institucion.nombre}
            style={{ width: 35, height: 35, marginRight: '10px' }}
          />
          {institucion.nombre}
        </Typography>
      </Box>

      <Tabs
        orientation="vertical"
        value={tabValue}
        onChange={(event, newValue) => setTabValue(newValue)}
        sx={{
          '& .MuiTab-root': {
            backgroundColor: '#363581',
            borderRadius: '10px',
            marginBottom: '5px',
            color: '#FFFFFF',
            alignItems: 'center',
            display: 'flex',
            '&.Mui-selected': {
              backgroundColor: '#5D71BC',
              color: '#FFFFFF',
            },
          },
        }}
      >
        <Tab
          icon={<CampaignIcon />}
          iconPosition="start"
          label="Postulacion"
          sx={estiloNavPill}
          onClick={() => handleTabClick(0, '/postulante/postulacion')}
        />
      </Tabs>

      <Box sx={{ position: "absolute", bottom: 40 }}>
        <Button variant="outlined" sx={{ color: "white" }} onClick={cerrarSesionClick}>
          <LogoutIcon sx={{ fontSize: 25, marginRight: '10px', color: "white" }} />
          Regresar  
        </Button>
      </Box>
    </Box>
  );
};

export default BarraLateralPostulante;
