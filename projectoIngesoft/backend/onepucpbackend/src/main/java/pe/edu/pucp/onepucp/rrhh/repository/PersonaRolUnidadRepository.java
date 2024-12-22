package pe.edu.pucp.onepucp.rrhh.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import pe.edu.pucp.onepucp.institucion.model.Unidad;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaRolUnidadDTO;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.PersonaRolUnidad;
import pe.edu.pucp.onepucp.rrhh.model.Rol;



public interface PersonaRolUnidadRepository extends JpaRepository<PersonaRolUnidad, Long>{
    // Obtener roles activos (estado = true) por rol
    @Query("SELECT pp.rol FROM PersonaRolUnidad pp WHERE pp.persona.id = :idPersona AND pp.estado = true")
    ArrayList<Rol> findPersonaActivosByRol(@Param("idPersona") Long idPersona);

    
    Optional<PersonaRolUnidad> findByPersonaIdAndRolId(Long personaId, Long RolId);

    @Query("SELECT new pe.edu.pucp.onepucp.rrhh.dto.PersonaRolUnidadDTO(pr.id, pr.rol.id, pr.unidad.id, pr.rol.nombre, pr.rol.descripcion, pr.rol.tipo, pr.unidad.nombre) " +
       "FROM PersonaRolUnidad pr " +
       "WHERE pr.persona.id = :usuarioId AND pr.estado = true")
    List<PersonaRolUnidadDTO> findRolesActivosPorPersona(@Param("usuarioId") Long usuarioId);

    default PersonaRolUnidad findByIdOrThrow(Long id) {
        return findById(id).orElseThrow(() -> new IllegalArgumentException("rol no encontrado con ID: " + id));
    }

    // Buscar por Persona y Unidad
    Optional<PersonaRolUnidad> findByPersonaAndUnidadAndEstado(Persona persona, Unidad unidad, boolean estado);
}
