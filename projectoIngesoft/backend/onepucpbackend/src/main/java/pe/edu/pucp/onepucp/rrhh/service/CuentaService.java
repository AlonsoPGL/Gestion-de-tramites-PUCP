package pe.edu.pucp.onepucp.rrhh.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import pe.edu.pucp.onepucp.rrhh.model.Cuenta;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.repository.CuentaRepository;

@Service
public class CuentaService {
    
    @Autowired
    private CuentaRepository repository;
/* 
    @Transactional
    public Optional<Persona> buscarPersonaPorUsuario(String usuario) {
    Optional<Cuenta> cuentaOptional = repository.findByUsuario(usuario);
        return cuentaOptional.map(Cuenta::getPersona); // Obtiene la persona asociada si la cuenta existe
    }*/

    public boolean eliminarCuenta(Long id) {
        Optional<Cuenta> cuentaOptional = repository.findById(id);
        if (cuentaOptional.isPresent()) {
            Cuenta cuenta = cuentaOptional.get();
            cuenta.setActivo(false); // Cambiar el estado a "false" para indicar que está eliminada
            repository.save(cuenta);
            return true;
        } else {
            return false;
        }
    }
}
