package pe.edu.pucp.onepucp.rrhh.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;

//public interface AlumnoRepository extends CrudRepository<Alumno, Long> {
 
@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {

    Optional<Alumno> findByNombreAndApellidoPaternoAndApellidoMaternoAndCodigo(String nombre, String apellidoPaterno, String apellidoMaterno, int codigo);

    Optional<Alumno> findByCodigo(Long codigo);

    /*
    @Modifying
    @Transactional
    @Query("UPDATE Alumno a SET a.enRiesgo  = true WHERE a.id = :alumnoId")
    void actualizarEstadoEnRiesgo(@Param("alumnoId") Long alumnoId);
    */
    @Modifying
    @Transactional
    @Query("UPDATE Alumno a SET a.enRiesgo  = true WHERE a.codigo = :codigoAlumno")
    void actualizarEstadoEnRiesgo(@Param("codigoAlumno") Long codigoAlumno);

    // Consulta para obtener alumno por codigo
    @Query("SELECT a FROM Alumno a WHERE a.codigo = :codigoAlumno")
    Alumno findAlumnoByCodigo(@Param("codigoAlumno") Long codigoAlumno);

    // Consulta para obtener los alumnos que están en riesgo
    @Query("SELECT a FROM Alumno a WHERE a.enRiesgo = true")
    List<Alumno> findAlumnosEnRiesgo();

    // Consulta para obtener los alumnos en general
    @Query("SELECT a FROM Alumno a WHERE CONCAT(a.nombre, ' ', a.apellidoPaterno, ' ', a.apellidoMaterno) LIKE %:searchTerm%")
    List<Alumno> buscarAlumnosPorNombre(@Param("searchTerm") String searchTerm);

    // Consulta para obtener los alumnos en riesgo
    @Query("SELECT a FROM Alumno a WHERE CONCAT(a.nombre, ' ', a.apellidoPaterno, ' ', a.apellidoMaterno) LIKE %:searchTerm% AND a.enRiesgo = true")
    List<Alumno> buscarAlumnosEnRiesgoPorNombre(@Param("searchTerm") String searchTerm);
    
    //@Query("SELECT DISTINCT a FROM Alumno a JOIN a.matriculas m JOIN m.horario h JOIN h.curso c WHERE c.idCurso = :cursoId AND a.enRiesgo = true")
    //List<Alumno> findAlumnosEnRiesgoByCurso(@Param("cursoId") Long cursoId);

    //@Query("SELECT DISTINCT a FROM Alumno a JOIN a.matriculas m JOIN m.horario h JOIN h.curso c JOIN c.semestres s WHERE s.idSemestre = :semestreId AND a.enRiesgo = true")
    //List<Alumno> findAlumnosEnRiesgoBySemestre(@Param("semestreId") Long semestreId);


    /*@Query("""
        SELECT new pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO(a.id, a.nombre, a.apellidoPaterno, a.apellidoMaterno, a.email, a.codigo, a.activo,a.enRiesgo) 
        FROM Alumno a 
        WHERE (:apellidoPaterno IS NULL OR a.apellidoPaterno = :apellidoPaterno)
          AND (:apellidoMaterno IS NULL OR a.apellidoMaterno = :apellidoMaterno)
          AND (:nombres IS NULL OR a.nombre = :nombres)
          AND (:codigo IS NULL OR a.codigo = :codigo)
    """)*/
    
    
    @Query("""
        SELECT a
        FROM Alumno a 
        WHERE a.activo = TRUE
        AND (:apellidoPaterno IS NULL OR a.apellidoPaterno LIKE CONCAT('%', :apellidoPaterno, '%'))
        AND (:apellidoMaterno IS NULL OR a.apellidoMaterno LIKE CONCAT('%', :apellidoMaterno, '%'))
        AND (:nombre IS NULL OR a.nombre LIKE CONCAT('%', :nombre, '%'))
        AND (:codigo IS NULL OR CAST(a.codigo AS string) LIKE CONCAT('%', :codigo, '%'))
    """)
List<Alumno> buscarPorCriterios(
    @Param("apellidoPaterno") String apellidoPaterno,
    @Param("apellidoMaterno") String apellidoMaterno,
    @Param("nombre") String nombre,
    @Param("codigo") Integer codigo
);


    @Query("SELECT a FROM Alumno a " +
            "JOIN HorarioAlumno ha ON a.id = ha.alumnoId " +
            "WHERE ha.horarioId = :idHorario")
    List<Alumno> findAllByHorarioId(@Param("idHorario") Long idHorario);

    //@EntityGraph(attributePaths = {"cuenta"})

    //@Query("SELECT axh.alumno FROM Alumno_X_Horario axh WHERE axh.horario.id = :horarioId")
    //List<Alumno> findAlumnosByHorarioId(@Param("horarioId") Long horarioId);
    Optional<Alumno> findByIdAndActivoTrue(Long id); // Método que busca por ID solo alumnos activos
    Optional<Alumno> findFirstByCodigoAndActivoTrue(int codigo); // Método que busca por código solo alumnos activos
    boolean existsByCodigoAndActivoTrue(int codigo); // Método que verifica si existe un alumno con el código dado
    // 3. Agregando condición de activo:
    @Query("SELECT a FROM Alumno a JOIN a.horarios h WHERE h.idHorario = :horarioId AND a.activo = true")
    List<Alumno> findActivoAlumnosByHorarioId(@Param("horarioId") Long horarioId);
}