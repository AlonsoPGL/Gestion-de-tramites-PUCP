package pe.edu.pucp.onepucp.rrhh.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pe.edu.pucp.onepucp.rrhh.model.Permiso;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.service.RolService;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/rrhh/rol")
public class RolController {
    
    private static final Logger logger = LoggerFactory.getLogger(PersonaController.class);

    @Autowired
    RolService rolservice;

    @PostMapping("/insertarRol")
    public Rol insertarRol(@RequestBody Rol rol) {
        Rol nuevoRol = rolservice.insertarRol(rol.getNombre(),rol.getDescripcion(),rol.getTipo());
        return nuevoRol;
    }

    @GetMapping("/listarRoles")
    public List<Rol> listarRoles() {
        logger.info("Listando todas los roles...");
        List<Rol> roles = rolservice.obtenerTodosLosRoles();
        logger.info("Se encontraron {}  roles", roles.size());
        return roles;
    }

    @GetMapping("/listarPaginacion")
    public ResponseEntity<Page<Rol>> listarRoles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        logger.info("Listando todos los roles activos en la página: {}, tamaño: {}", page, size);
        Page<Rol> rolesPage = rolservice.obtenerTodasLosRolesPaginados(PageRequest.of(page, size));
        logger.info("Se encontraron {} roles", rolesPage.getTotalElements()); // Log con el tamaño de la lista
        return ResponseEntity.ok(rolesPage);
    }
    
    @PutMapping("/actualizarRol/{id}")
    public Rol actualizarRol(@PathVariable Long id, @RequestBody Rol rolActualizado) {
        logger.info("Iniciando actualización de rol con id: {}", id);
        Rol rolExistente = rolservice.actualizarRol(id, rolActualizado);
        if (rolExistente != null) {
            logger.info("Rol con id {} actualizada con éxito", id);
        } else {
            logger.error("Error al actualizar el rol con id {}", id); // Log de error si falla
        }
        return rolExistente;
    }

    @DeleteMapping("/eliminarRol/{id}")
    public void eliminarRol(@PathVariable Long id) {
        logger.info("Iniciando eliminación de rol con id: {}", id);
        boolean eliminado = rolservice.eliminarRol(id);
        if (eliminado) {
            logger.info("Rol con id {} eliminado con éxito", id);
        } else {
            logger.error("Error al eliminar el rol con id {}", id); // Log de error
        }
    }

}
