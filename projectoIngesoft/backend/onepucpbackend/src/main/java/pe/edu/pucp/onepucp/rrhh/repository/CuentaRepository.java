package pe.edu.pucp.onepucp.rrhh.repository;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import pe.edu.pucp.onepucp.rrhh.model.Cuenta;

@Repository
public interface CuentaRepository extends CrudRepository<Cuenta,Long>{
    Optional<Cuenta> findByUsuario(String usuario);
}
