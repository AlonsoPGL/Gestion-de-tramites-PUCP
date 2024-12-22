package pe.edu.pucp.onepucp.institucion.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.institucion.model.PlanDeEstudio;
@Repository
public interface PlanDeEstudioRepository extends JpaRepository<PlanDeEstudio, Long> {
    // Obtener plan de estudio por especialidad
    // PlanDeEstudio findByEspecialidadId(Long id);
    List<PlanDeEstudio> findAllByActivoTrue();
    Optional<PlanDeEstudio> findByEspecialidadId(Long id);
    boolean existsByIdPlanDeEstudioAndActivoTrue(Long id);
}
