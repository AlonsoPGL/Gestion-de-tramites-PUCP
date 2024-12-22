package pe.edu.pucp.onepucp.rrhh.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.pucp.onepucp.rrhh.model.Permiso;
import pe.edu.pucp.onepucp.rrhh.service.PermisoService;
import java.util.ArrayList;

@RestController
@RequestMapping("/gestUsuario/permiso")
public class PermisoController {

    private static final Logger logger = LoggerFactory.getLogger(PermisoController.class);

    @Autowired
    PermisoService permisoService;

    @PostMapping("/insertarPermiso")
    public Permiso insertarPermiso(@RequestBody Permiso permiso) {
        Permiso nuevoPermiso = permisoService.insertarPermiso(permiso.getNombre(),permiso.getDescripcion(),permiso.getIcono());
        return nuevoPermiso;
    }

    @GetMapping("/listarPermisos")
    public ArrayList<Permiso> listarPermiso() {
        logger.info("Listando todas los permisos...");
        ArrayList<Permiso> permisos = permisoService.obtenerTodosLosPermisos();
        logger.info("Se encontraron {}  permisos", permisos.size());
        return permisos;
    }

    @GetMapping("/listarPermisosPorRol")
    public ArrayList<Permiso> obtenerPermisoPorRol(@RequestParam String rol){
        logger.info("Listando  permisos por rol...");
        ArrayList<Permiso> permisos = permisoService.obtenerPermisosPorRol(rol);
        logger.info("Se encontraron {}  permisos", permisos.size());
        return permisos;
    }
}
