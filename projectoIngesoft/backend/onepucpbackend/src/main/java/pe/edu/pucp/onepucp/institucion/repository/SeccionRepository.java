package pe.edu.pucp.onepucp.institucion.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import pe.edu.pucp.onepucp.institucion.model.Seccion;

public interface SeccionRepository extends JpaRepository<Seccion, Long> {

    default Page<Seccion> findAllActiveOrderedByIdDesc(Pageable pageable) {
        Pageable sortedByIdDesc = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("id").descending()
        );
        return findByActivoTrue(sortedByIdDesc);
    }

    Page<Seccion> findByActivoTrue(Pageable pageable);

    List<Seccion> findAllByActivoTrue();

    List<Seccion> findByActivoTrueOrderByNombreAsc();

    boolean existsByCodigoAndActivoTrue(String codigo);

    @Query(value = "SELECT COUNT(*) FROM seccion s WHERE s.jefe_id = ?1 AND s.activo = true",
            nativeQuery = true)
    int countByJefeIdAndActivoTrue(Long id);

    @Query(value = "SELECT COUNT(*) FROM seccion s WHERE s.asistente_id = ?1 AND s.activo = true",
            nativeQuery = true)
    int countByAsistenteIdAndActivoTrue(Long id);
    //OBTENER PRIMERO POR CODIGO
    @Query("SELECT s FROM Seccion s WHERE s.codigo = ?1 AND s.activo = true")
    Optional<Seccion> findFirstByCodigoAndActivoTrue(String codigo);
    



}
