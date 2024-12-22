package pe.edu.pucp.onepucp.institucion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import pe.edu.pucp.onepucp.institucion.model.Unidad;

public interface UnidadRepository extends JpaRepository<Unidad, Long>{
    @Query("SELECT u FROM Unidad u WHERE u.id = :id")
    Unidad findByIdSimple(@Param("id") Long id);
}
