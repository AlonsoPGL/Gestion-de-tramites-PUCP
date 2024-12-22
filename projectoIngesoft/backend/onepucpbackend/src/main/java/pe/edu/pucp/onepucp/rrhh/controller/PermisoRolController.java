package pe.edu.pucp.onepucp.rrhh.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.rrhh.dto.PermisoDTO;
import pe.edu.pucp.onepucp.rrhh.model.Permiso;
import pe.edu.pucp.onepucp.rrhh.model.PermisoRol;
import pe.edu.pucp.onepucp.rrhh.model.PermisoRolDTO;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.repository.PermisoRolRepository;
import pe.edu.pucp.onepucp.rrhh.repository.PersonaRepository;


@RestController
@RequestMapping("/gestUsuario/PermisoControl")
public class PermisoRolController {

    @Autowired
    private PermisoRolRepository permisoRolRepository;

    @Autowired
    private PersonaRepository personaRepository;


    @GetMapping("/listarpermisosActivosPorRol")
    public List<PermisoDTO> getPermisosActivosPorRol(@RequestParam Long id) {
        List<Permiso> permisos =  permisoRolRepository.findPermisosActivosPorRol(id);
        return permisos.stream().map(PermisoDTO::new).collect(Collectors.toList());
    }


    @GetMapping("/permisosPorRol")
    public List<PermisoRolDTO> getPermisosPorRol(@RequestParam Long id) {
        return permisoRolRepository.findPermisosConEstadoPorRol(id);
    }



    @PostMapping("/actualizarPermisos")
    public void asignarPermisos(@RequestParam Long rolId, @RequestBody List<Map<String, Object>> permisosActualizados) {
        // Obtener todas las personas asociadas a este rol
        //List<Persona> personas = personaRepository.findByRolId(rolId); // Asegúrate de tener este método en tu repositorio

        // Para cada permiso recibido, actualizamos su estado
        for (Map<String, Object> permisoRolActualizado : permisosActualizados) {
            System.out.println("AQUIIIII\n\n\n");
            Long permisoId = ((Number) permisoRolActualizado.get("permisoId")).longValue();
            Boolean estado = (Boolean) permisoRolActualizado.get("estado");

            // Buscar el permiso existente por ID del permiso y ID del rol
            PermisoRol permisoRolExistente = permisoRolRepository.findByPermisoIdAndRolId(permisoId, rolId);
            
            if (permisoRolExistente != null) {
                // Actualizar el estado del permiso en PermisoRol
                permisoRolExistente.setEstado(estado);
                permisoRolRepository.save(permisoRolExistente);  // Guardar el cambio
                
                /*
                // Actualizar la tabla permiso_x_persona
                for (Persona persona : personas) {
                    System.out.println("PERSONA\n\n\n");
                    Optional<PermisoPersona> permisoPersonaExistente = permisoPersonaRepository.findByPersonaIdAndPermisoId(persona.getId(), permisoId);

                    // Solo actualizamos el estado si ya existe
                    if (permisoPersonaExistente.isPresent()) {
                        PermisoPersona permisoPersona = permisoPersonaExistente.get();
                        permisoPersona.setEstado(estado); // Actualizar el estado
                        permisoPersonaRepository.save(permisoPersona); // Guardar el cambio
                    } 
                }
                */
            } else {
                // Opcional: Manejo en caso de que el permiso no exista
                System.out.println("El permiso con ID " + permisoId + " no existe para el rol con ID " + rolId);
            }
        }
    }




}