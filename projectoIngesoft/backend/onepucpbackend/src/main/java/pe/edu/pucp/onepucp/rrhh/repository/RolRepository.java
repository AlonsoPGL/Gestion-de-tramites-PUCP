package pe.edu.pucp.onepucp.rrhh.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.onepucp.rrhh.model.Rol;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long>{
    Page<Rol> findByActivoTrue(Pageable pageable);
    List<Rol> findByActivoTrue();
    default Rol findByIdOrThrow(Long id) {
        return findById(id).orElseThrow(() -> new IllegalArgumentException("Rol no encontrado con ID: " + id));
    }

    List<Rol> findByActivoTrueOrderByNombreAsc();
    Optional<Rol> findByNombreIgnoreCase(String nombre);
}
