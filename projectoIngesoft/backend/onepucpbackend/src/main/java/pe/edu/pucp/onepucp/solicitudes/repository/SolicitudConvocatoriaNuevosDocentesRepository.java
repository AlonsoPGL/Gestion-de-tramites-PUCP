package pe.edu.pucp.onepucp.solicitudes.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudConvocatoriaNuevosDocentes;
@Repository
public interface SolicitudConvocatoriaNuevosDocentesRepository extends CrudRepository<SolicitudConvocatoriaNuevosDocentes,Long> {

}

