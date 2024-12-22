// SolicitudInfoAlumnoEnRiesgoRepository.java
package pe.edu.pucp.onepucp.solicitudes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudInfoAlumnoEnRiesgo;
import java.util.List;

@Repository
public interface SolicitudInfoAlumnoEnRiesgoRepository extends JpaRepository<SolicitudInfoAlumnoEnRiesgo, Long> {
    
    // Método para listar solicitudes por alumnoEnRiesgoXHorario
    @Query("SELECT s FROM SolicitudInfoAlumnoEnRiesgo s WHERE s.alumnoEnRiesgoXHorario.id = :idAluxhor AND s.activo = true AND s.alumnoEnRiesgoXHorario.activo = true")
    List<SolicitudInfoAlumnoEnRiesgo> findSolicitudesByAlumnoEnRiesgoXHorarioId(@Param("idAluxhor") Long idAluxhor);


    // Método para listar solicitudes por alumno y horario
    @Query("SELECT s FROM SolicitudInfoAlumnoEnRiesgo s WHERE s.alumnoEnRiesgoXHorario.alumno.id = :alumnoId AND s.alumnoEnRiesgoXHorario.horario.id = :horarioId AND s.activo = true AND s.alumnoEnRiesgoXHorario.activo = true")
    List<SolicitudInfoAlumnoEnRiesgo> findSolicitudesByAlumnoIdAndHorarioId(@Param("alumnoId") Long alumnoId, @Param("horarioId") Long horarioId);
    
    // Método para listar solicitudes por alumnoEnRiesgoXHorario
    @Query("SELECT s FROM SolicitudInfoAlumnoEnRiesgo s WHERE s.activo = true AND s.alumnoEnRiesgoXHorario.activo = true")
    List<SolicitudInfoAlumnoEnRiesgo> findAllActive();
    
    // Método para listar solicitudes por alumnoEnRiesgoXHorario
    @Query("SELECT s FROM SolicitudInfoAlumnoEnRiesgo s WHERE s.activo = true AND s.alumnoEnRiesgoXHorario.id = :id AND s.alumnoEnRiesgoXHorario.activo = true")
    List<SolicitudInfoAlumnoEnRiesgo> findAllActivexAlumno(@Param("id") Long id);
    
}
