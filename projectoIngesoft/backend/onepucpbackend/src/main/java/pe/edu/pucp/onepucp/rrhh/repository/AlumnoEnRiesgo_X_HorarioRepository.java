package pe.edu.pucp.onepucp.rrhh.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.rrhh.model.AlumnoEnRiesgo_X_Horario;
import java.util.List;

@Repository
public interface AlumnoEnRiesgo_X_HorarioRepository extends JpaRepository<AlumnoEnRiesgo_X_Horario, Long> {

    @Query("SELECT h FROM AlumnoEnRiesgo_X_Horario h WHERE h.alumno.id = :idAlumno and h.horario.id = :idHorario")
    AlumnoEnRiesgo_X_Horario findByIdHorario(@Param("idAlumno") Long idAlumno, @Param("idHorario") Long idHorario);
    //AlumnoEnRiesgo_X_Horario findByHorarioId(Long idHorario);

    @Query("SELECT h FROM AlumnoEnRiesgo_X_Horario h WHERE h.alumno.id = :idAlumno")
    Optional<AlumnoEnRiesgo_X_Horario> findByIdAlumno(@Param("idAlumno") Long idAlumno);
    
    // Método para obtener todos los alumnos en riesgo con los puntajes recibidos
    @Query("SELECT a FROM AlumnoEnRiesgo_X_Horario a JOIN a.solicitudes s WHERE s.activo = true")
    List<AlumnoEnRiesgo_X_Horario> findAllConPuntajes();

    //Método para listar activo = true
    @Query("SELECT a FROM AlumnoEnRiesgo_X_Horario a WHERE a.activo = true")
    List<AlumnoEnRiesgo_X_Horario> findAllActive();

    //Método para listar activo = true
    @Query("SELECT a FROM AlumnoEnRiesgo_X_Horario a JOIN a.horario h JOIN h.docentes d WHERE a.activo = true AND d.id = :idDocente")
    List<AlumnoEnRiesgo_X_Horario> findAllActiveXDocente(@Param("idDocente") Long idDocente);

    //Método para obtener un alumno en riesgo 
    @Query("SELECT a FROM AlumnoEnRiesgo_X_Horario a WHERE a.activo = true AND a.id = :idAluERXH")
    AlumnoEnRiesgo_X_Horario obtenerUnAlumnoEnRiesgo(@Param("idAluERXH") Long idAluERXH);


}

