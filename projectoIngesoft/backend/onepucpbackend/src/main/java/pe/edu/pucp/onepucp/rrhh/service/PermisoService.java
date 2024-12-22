package pe.edu.pucp.onepucp.rrhh.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import pe.edu.pucp.onepucp.rrhh.model.Permiso;
import pe.edu.pucp.onepucp.rrhh.repository.PermisoRepository;
import java.util.ArrayList;

@Service
public class PermisoService {
    @Autowired
    private PermisoRepository permisoRepository;

    @Transactional
    public Permiso insertarPermiso(String nombre, String descripcion,byte[] icono){
        Permiso nuevoPermiso = new Permiso();
        nuevoPermiso.setNombre(nombre);
        nuevoPermiso.setDescripcion(descripcion);
        nuevoPermiso.setIcono(icono);
        return permisoRepository.save(nuevoPermiso);
    }

    public ArrayList<Permiso> obtenerTodosLosPermisos() {
        ArrayList<Permiso> permisos = new ArrayList<>();

        for (Permiso permiso : permisoRepository.findAll()) {
                permisos.add(permiso);
        }
        return permisos;
    }

    public ArrayList<Permiso> obtenerPermisosPorRol(String rol) {
        ArrayList<Permiso> permisos = new ArrayList<>();

        for (Permiso permiso : permisoRepository.findAll()) {
                permisos.add(permiso);
        }
        return permisos;
    }
}
