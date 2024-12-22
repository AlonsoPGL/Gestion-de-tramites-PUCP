package pe.edu.pucp.onepucp.rrhh.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

import jakarta.transaction.Transactional;
import pe.edu.pucp.onepucp.institucion.model.TipoUnidad;
import pe.edu.pucp.onepucp.institucion.model.Unidad;
import pe.edu.pucp.onepucp.preguntas.model.TipoEncuesta;
import pe.edu.pucp.onepucp.rrhh.model.Permiso;
import pe.edu.pucp.onepucp.rrhh.model.PermisoRol;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.repository.PermisoRepository;
import pe.edu.pucp.onepucp.rrhh.repository.PermisoRolRepository;
import pe.edu.pucp.onepucp.rrhh.repository.RolRepository;

@Service
public class RolService {
    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PermisoRepository permisoRepository;

    @Autowired
    private PermisoRolRepository permisoRolRepository; // Inyecta el repositorio de PermisoRol
    

    @Transactional
    public Rol insertarRol(String nombre,String descripcion, TipoUnidad tipo){
        Rol nuevoRol = new Rol();
        nuevoRol.setNombre(nombre);
        nuevoRol.setDescripcion(descripcion);
        nuevoRol.setTipo(tipo);
        //Ingresa rol a la tabla rol
        nuevoRol = rolRepository.save(nuevoRol);

        //Cada vez que se ingresa un rol, se llena la tabla permiso_x_rol con el rol y n permisos en estado false
         // Obtener todos los permisos
        for (Permiso permiso : permisoRepository.findAll()) {
            PermisoRol permisoRol = new PermisoRol();
            permisoRol.setRol(nuevoRol);
            permisoRol.setPermiso(permiso);
            permisoRol.setEstado(false); // Establecer estado en false

            permisoRolRepository.save(permisoRol);
        }

        return nuevoRol;

    }
    public Page<Rol> obtenerTodasLosRolesPaginados(Pageable pageable) {
        return rolRepository.findByActivoTrue(pageable);
    }

    public List<Rol> obtenerTodosLosRoles(){
        return rolRepository.findByActivoTrueOrderByNombreAsc();
    }

    @Transactional
    public Rol actualizarRol(Long id, Rol rolActualizado) {
        Rol rolExistente = rolRepository.findById(id).orElse(null);

        if (rolExistente != null) {
            rolExistente.setNombre(rolActualizado.getNombre());
            rolExistente.setDescripcion(rolActualizado.getDescripcion());
            rolExistente.setTipo(rolActualizado.getTipo());
            return rolRepository.save(rolExistente);
        } else {
            throw new RuntimeException("Rol no encontrado con ID: " + id);
        }
    }

    @Transactional
    public boolean eliminarRol(Long id) {
        Rol rol = rolRepository.findById(id).orElse(null);
        if (rol != null) {
            rol.setActivo(false);
            rolRepository.save(rol);
            return true;
        }else{
            return false;
        }
    }

    public Rol obtenerRolPorNombre(String nombre) {
        return rolRepository.findByNombreIgnoreCase(nombre)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + nombre));
    }

}
