package pe.edu.pucp.onepucp.solicitudes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudJurados;
@Repository
public interface SolicitudJuradosRepository extends JpaRepository<SolicitudJurados,Long> {
    @Query("SELECT s FROM SolicitudJurados s WHERE s.tesis.titulo LIKE %:tituloTesis%")
    List<SolicitudJurados> findByTituloTesisContaining(@Param("tituloTesis") String tituloTesis);
}
