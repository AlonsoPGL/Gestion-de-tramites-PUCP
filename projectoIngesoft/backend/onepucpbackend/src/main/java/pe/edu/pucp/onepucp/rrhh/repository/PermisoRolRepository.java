package pe.edu.pucp.onepucp.rrhh.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.rrhh.model.Permiso;
import pe.edu.pucp.onepucp.rrhh.model.PermisoRol;
import pe.edu.pucp.onepucp.rrhh.model.PermisoRolDTO;

@Repository
public interface PermisoRolRepository extends JpaRepository<PermisoRol, Long> {

    
    @Query("SELECT new pe.edu.pucp.onepucp.rrhh.model.PermisoRolDTO(pr.permiso.id, pr.permiso.nombre, pr.permiso.descripcion, pr.estado) FROM PermisoRol pr WHERE pr.rol.id = :rolId")
    List<PermisoRolDTO> findPermisosConEstadoPorRol(@Param("rolId") Long rolId);


    @Query("SELECT pr FROM PermisoRol pr WHERE pr.permiso.id = :permisoId AND pr.rol.id = :rolId")
    PermisoRol findByPermisoIdAndRolId(@Param("permisoId") Long permisoId, @Param("rolId") Long rolId);

    @Query("SELECT pp.permiso FROM PermisoRol pp WHERE pp.rol.Id = :rolId AND pp.estado = true") 
    List<Permiso> findPermisosActivosPorRol(@Param("rolId") Long rolId);

}
