/*
package pe.edu.pucp.onepucp.rrhh.controller;


import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.stream.Collectors;

import pe.edu.pucp.onepucp.rrhh.dto.PermisoDTO;
import pe.edu.pucp.onepucp.rrhh.model.Permiso;
import pe.edu.pucp.onepucp.rrhh.model.PermisoPersona;
import pe.edu.pucp.onepucp.rrhh.model.PermisoRol;
import pe.edu.pucp.onepucp.rrhh.model.PermisoRolDTO;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.repository.PermisoPersonaRepository;


@RestController
@RequestMapping("/gestUsuario/permisos")
public class PermisoPersonaController {
    
    private static final Logger logger = LoggerFactory.getLogger(PermisoController.class);

    @Autowired
    private PermisoPersonaRepository permisoPersonaRepository;

    @GetMapping("/permisosActivosPorPersona")
    public List<PermisoDTO> getPermisosActivosPorPersona(@RequestParam Long idPersona) {
        List<Permiso> permisos = permisoPersonaRepository.findPermisosActivosByRol(idPersona);
        return permisos.stream().map(PermisoDTO::new).collect(Collectors.toList());
    }


    @GetMapping("/permisosPorPersona")
    public List<PermisoRolDTO> getPermisosPorPersona(@RequestParam Long idPersona) {
        return permisoPersonaRepository.findPermisosConEstadoPorPersona(idPersona);
    }

    @PostMapping("/actualizarPermisos")
    public void asignarPermisos(@RequestParam Long idPersona, @RequestBody List<Map<String, Object>> permisosActualizados) {
    
        // Para cada permiso recibido, actualizamos su estado
        for (Map<String, Object> permisoRolActualizado : permisosActualizados) {
            
            Long permisoId = ((Number) permisoRolActualizado.get("permisoId")).longValue();
            Boolean estado = (Boolean) permisoRolActualizado.get("estado");
            
            // Buscar el registro en persona_x_permiso
            Optional<PermisoPersona> permisoPersonaExistente = permisoPersonaRepository.findByPersonaIdAndPermisoId(idPersona, permisoId);

            if (permisoPersonaExistente.isPresent()) {
                PermisoPersona permisoPersona = permisoPersonaExistente.get();
                // Actualizamos el estado del permiso
                permisoPersona.setEstado(estado);
                permisoPersonaRepository.save(permisoPersona);
            }
            
        }
    }
}
*/