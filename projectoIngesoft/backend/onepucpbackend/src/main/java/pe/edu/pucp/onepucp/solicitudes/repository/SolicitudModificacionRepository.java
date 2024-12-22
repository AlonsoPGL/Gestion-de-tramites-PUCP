package pe.edu.pucp.onepucp.solicitudes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import pe.edu.pucp.onepucp.solicitudes.dto.solicitudModificacionDeMatriculaDTO;
import pe.edu.pucp.onepucp.solicitudes.model.ComentarioTesis;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudModificacionDeMatricula;

public interface SolicitudModificacionRepository extends JpaRepository<SolicitudModificacionDeMatricula,Long>{
    List<SolicitudModificacionDeMatricula> findByEmisor_Id(Long emisorId);
    List<SolicitudModificacionDeMatricula> findByEspecialidad_Id(Long id);

}
