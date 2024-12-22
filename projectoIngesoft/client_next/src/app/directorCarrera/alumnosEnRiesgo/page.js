// MENU DE ALUMNOS EN RIESGO
"use client";
import { useRouter } from 'next/navigation';
import BotonMenu from "../../../../componentesGenerales/botones/BotonMenu";
import CardMenu from "../../../../componentesGenerales/cards/CardMenu";

function MenuAlumnoEnRiesgo() {
    const router = useRouter();  

    // Función para manejar el clic y redirigir a una página
    const manejarClicListado = () => {
      router.push('/directorCarrera/alumnosEnRiesgo/listado');  // Redirige a la página de alumnos en riesgo
    };

    const manejarClicDashboard = () => {
      router.push('/directorCarrera/alumnosEnRiesgo/dashboard');  // Redirige al dashboard de alumnos en riesgo
    };
    
    const manejarClicRendimiento = () => {
      router.push('/directorCarrera/alumnosEnRiesgo/estadisticas');  // Redirige al dashboard de alumnos en riesgo
    };

    return (
      <CardMenu>
        <BotonMenu texto="LISTADO DE ALUMNOS EN RIESGO"
        manejarClic={manejarClicListado}></BotonMenu>
        <BotonMenu texto="MATRIZ DE RENDIMIENTOS DE ALUMNOS EN RIESGO"
        manejarClic={manejarClicRendimiento}></BotonMenu>
        {/*<BotonMenu texto="DASHBOARD DE ALUMNOS EN RIESGO"
        manejarClic={manejarClicDashboard}></BotonMenu> */}
      </CardMenu>
    );
  }
  
  export default MenuAlumnoEnRiesgo;