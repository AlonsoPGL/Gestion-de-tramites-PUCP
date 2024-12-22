package pe.edu.pucp.onepucp.solicitudes.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudTemaTesis;
import java.util.Optional;
import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudTemaTesisRepository extends CrudRepository<SolicitudTemaTesis,Long> {

    //List<SolicitudTemaTesis> findByAlumnos_id();
    SolicitudTemaTesis findByEmisorId(Long id);
    Optional<SolicitudTemaTesis> findByTesisId(Long id);
    List<SolicitudTemaTesis> findByTesisEspecialidadId(Long idEspecialidad);
}
