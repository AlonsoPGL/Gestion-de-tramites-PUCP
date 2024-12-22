"use client";
import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Typography, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { usePersona } from '@/app/PersonaContext';
import { InstitucionContext,useInstitucion } from '@/app/InstitucionContext';
import PeopleIcon from '@mui/icons-material/People';

const estiloNavPill = {
  justifyContent: 'flex-start',
  textAlign: 'left',
  minHeight: '40px',
};

{/*
  '/../secretarioAcademico/encuestaDocente': { id: 18, nombre: 'ENCUESTAS' },
  '/../secretariaEspecialidad/encuestaJP': { id: 22, nombre: 'ENCUESTAS' },
*/}

const RUTAS_PERMISOS = {
  '/home': { id: 1, nombre: 'INICIO' },
  '/../administrador/gestionFacultad/listadoFacultades': { id: 2, nombre: 'FACULTADES' },
  '/../administrador/gestionEspecialidad/listadoEspecialidades': { id: 3, nombre: 'ESPECIALIDADES' },
  '/../administrador/gestionDepartamento/listadoDepartamentos': { id: 4, nombre: 'DEPARTAMENTO' },
  '/../administrador/gestionSeccion/listadoSecciones': { id: 5, nombre: 'SECCIONES' },
  '/../administrador/gestionUsuario': { id: 6, nombre: 'USUARIOS' },
  '/../administrador/gestionSemestre/listadoSemestres': { id: 7, nombre: 'SEMESTRES' },
  '/../administrador/gestionPerfilInstitucion': { id: 8, nombre: 'CONFIGURACION' },
  '/../coordinadorSeccion/seleccionFinalDocentes': {id: 9, nombre: 'DOCENTES'},
  '/../coordinadorSeccion/asignarDocente': { id: 10, nombre: 'CURSOS' },
  '/../alumno/solicitudes': { id: 12, nombre: 'SOLICITUDES' },
  '/../alumno/encuestas': { id: 13, nombre: 'ENCUESTAS' },
  '/../alumno/preguntasFrecuentes': { id: 14, nombre: 'PREGUNTAS FRECUENTES' },
  '/../secretarioAcademico/solicitudes': { id: 17, nombre: 'SOLICITUDES' },
  '/../coordinadorArea/tesis': { id: 19, nombre: 'TESIS' },
  '/../asesor/tesis': { id: 20, nombre: 'TESIS' },
  '/../secretariaEspecialidad/solicitudes': { id: 21, nombre: 'SOLICITUDES' },
  '/../directorCarrera/alumnosEnRiesgo': { id: 27, nombre: 'ALUMNO EN RIESGO' },
  '/../directorCarrera/tesis': { id: 24, nombre: 'TESIS' },
  '/../directorCarrera/preguntasFrecuentes': { id: 29, nombre: 'PREGUNTAS FRECUENTES' },
  '/../directorCarrera/solicitudes': { id: 26, nombre: 'SOLICITUDES' },
  '/../directorCarrera/planDeEstudios/gestionPlanDeEstudio/listadoCursoxPlanDeEstudio': { id: 23, nombre: 'PLAN DE ESTUDIOS' },
  '/../docente/asignarDelegado': { id: 31, nombre: 'CURSOS' },
  '/../docente/alumnosEnRiesgo': { id: 33, nombre: 'ALUMNO EN RIESGO' },
  '/../docente/solicitudes': { id: 30, nombre: 'SOLICITUDES' },
  '/../asistenteSeccion/convocatorias': { id: 34, nombre: 'CONVOCATORIA' },
  '/../comiteSeleccion/docentes': { id: 35, nombre: 'DOCENTES' },
  '/../directorCarrera/encuestas': { id: 37, nombre: 'ENCUESTAS' },
  '/../asistenteSeccion/encuestas': { id: 38, nombre: 'ENCUESTAS' }
};

const BarraLateral = ({ idPersona, idRol }) => {
  const [permisos, setPermisos] = useState([]);
  const {institucion} = useInstitucion();
  const router = useRouter();
  const pathname = usePathname();
  const {persona} = usePersona();

  // Initialize tabValue from localStorage or default to 0
  const [tabValue, setTabValue] = useState(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('selectedTab');
      return storedValue ? parseInt(storedValue, 10) : 0;
    }
    return 0;
  });

  // Función para obtener el índice del permiso basado en la ruta actual
  const getTabIndexFromPath = (permisos, currentPath) => {
    for (const [ruta, info] of Object.entries(RUTAS_PERMISOS)) {
      if (currentPath.includes(ruta)) {
        const index = permisos.findIndex(p => p.id === info.id);
        if (index !== -1) return index;
      }
    }
    return 0;
  };

  // Efecto para cargar permisos y establecer la pestaña inicial
  useEffect(() => {
    const obtenerPermisos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/gestUsuario/PermisoControl/listarpermisosActivosPorRol', {
          params: { id: idRol }
        });
        setPermisos(response.data);
        
        // Solo establecer el tabValue si no hay uno guardado en localStorage
        if (!localStorage.getItem('selectedTab')) {
          const index = getTabIndexFromPath(response.data, pathname);
          setTabValue(index);
          localStorage.setItem('selectedTab', index.toString());
        }
      } catch (error) {
        console.error('Error al obtener permisos:', error);
      }
    };

    obtenerPermisos();
  }, [idRol]);

  // Efecto para mantener sincronizado el estado con localStorage
  useEffect(() => {
    localStorage.setItem('selectedTab', tabValue.toString());
  }, [tabValue]);

  const handleTabClick = (permiso, index) => {
    for (const [ruta, info] of Object.entries(RUTAS_PERMISOS)) {
      if (info.id === permiso.id) {
        setTabValue(index);
        localStorage.setItem('selectedTab', index.toString());
        router.push(ruta);
        return;
      }
    }
    console.warn(`No se encontró una ruta para el permiso: ${permiso.id}_${permiso.nombre}`);
  };

  const { logout } = usePersona();

  const cerrarSesionClick = () => {
    localStorage.removeItem('selectedTab'); // Limpiar la selección al cerrar sesión
    logout();
    router.push("/");
  }

  if (!permisos.length) {
    return null;
  }

  //!Para volver a la seleccion de rol:
  const elegirRolClick = () => {
    router.push("/seleccionPerfil");  // Using absolute path instead of relative
  }

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
        {permisos.map((permiso, index) => {
          const iconoUrl = permiso.icono ? atob(permiso.icono) : null;

          return (
            <Tab
              key={permiso.id}
              icon={
                iconoUrl ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={iconoUrl}
                      alt={permiso.nombre}
                      style={{ width: 20, height: 20, marginRight: '3px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'ruta/a/icono_por_defecto.png';
                      }}
                    />
                  </Box>
                ) : null
              }
              iconPosition="start"
              label={permiso.nombre}
              sx={estiloNavPill}
              onClick={() => handleTabClick(permiso, index)}
            />
          );
        })}
      </Tabs>

      <Box sx={{position: "absolute", bottom: 80}}>
        <Button variant="outlined" sx={{ color: "white" }} onClick={elegirRolClick}>
          <PeopleIcon sx={{ fontSize: 25, marginRight: '10px', color: "white" }} />
          Cambiar de rol
        </Button>
      </Box>
      
      <Box sx={{ position: "absolute", bottom: 40 }}>
        <Button variant="outlined" sx={{ color: "white" }} onClick={cerrarSesionClick}>
          <LogoutIcon sx={{ fontSize: 25, marginRight: '10px', color: "white" }} />
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );
};

export default BarraLateral;