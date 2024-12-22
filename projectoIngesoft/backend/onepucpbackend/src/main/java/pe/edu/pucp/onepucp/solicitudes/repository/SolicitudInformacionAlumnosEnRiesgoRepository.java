package pe.edu.pucp.onepucp.solicitudes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudInformacionAlumnosEnRiesgo;

import java.util.List;

public interface SolicitudInformacionAlumnosEnRiesgoRepository extends CrudRepository<SolicitudInformacionAlumnosEnRiesgo,Long> {
List<SolicitudInformacionAlumnosEnRiesgo> findByHorario_Docentes_id(Long idDocente);
}
