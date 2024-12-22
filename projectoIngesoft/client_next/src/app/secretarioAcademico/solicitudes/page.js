"use client";
import BotonMenu from "../../../../componentesGenerales/botones/BotonMenu";
import CardMenu from "../../../../componentesGenerales/cards/CardMenu";
import { useRouter } from 'next/navigation';
import { usePedidoCurso  } from "@/app/PedidoCursoContext";
function MenuSolicitudes() {
    const router = useRouter();
    const { setPedidoCurso } = usePedidoCurso();
    // Redireccion para los botones
    const redirectSolicitudes = () => {

        router.push('./solicitudes/visualizarSolicitudJurado'); 


    }         
    const redirectPedidos = () => {

        router.push('./solicitudes/solicitarPedidoCursos');
    }

    const redirectListarPedidos = () => {
        localStorage.removeItem('selectedPedidoCurso');
        localStorage.setItem('editarPedidoCurso', JSON.stringify(false));
        setPedidoCurso('');
        router.push('./solicitudes/ListarSolicitudes');
    }
    const redirectListaMatriculaAdicional = () => {
        router.push('./solicitudes/matriculaAdicional')
    }
    return (
        <CardMenu>
                <BotonMenu texto="REGISTRAR Y VISUALIZAR SOLICITUDES DE JURADO"
                manejarClic={redirectSolicitudes}></BotonMenu>
                <BotonMenu texto="SOLICITAR PEDIDOS DE CURSOS A ESPECIALIDADES"
                manejarClic={redirectPedidos}></BotonMenu>
                <BotonMenu texto="LISTAR PEDIDO DE CURSOS"
                manejarClic={redirectListarPedidos}></BotonMenu>
                <BotonMenu texto="LISTAR SOLICITUDES DE MATRICULA ADICIONAL"
                manejarClic={redirectListaMatriculaAdicional}></BotonMenu>
                                           
        </CardMenu>



      
      
    );
  }
  
  export default MenuSolicitudes;