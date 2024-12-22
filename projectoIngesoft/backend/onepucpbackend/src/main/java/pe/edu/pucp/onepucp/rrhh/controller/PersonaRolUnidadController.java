package pe.edu.pucp.onepucp.rrhh.controller;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.rrhh.dto.PermisoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaRolUnidadDTO;
import pe.edu.pucp.onepucp.rrhh.dto.RolDTO;
import pe.edu.pucp.onepucp.rrhh.model.Permiso;
import pe.edu.pucp.onepucp.rrhh.model.PermisoRolDTO;
import pe.edu.pucp.onepucp.rrhh.model.PersonaRolUnidad;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.repository.PersonaRolUnidadRepository;
import pe.edu.pucp.onepucp.rrhh.service.PersonaRolUnidadService;

@RestController
@RequestMapping("/gestUsuario/personaRolUnidad")
public class PersonaRolUnidadController {
    private static final Logger logger = LoggerFactory.getLogger(PermisoController.class);

     @Autowired
    private PersonaRolUnidadRepository personaRolUnidadRepository;

    @Autowired
    private PersonaRolUnidadService personaRolUnidadService;
    
    @GetMapping("/PersonaPorRoles")
    public List<PersonaRolUnidadDTO> getRolesPorPersona(@RequestParam Long idPersona) {
        return personaRolUnidadRepository.findRolesActivosPorPersona(idPersona);
    }

    @PostMapping("/insertarPersonaRolUnidad")
    public ResponseEntity<PersonaRolUnidad> insertar(@RequestParam Long personaId,
                                                      @RequestParam Long rolId,
                                                      @RequestParam Long unidadId) {
        PersonaRolUnidad personaRolUnidad = personaRolUnidadService.insertarPersonaRolUnidad(personaId, rolId, unidadId, true);
        return ResponseEntity.ok(personaRolUnidad);
    }

    @DeleteMapping("/eliminar")
    public String eliminarRol(@RequestParam Long id) {
        logger.info("Iniciando eliminación de persona con id: {}", id);

        boolean eliminado = personaRolUnidadService.eliminarPersonaRolUnidad(id);
        if (eliminado) {
            logger.info("rol con id {} eliminado con éxito", id);
            return "Persona eliminada con éxito";
        } else {
            logger.error("Error al eliminar rol con id {}", id); // Log de error
            return "Error al eliminar el rol o no existe";
        }
    }

    @GetMapping("/rolesActivosPorPersona")
    public List<RolDTO> getRolesActivosPorPersona(@RequestParam Long idPersona) {
        List<Rol> roles = personaRolUnidadRepository.findPersonaActivosByRol(idPersona);
        return roles.stream().map(RolDTO::new).collect(Collectors.toList());
    }

    @PostMapping("/actualizarRolesPersona")
    public void asignarPermisos(@RequestParam Long idPersona, @RequestBody List<Map<String, Object>> rolesActualizados) {
    
        // Para cada permiso recibido, actualizamos su estado
        for (Map<String, Object> personaRolActualizado : rolesActualizados) {
            
            Long rolId = ((Number) personaRolActualizado.get("rolId")).longValue();
            Boolean estado = (Boolean) personaRolActualizado.get("estado");
            
            // Buscar el registro en persona_x_permiso
            Optional<PersonaRolUnidad> personaRolExistente = personaRolUnidadRepository.findByPersonaIdAndRolId(idPersona, rolId);

            if (personaRolExistente.isPresent()) {
                PersonaRolUnidad personaRol = personaRolExistente.get();
                // Actualizamos el estado del permiso
                personaRol.setEstado(estado);
                personaRolUnidadRepository.save(personaRol);
            }
            
        }
    }

}
