package pe.edu.pucp.onepucp.rrhh.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.rrhh.model.Permiso;

@Repository
public interface PermisoRepository extends CrudRepository<Permiso, Long>{
    
}
