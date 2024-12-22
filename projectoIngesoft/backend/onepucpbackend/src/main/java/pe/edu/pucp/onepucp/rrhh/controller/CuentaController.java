package pe.edu.pucp.onepucp.rrhh.controller;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.pucp.onepucp.rrhh.model.Cuenta;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.repository.CuentaRepository;
import pe.edu.pucp.onepucp.rrhh.service.CuentaService;

import java.util.List; // Import correcto de List


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Optional;
@RestController
@RequestMapping("/aaaaaaaaaaa")
public class CuentaController {

    @Autowired
    CuentaService cuentaservice;
/* 
    @GetMapping("/verificar")
    public Optional<Persona> validarCredenciales(@RequestParam String usuario, @RequestParam String contrasenia) {
        // Buscamos todas las cuentas en la base de datos
        Optional<Persona> personaOptional = cuentaService.buscarPersonaPorUsuario(usuario);

    if (personaOptional.isPresent() && personaOptional.get().getCuenta().getContrasenia().equals(contrasenia)) {
        return personaOptional.get(); // Retorna la persona si el login es exitoso
    }   

        return null; // Credenciales incorrectas
    }
    */
}

