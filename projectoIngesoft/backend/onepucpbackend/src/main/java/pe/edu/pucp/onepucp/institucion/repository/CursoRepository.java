package pe.edu.pucp.onepucp.institucion.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import pe.edu.pucp.onepucp.institucion.model.Curso;
public interface CursoRepository extends CrudRepository<Curso,Long>{

    List<Curso> findByEspecialidad_Id(Long especialidadId);

    
    
    @Query(value = "SELECT c.* FROM curso c " +
               "JOIN especialidad e ON c.id_especialidad = e.id_especialidad " +
               "JOIN unidad u ON e.facultad_id = u.id " +
               "WHERE c.codigo = :codigo AND c.nombre = :nombre AND u.nombre = :nombreFacultad", nativeQuery = true)
    List<Curso> findCursoByCodigoNombreAndFacultad(@Param("codigo") String codigo, @Param("nombre") String nombre, @Param("nombreFacultad") String nombreFacultad);

        
    //Obtener cursos habilitados para matricula adicional (por especialidad del alumno y ciclo actual)
    /*@Query(value = "SELECT c.* FROM curso c " +
    "JOIN especialidad e ON c.id_especialidad = e.id_especialidad " +
    "JOIN semestre_curso sc ON c.idCurso = sc.curso_id " +
    "JOIN semestre s ON sc.semestre_id = s.idSemestre " +
    "WHERE e.nombre = :especialidad AND s.nombre = :semestre", nativeQuery = true)*/
    @Query("SELECT c FROM Curso c " +
    "JOIN c.especialidad e " +
    "WHERE e.nombre = :especialidad")
    List<Curso> findCursoByEspecialidad(@Param("especialidad") String especialidad);

    @Query("SELECT c FROM Curso c " +
            "JOIN c.especialidad e " +
            "JOIN c.semestres s " +
            "WHERE e.nombre = :especialidad AND s.nombre = :semestre")
    List<Curso> findCursoByEspecialidadAndSemestre(@Param("especialidad") String especialidad, @Param("semestre") String semestre);
    @Query("SELECT c FROM Curso c " +
    "JOIN c.especialidad e " +
    "JOIN e.facultad f " +
    "WHERE (:nombre IS NULL OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) " +
    "AND (:codigo IS NULL OR LOWER(c.codigo) LIKE LOWER(CONCAT('%', :codigo, '%'))) " +
    "AND (:nombreFacultad IS NULL OR LOWER(f.nombre) LIKE LOWER(CONCAT('%', :nombreFacultad, '%')))")
    List<Curso> buscarCursosNombreCodigoFacultad(@Param("nombre") String nombre,
                      @Param("codigo") String codigo,
                      @Param("nombreFacultad") String nombreFacultad);

    Page<Curso> findAll(Pageable pageable);

    boolean existsByCodigo(String codigo);
    Optional<Curso> findByIdCurso(Long idCurso); 
    boolean existsByIdCursoAndActivoTrue(Long idCurso);
}
