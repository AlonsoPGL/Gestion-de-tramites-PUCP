package pe.edu.pucp.onepucp.solicitudes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudPedidoCurso;

import java.util.List;

@Repository
public interface SolicitudPedidoCursoRepository extends JpaRepository<SolicitudPedidoCurso,Long> {
    List<SolicitudPedidoCurso> findBySolicitudPedidoCursoId(Long idSolicitudPedido);

}
