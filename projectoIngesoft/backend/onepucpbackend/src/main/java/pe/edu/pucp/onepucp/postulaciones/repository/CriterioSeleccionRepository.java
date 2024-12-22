package pe.edu.pucp.onepucp.postulaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import pe.edu.pucp.onepucp.postulaciones.model.CriterioSeleccion;

import java.util.List;

public interface CriterioSeleccionRepository extends CrudRepository<CriterioSeleccion, Long> {

    @Query("SELECT c FROM CriterioSeleccion c WHERE c.procesoDeSeleccion.activo = true")
    List<CriterioSeleccion> findAllByProcesoDeSeleccionActivo();
}
