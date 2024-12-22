package pe.edu.pucp.onepucp.postulaciones.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.onepucp.postulaciones.model.Postulacion;
import pe.edu.pucp.onepucp.postulaciones.model.ProcesoDeSeleccion;

import java.util.List;

@Repository
public interface ProcesoDeSeleccionRepository extends CrudRepository<ProcesoDeSeleccion,Long> {


    @Query("SELECT e FROM ProcesoDeSeleccion  e ORDER BY e.id DESC")
    List<ProcesoDeSeleccion> findAllOrdenadasDesc();

    Page<ProcesoDeSeleccion>findAll(Pageable pageable);

}

