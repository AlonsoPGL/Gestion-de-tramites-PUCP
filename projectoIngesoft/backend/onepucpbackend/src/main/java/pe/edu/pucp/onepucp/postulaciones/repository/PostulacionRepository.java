package pe.edu.pucp.onepucp.postulaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.postulaciones.model.EstadoPostulacion;
import pe.edu.pucp.onepucp.postulaciones.model.Postulacion;

@Repository
public interface PostulacionRepository extends CrudRepository<Postulacion,Long>{
    @Query("SELECT p FROM Postulacion p WHERE p.estado = pe.edu.pucp.onepucp.postulaciones.model.EstadoPostulacion.ESPERA_PASAR_PRIMER_FILTRO OR p.estado = pe.edu.pucp.onepucp.postulaciones.model.EstadoPostulacion.ESPERA_PASAR_SEGUNDO_FILTRO" +
            " OR p.estado = pe.edu.pucp.onepucp.postulaciones.model.EstadoPostulacion.NO_PASO_PRIMER_FILTRO")
    List<Postulacion> findPostulacionesEnEsperaPrimerFiltro();

    @Query("SELECT p FROM Postulacion p WHERE p.estado = pe.edu.pucp.onepucp.postulaciones.model.EstadoPostulacion.ESPERA_PASAR_SEGUNDO_FILTRO OR p.estado = pe.edu.pucp.onepucp.postulaciones.model.EstadoPostulacion.PASO_SEGUNDO_FILTRO" +
            " OR p.estado = pe.edu.pucp.onepucp.postulaciones.model.EstadoPostulacion.NO_PASO_SEGUNDO_FILTRO")
    List<Postulacion> findPostulacionesEnEsperaSegundaFiltro();

    @Query("SELECT p FROM Postulacion p WHERE p.estado = pe.edu.pucp.onepucp.postulaciones.model.EstadoPostulacion.PASO_FILTRO_FINAL OR p.estado = pe.edu.pucp.onepucp.postulaciones.model.EstadoPostulacion.PASO_SEGUNDO_FILTRO" +
            " OR p.estado = pe.edu.pucp.onepucp.postulaciones.model.EstadoPostulacion.NO_PASO_FILTRO_FINAL")
    List<Postulacion> findPostulacionesEtapaFinal();
        
    List<Postulacion> findByEstado(EstadoPostulacion estado);

    @Query("SELECT e FROM Postulacion  e ORDER BY e.id DESC")
    List<Postulacion> findAllOrdenadasDesc();

    List<Postulacion>  findAllByOrderByIdDesc();
}
