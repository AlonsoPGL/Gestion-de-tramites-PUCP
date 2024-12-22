package pe.edu.pucp.onepucp.institucion.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO2;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.institucion.model.JefeDePractica;
import pe.edu.pucp.onepucp.institucion.model.TipoHorario;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.model.Docente;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {

    List<Horario> findByCursoIdCurso(int idCurso);

    @Query("SELECT h FROM Horario h "
            + "JOIN h.curso c "
            + "JOIN c.especialidad e "
            + "JOIN c.semestres s "
            + "WHERE e.nombre = :especialidad AND s.nombre = :semestre")
    List<Horario> findHorariosByEspecialidadAndSemestre(@Param("especialidad") String especialidad, @Param("semestre") String semestre);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO horario_docente (docente_id, horario_id) VALUES (:docenteId, :horarioId)", nativeQuery = true)
    void asignarDocenteAHorario(Long docenteId, Long horarioId);
    // @Modifying

    @Transactional
    @Query(value = "SELECT COUNT(*)  FROM horario_docente  WHERE horario_id = :idHorario AND docente_id = :idDocente", nativeQuery = true)
    int existsByHorarioIdAndDocenteId(@Param("idHorario") Long idHorario, @Param("idDocente") Long idDocente);

    @Modifying
    @Transactional
    @Query("UPDATE Horario h SET h.delegado.id = :idDelegado WHERE h.id = :idHorario")
    void asignarNuevoDelegado(@Param("idDelegado") Long idDelegado, @Param("idHorario") Long idHorario);

    // Método que devuelve la lista de horarios
    @Query("SELECT h FROM Horario h JOIN h.alumnos a WHERE a.id = :alumnoId")
    List<Horario> findByAlumnoId(@Param("alumnoId") Long alumnoId);

    List<Horario> findByDocentesId(Long docenteId);

    @Query("SELECT h FROM Horario h WHERE h.codigoCurso = :codigoHorario")
    Horario findByCodigo(@Param("codigoHorario") String codigoHorario);

    @Query("SELECT h FROM Horario h WHERE h.codigoCurso = :codigoCurso AND h.codigo = :codigoHorario")
    Horario findByCodigoHorarioyCurso(@Param("codigoHorario") String codigoHorario,
            @Param("codigoCurso") String codigoCurso);

    /*@Query(value = "SELECT jp.* FROM horario_x_jefe_de_practica hj " +
               "JOIN jefe_de_practica jp ON hj.id_jefe_de_practica = jp.id_jefe_de_practica " +
               "WHERE hj.id_horario = :idHorario", nativeQuery = true)
    List<JefeDePractica> findJpsByHorarioId(@Param("idHorario") Long idHorario);*/
    @Query("SELECT jp FROM Horario h JOIN h.jps jp WHERE h.idHorario = :id")
    List<JefeDePractica> findJpsByHorarioId(@Param("id") Long id);

    @Query("SELECT docente FROM Horario h JOIN h.docentes docente WHERE h.idHorario = :id")
    List<Docente> findDocentesByHorarioId(@Param("id") Long id);

    Optional<Horario> findById(Long idHorario);

    List<HorarioDTO2> findByCursoIdCurso(Long idCurso);

    @Query("SELECT jp FROM JefeDePractica jp")
    List<JefeDePractica> findAllJps();

    @Query("SELECT COUNT(h) FROM Horario h WHERE h.curso.idCurso = :idCurso AND h.activo = true AND h.visible = true")
    long contarHorariosActivosYVisibles(@Param("idCurso") Long idCurso);

    @Query("SELECT h FROM Horario h WHERE h.curso.idCurso = :idCurso AND h.activo = true")
    List<Horario> findHorariosActivosByCursoId(@Param("idCurso") Long idCurso);

    @Modifying
    @Transactional
    @Query("UPDATE Horario h SET h.activo = false WHERE h.idHorario = :idHorario")
    void eliminarLogicamente(@Param("idHorario") Long idHorario);

    void existsByCodigo(String codigo);

    void existsByCodigoCurso(String codigoCurso);

    boolean existsByTipoHorario(TipoHorario tipoHorario);

    boolean existsByCodigoAndCodigoCursoAndTipoHorarioAndActivoTrue(String codigo, String codigoCurso, TipoHorario tipoHorario);

    Optional<Horario> findByCodigoAndCodigoCursoAndTipoHorarioAndActivoTrue(String codigo, String codigoCurso, TipoHorario tipoHorario);
    
    @Query("SELECT COUNT(h) > 0 FROM Horario h JOIN h.alumnos a WHERE h.idHorario = :horarioId AND a.id = :alumnoId")
    boolean existsByHorarioIdAndAlumnoId(@Param("horarioId") Long horarioId, @Param("alumnoId") Long alumnoId);

    boolean existsByIdHorarioAndAlumnos_Id(Long horarioId, Long alumnoId);

    @Query("SELECT CASE WHEN COUNT(h) > 0 THEN TRUE ELSE FALSE END " +
    "FROM Horario h " +
    "WHERE h.encuestaDocente.id = :idEncuesta")
boolean existsByIdEncuestaDocente(@Param("idEncuesta") Long idEncuesta);

@Query("SELECT CASE WHEN COUNT(h) > 0 THEN TRUE ELSE FALSE END " +
    "FROM Horario h " +
    "WHERE h.encuestaJp.id = :idEncuesta")
boolean existsByIdEncuestaJP(@Param("idEncuesta") Long idEncuesta);
    List<Alumno> findAlumnosByIdHorario(Long idHorario);
}
