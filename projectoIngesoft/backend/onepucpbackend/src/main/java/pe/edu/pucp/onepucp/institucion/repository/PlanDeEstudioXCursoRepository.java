package pe.edu.pucp.onepucp.institucion.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.institucion.model.PlanDeEstudioXCurso;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanDeEstudioXCursoRepository extends JpaRepository<PlanDeEstudioXCurso, Long> {



    //!LISTAR
    // Listar todos los cursos activos por el Id del plan de estudio con paginación
    @Query("SELECT pxc FROM PlanDeEstudioXCurso pxc " +
           "WHERE pxc.planDeEstudio.idPlanDeEstudio = :idPlanDeEstudio " +
           "AND pxc.activo = true")
    Page<PlanDeEstudioXCurso> findCursosByPlanDeEstudioIdPlanDeEstudio(
        @Param("idPlanDeEstudio") Long idPlanDeEstudio, 
        Pageable pageable
    );
    List<PlanDeEstudioXCurso> findCursosByPlanDeEstudioIdPlanDeEstudio(Long idPlanDeEstudio);
    // Listar cursos por ciclo y plan de estudio con paginación
    @Query("SELECT pxc FROM PlanDeEstudioXCurso pxc " +
           "WHERE pxc.planDeEstudio.idPlanDeEstudio = :idPlanDeEstudio " +
           "AND pxc.ciclo = :ciclo " +
           "AND pxc.activo = true")
    Page<PlanDeEstudioXCurso> findCursosByCicloAndPlanDeEstudioId(
        @Param("ciclo") int ciclo,
        @Param("idPlanDeEstudio") Long idPlanDeEstudio,
        Pageable pageable
    );

    // Listar cursos electivos por plan de estudio con paginación
    @Query("SELECT pxc FROM PlanDeEstudioXCurso pxc " +
           "WHERE pxc.planDeEstudio.idPlanDeEstudio = :idPlanDeEstudio " +
           "AND pxc.esElectivo = true " +
           "AND pxc.activo = true")
    Page<PlanDeEstudioXCurso> findCursosElectivosByPlanDeEstudioId(
        @Param("idPlanDeEstudio") Long idPlanDeEstudio,
        Pageable pageable
    );

    // Método de ayuda para ordenamiento por defecto
    default Page<PlanDeEstudioXCurso> findAllActiveOrderedByIdDesc(Long idPlanDeEstudio, Pageable pageable) {
        return findCursosByPlanDeEstudioIdPlanDeEstudio(idPlanDeEstudio, pageable);
    }

    // Método para verificar si existe un curso en un plan de estudio
    @Query("SELECT COUNT(pxc) > 0 FROM PlanDeEstudioXCurso pxc " +
           "WHERE pxc.planDeEstudio.idPlanDeEstudio = :idPlanDeEstudio " +
           "AND pxc.curso.idCurso = :idCurso " +
           "AND pxc.activo = true")
    boolean existsCursoInPlanDeEstudio(
        @Param("idPlanDeEstudio") Long idPlanDeEstudio, 
        @Param("idCurso") Long idCurso
    );


    @Query("SELECT p FROM PlanDeEstudioXCurso p " +
           "JOIN p.planDeEstudio pe " +
           "JOIN pe.especialidad e " +
           "WHERE e.id = :idUnidad")
    List<PlanDeEstudioXCurso> findByIdUnidad(@Param("idUnidad") Long idUnidad);

    @Query("SELECT pxc FROM PlanDeEstudioXCurso pxc " +
    "WHERE pxc.curso.id = :cursoId " +
    "AND pxc.planDeEstudio.id = :planDeEstudioId")
Optional<PlanDeEstudioXCurso> findByCursoIdAndPlanDeEstudioId(
     @Param("cursoId") Long cursoId,
     @Param("planDeEstudioId") Long planDeEstudioId);

}