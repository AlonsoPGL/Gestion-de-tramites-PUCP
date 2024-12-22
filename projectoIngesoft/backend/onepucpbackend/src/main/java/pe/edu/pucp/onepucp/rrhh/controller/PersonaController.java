package pe.edu.pucp.onepucp.rrhh.controller;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;
import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.model.TipoPersona;
import pe.edu.pucp.onepucp.rrhh.service.PersonaService;

@RestController
@RequestMapping("/rrhh/persona")
public class PersonaController {

    // Declaramos el logger
    private static final Logger logger = LoggerFactory.getLogger(PersonaController.class);

    @Autowired
    private PersonaService personaservice;


    // @GetMapping("/verificar")
    // public Optional<Persona> validarCredenciales(@RequestParam String usuario, @RequestParam String contrasenia) {
    //     logger.info("Iniciando verificación de credenciales para el usuario: {}", usuario); // Log de inicio

    //     Optional<Persona> personaOptional = personaservice.buscarPersonaPorUsuario(usuario, contrasenia);

    //     if (personaOptional.isPresent()) {
    //         logger.info("Usuario {} autenticado con éxito", usuario); // Log si las credenciales son correctas
    //         return personaOptional;
    //     } else {
    //         logger.warn("Intento fallido de autenticación para el usuario: {}", usuario); // Log si las credenciales son incorrectas
    //         return Optional.empty();
    //     }
    // }
    @GetMapping("/verificar")
    public Optional<Persona> validarCredenciales(@RequestParam String usuario, @RequestParam String contrasenia) {
        logger.info("Iniciando verificación de credenciales para el usuario: {}", usuario); // Log de inicio

        Optional<Persona> personaOptional = personaservice.buscarPersonaPorCuenta(usuario, contrasenia);

        if (personaOptional.isPresent()) {
            logger.info("Usuario {} autenticado con éxito", usuario); // Log si las credenciales son correctas
            return personaOptional;
        } else {
            logger.warn("Intento fallido de autenticación para el usuario: {}", usuario); // Log si las credenciales son incorrectas
            return Optional.empty();
        }
    }

    @GetMapping("/verificarDTO")
    public Optional<PersonaDTO> validarCredencialesDTO(@RequestParam String usuario, @RequestParam String contrasenia) {
        logger.info("Iniciando verificación de credenciales para el usuario: {}", usuario);
        Optional<PersonaDTO> personaDTOOptional = personaservice.buscarPersonaPorCuentaDTO(usuario, contrasenia);

        if (personaDTOOptional.isPresent()) {
            logger.info("Usuario {} autenticado con éxito", usuario);
            return personaDTOOptional;
        } else {
            logger.warn("Intento fallido de autenticación para el usuario: {}", usuario);
            return Optional.empty();
        }
    }

    @GetMapping("/rol/{id}")
    public Optional<Rol> obtenerRolPorIdPersona(@PathVariable Long id) {
        logger.info("Obteniendo rol para la persona con id: {}", id);

        Optional<Rol> rolOptional = personaservice.buscarRolPorIdPersona(id);

        if (rolOptional.isPresent()) {
            logger.info("Rol encontrado: {}", rolOptional.get().getNombre()); // Log si el rol fue encontrado
            return rolOptional;
        } else {
            logger.warn("No se encontró un rol para la persona con id: {}", id); // Log si el rol no fue encontrado
            return Optional.empty();
        }
    }

    @GetMapping("/verificarCodigo")
    public boolean verificarCodigo(@RequestParam int codigo) {
        return personaservice.existeCodigo(codigo);
    }

    @GetMapping("/verificarUsuario")
    public boolean verificarUsuario(@RequestParam String usuario) {
        return personaservice.existeUsuario(usuario);
    }

    @GetMapping("/verificarCorreo")
    public boolean verificarCorreo(@RequestParam String email) {
        return personaservice.existeCorreo(email);
    }

    
    @Transactional
    @PostMapping("/insertar")
    public Persona insertarCliente(@RequestBody Persona persona) {
        logger.info("Iniciando inserción de persona: {} {}", persona.getNombre(), persona.getApellidoPaterno());

        Persona nuevaPersona = personaservice.insertarPersona(
                persona.getCodigo(),persona.getNombre(), persona.getApellidoPaterno(), persona.getApellidoMaterno(),
                persona.getCuenta().getUsuario(), persona.getCuenta().getContrasenia(),
                persona.getTipo(), persona.getEmail());

        logger.info("Persona insertada con éxito: {}", nuevaPersona.getId()); // Log de éxito

        // Llena la tabla persona_x_rol con todos los roles en false
        //personaservice.asignarRolesPorDefecto(nuevaPersona);

        return nuevaPersona;


    }

    @GetMapping("/listar")
    public ResponseEntity<Page<PersonaDTO>> listarPersona(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        logger.info("Listando todas las personas activas en la página: {}, tamaño: {}", page, size);

        // Crear un Pageable que ordene por ID de mayor a menor
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Persona> personasPage = personaservice.obtenerPersonasPaginadas(pageable);

        logger.info("Se encontraron {} personas activas", personasPage.getTotalElements());

        // Convertir la página de Personas a una página de PersonaDTO
        Page<PersonaDTO> personaDTOPage = personasPage.map(persona -> convertirAPersonaDTO(persona));

        return ResponseEntity.ok(personaDTOPage);
    }
    @GetMapping("/listarfiltrado")
    public ResponseEntity<Page<PersonaDTO>> listarPersona(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) TipoPersona tipoPersona,
            @RequestParam(required = false) Long especialidadId,
            @RequestParam(required = false) Long unidadId) {
        
        logger.info("Listando personas con filtros - página: {}, tamaño: {}, tipo: {}, especialidadId: {}, unidadId: {}", 
            page, size, tipoPersona, especialidadId, unidadId);

        // Obtener todas las personas paginadas y convertir a DTO
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Persona> personasPage = personaservice.obtenerPersonasPaginadas(pageable);
        Page<PersonaDTO> personaDTOPage = personasPage.map(persona -> convertirAPersonaDTO(persona));

        // Aplicar filtros sobre la lista de DTOs
        List<PersonaDTO> personasDTOFiltradas = personaDTOPage.getContent().stream()
            .filter(personaDTO -> {
                // Filtro por tipo de persona
                if (tipoPersona != null && !personaDTO.getTipo().equals(tipoPersona)) {
                    return false;
                }
                
                // Filtro por especialidad
                if (especialidadId != null && 
                    (personaDTO.getEspecialidad() == null || 
                    !personaDTO.getEspecialidad().getId().equals(especialidadId))) {
                    return false;
                }
                
                // Filtro por unidad
                if (unidadId != null && 
                    (personaDTO.getUnidad() == null || 
                    !personaDTO.getUnidad().getId().equals(unidadId))) {
                    return false;
                }
                
                return true;
            })
            .collect(Collectors.toList());

        // Crear una nueva página con los resultados filtrados
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), personasDTOFiltradas.size());
        
        Page<PersonaDTO> resultadoFiltrado = new PageImpl<>(
            personasDTOFiltradas.subList(start, end),
            pageable,
            personasDTOFiltradas.size()
        );

        logger.info("Se encontraron {} personas que cumplen con los filtros", personasDTOFiltradas.size());

        return ResponseEntity.ok(resultadoFiltrado);
    }
    private EspecialidadDTO convertirAEspecialidadDTO(Especialidad especialidad) {
    if (especialidad == null) {
        return null;
    }
    // Supongamos que EspecialidadDTO tiene un constructor que acepta los campos de Especialidad
    return new EspecialidadDTO(especialidad.getId(), especialidad.getNombre());
}
    // Método para convertir Persona a PersonaDTO
    private PersonaDTO convertirAPersonaDTO(Persona persona) {
        // Aquí se asume que las entidades Persona y UnidadDTO ya están relacionadas correctamente
        return new PersonaDTO(
                persona.getId(),
                persona.getNombre(),
                convertirAEspecialidadDTO(persona.getEspecialidad()),
                persona.getApellidoPaterno(),
                persona.getApellidoMaterno(),
                persona.getEmail(),
                persona.getCodigo(),
                persona.getTipo(),
                persona.getCuenta()

        );
    }

    @DeleteMapping("/eliminar/{id}")
    public String eliminarPersona(@PathVariable Long id) {
        logger.info("Iniciando eliminación de persona con id: {}", id);

        boolean eliminado = personaservice.eliminarPersona(id);
        if (eliminado) {
            logger.info("Persona con id {} eliminada con éxito", id);
            return "Persona eliminada con éxito";
        } else {
            logger.error("Error al eliminar la persona con id {}", id); // Log de error
            return "Error al eliminar la persona o no existe";
        }
    }

    @PutMapping("/actualizar/{id}")
    public Persona actualizarPersona(@PathVariable Long id, @RequestBody Persona personaActualizada) {
        logger.info("Iniciando actualización de persona con id: {}", id);

        Persona persona = personaservice.actualizarPersona(id, personaActualizada);

        if (persona != null) {
            logger.info("Persona con id {} actualizada con éxito", id);
        } else {
            logger.error("Error al actualizar la persona con id {}", id); // Log de error si falla
        }
        return persona;
    }

    @PutMapping("/actualizarRol/{id}")
    public Persona actualizarRol(@PathVariable Long id, @RequestBody Rol nuevoRol) {
        logger.info("Actualizando rol para la persona con id: {}", id);

        Persona personaActualizada = personaservice.actualizarRol(id, nuevoRol);

        if (personaActualizada != null) {
            logger.info("Rol actualizado para la persona con id {}", id);
        } else {
            logger.error("Error al actualizar el rol para la persona con id {}", id);
        }
        return personaActualizada;
    }


    @PostMapping("/insertarCSV")
    public List<Persona> insertarPersonasCsv(@RequestBody List<Persona> personas) {
        logger.info("Iniciando inserción de múltiples personas: {}", personas.size());

        List<Persona> personasInsertadas = new ArrayList<>();

        for (Persona persona : personas) {
            logger.info("Insertando persona: {} {}", persona.getNombre(), persona.getApellidoPaterno());

            Persona nuevaPersona = personaservice.insertarPersona(
                    persona.getCodigo(),persona.getNombre(), persona.getApellidoPaterno(), persona.getApellidoMaterno(),
                    persona.getCuenta().getUsuario(), persona.getCuenta().getContrasenia(),
                    persona.getTipo(), persona.getEmail());


            personasInsertadas.add(nuevaPersona);
            logger.info("Persona insertada con éxito: {}", nuevaPersona.getId());
        }

        return personasInsertadas;
    }


    @GetMapping("/existePorCorreo")
    public ResponseEntity<Boolean> existePersonaPorCorreo(@RequestParam String correo) {
        logger.info("Inicio de verificación de existencia por correo: {}", correo);

        try {
            boolean existe = personaservice.existePorCorreo(correo);
            logger.info("Verificación completada para el correo: {}. Resultado: {}", correo, existe);
            return ResponseEntity.ok(existe);
        } catch (IllegalArgumentException e) {
            logger.warn("Excepción controlada al verificar el correo: {}. Detalle: {}", correo, e.getMessage());
            return ResponseEntity.badRequest().body(false);
        } catch (Exception e) {
            logger.error("Error inesperado al verificar el correo: {}", correo, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}