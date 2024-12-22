/* 
package pe.edu.pucp.onepucp.rrhh.repository;
import java.util.Optional;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.ArrayList;
import pe.edu.pucp.onepucp.rrhh.model.Permiso;
import pe.edu.pucp.onepucp.rrhh.model.PermisoPersona;
import pe.edu.pucp.onepucp.rrhh.model.PermisoRolDTO;


public interface PermisoPersonaRepository extends JpaRepository<PermisoPersona, Long>{
    // Obtener permisos activos (estado = true) por rol
    @Query("SELECT pp.permiso FROM PermisoPersona pp WHERE pp.persona.id = :idPersona AND pp.estado = true")
    ArrayList<Permiso> findPermisosActivosByRol(@Param("idPersona") Long idPersona);

    @Query("SELECT new pe.edu.pucp.onepucp.rrhh.model.PermisoRolDTO(pr.permiso.id, pr.permiso.nombre, pr.permiso.descripcion, pr.estado) FROM PermisoPersona pr WHERE pr.persona.id = :usuarioId")
    List<PermisoRolDTO> findPermisosConEstadoPorPersona(@Param("usuarioId") Long usuarioId);

    Optional<PermisoPersona> findByPersonaIdAndPermisoId(Long personaId, Long permisoId);

}
*/