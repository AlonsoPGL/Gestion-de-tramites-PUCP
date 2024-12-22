package pe.edu.pucp.onepucp.rrhh.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.dto.UnidadDTO;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.repository.EspecialidadRepository;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.model.Cuenta;
import pe.edu.pucp.onepucp.rrhh.model.Docente;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.PersonaRolUnidad;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.model.TipoPersona;
import pe.edu.pucp.onepucp.rrhh.repository.PermisoRepository;
import pe.edu.pucp.onepucp.rrhh.repository.PersonaRepository;
import pe.edu.pucp.onepucp.rrhh.repository.PersonaRolUnidadRepository;
import pe.edu.pucp.onepucp.rrhh.repository.RolRepository;

@Service
public class PersonaService {
    @Autowired
    private PersonaRepository repository;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private PersonaRolUnidadRepository PersonaRolRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PermisoRepository permisoRepository;
    private ModelMapper modelMapper;
    @Autowired
    private CuentaService cuentaervice;
    private static final Logger logger = LoggerFactory.getLogger(PersonaService.class);

    @Transactional
    public Optional<Persona> buscarPersonaPorCuenta(String usuario, String contrasenia) {
        Optional<Persona> persOptional = repository.findByCuentaUsuarioAndCuentaContrasenia(usuario, contrasenia);
    
        if (persOptional.isPresent()) {
            Persona persona = persOptional.get();
    
            // Verificar si la persona está activa
            if (persona.isActivo()) {
                return Optional.of(persona); // Si está activa, retorna la persona original
            } else {
                // Si no está activa, retorna una nueva con ID = 0
                Persona personaInactiva = new Persona();
                personaInactiva.setId(0L);
                return Optional.of(personaInactiva);
            }
        }
        Persona personaNoExistente = new Persona();
        personaNoExistente.setId(0L);
        return Optional.of(personaNoExistente); // Retorna vacío si no se encuentra la persona
    }
    
    public PersonaDTO mapToDTO(Persona persona) {
        if (persona == null) return null;
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
    private EspecialidadDTO convertirAEspecialidadDTO(Especialidad especialidad) {
        if (especialidad == null) {
            return null;
        }
        // Supongamos que EspecialidadDTO tiene un constructor que acepta los campos de Especialidad
        return new EspecialidadDTO(especialidad.getId(), especialidad.getNombre());
    }
    @Transactional
    public Optional<PersonaDTO> buscarPersonaPorCuentaDTO(String usuario, String contrasenia) {
        Optional<Persona> persOptional = repository.findByCuentaUsuarioAndCuentaContrasenia(usuario, contrasenia);
        
        if (persOptional.isPresent()) {
            Persona persona = persOptional.get();
            if (persona.isActivo()) {
                return Optional.of(mapToDTO(persona));
            } else {
                Persona personaInactiva = new Persona();
                personaInactiva.setId(0L);
                return Optional.of(mapToDTO(personaInactiva));
            }
        }
        Persona personaNoExistente = new Persona();
        personaNoExistente.setId(0L);
        return Optional.of(mapToDTO(personaNoExistente));
    }

    @Transactional
    public boolean existeUsuario(String usuario) {
        return repository.existsByCuenta_UsuarioAndCuentaActivoTrue(usuario);
    }
    
    @Transactional
    public boolean existeCodigo(int codigo) {
        return repository.existsByCodigoAndActivoTrueAndCuentaActivoTrue(codigo);
    }

    @Transactional
    public boolean existeCorreo(String email) {
        return repository.existsByEmailAndActivoTrueAndCuentaActivoTrue(email);
    }

    public Optional<PersonaDTO> buscarPersonaDTOPorUsuario(String  usuario,String contrasenia){
        Optional<Persona> personaOptional = buscarPersonaPorCuenta(usuario, contrasenia);
        //Optional<Unidad> unidadOptional = 
        if (personaOptional.isPresent()) {
            Persona persona = personaOptional.get();
            PersonaDTO personaDTO = new PersonaDTO();
            personaDTO.setId(persona.getId());
            personaDTO.setNombre(persona.getNombre());
            personaDTO.setApellidoPaterno(persona.getApellidoPaterno());
            personaDTO.setApellidoMaterno(persona.getApellidoMaterno());
            personaDTO.setEmail(persona.getEmail());
            personaDTO.setCodigo(persona.getCodigo());
            personaDTO.setActivo(persona.isActivo());
            personaDTO.setTipo(persona.getTipo());  
             
        
            personaDTO.setCuenta(persona.getCuenta());
            if(persona.getTipo() == TipoPersona.ALUMNO){
               Alumno alumno = (Alumno) persona;

               UnidadDTO unidadDTO = new UnidadDTO();
               
                unidadDTO.setId(alumno.getFacultad().getId());
                unidadDTO.setNombre(alumno.getFacultad().getNombre());
                unidadDTO.setDireccionWeb(alumno.getFacultad().getDireccionWeb());
                unidadDTO.setCorreoContacto(alumno.getFacultad().getCorreoContacto());
                unidadDTO.setTelefonoContacto(alumno.getFacultad().getTelefonoContacto());
                unidadDTO.setCodigo(alumno.getFacultad().getCodigo());
                //unidadDTO.setActivo(alumno.getFacultad().isActivo());
                personaDTO.setUnidad(unidadDTO);
            }
            else{
                
            }
            
            return Optional.of(personaDTO);
        }
        return Optional.empty();
    }
    @Transactional
    public Persona insertarPersona(int codigo,String nombre, String apellidoPaterno,String apellidoMaterno, String usuario, String contrasenia,TipoPersona tipo,String email) {
        // Crea una nueva instancia de Persona
        Persona nuevaPersona;
        nuevaPersona = switch (tipo) {
            case ALUMNO -> new Alumno();
            case DOCENTE -> new Docente();
            default -> new Persona();
        };
        nuevaPersona.setCodigo(codigo);
        nuevaPersona.setNombre(nombre);
        nuevaPersona.setApellidoPaterno(apellidoPaterno);
        nuevaPersona.setApellidoMaterno(apellidoMaterno);
        nuevaPersona.setTipo(tipo);
        nuevaPersona.setEmail(email);
        nuevaPersona.setActivo(true);
        // Aquí se asume que el modelo Persona tiene una relación con Cuenta
        Cuenta nuevaCuenta = new Cuenta();
        nuevaCuenta.setUsuario(usuario);
        nuevaCuenta.setContrasenia(contrasenia);
        nuevaCuenta.setActivo(true);
        // Asocia la cuenta a la persona (esto depende de cómo esté modelada tu relación)
        nuevaPersona.setCuenta(nuevaCuenta);
        
        

        // IMPORTANTE FALTA: VALIDAR EL TIPO Y HACER REGISTRO EN LOS HIJOS;
        return repository.save(nuevaPersona);
    }


    public ArrayList<Persona> obtenerTodasLasPersonas() {
        ArrayList<Persona> personasActivas = new ArrayList<>();

        for (Persona persona : repository.findAll()) {
            if (persona.isActivo()) { // Suponiendo que tienes un

                personasActivas.add(persona);
            }
        }

        return personasActivas;

    }

    public boolean eliminarPersona(Long id) {
        Optional<Persona> personaOptional = repository.findById(id);
        if (personaOptional.isPresent()) {
            Persona persona = personaOptional.get();
            persona.setActivo(false); // Cambiar el estado a "false" para indicar que está eliminada
            cuentaervice.eliminarCuenta(persona.getCuenta().getId()); // se elimina tambien la cuenta del usuario
            repository.save(persona);
            return true;
        } else {
            return false;
        }
    }

    public Persona actualizarPersona(Long id, Persona personaActualizada) {
        Optional<Persona> personaOptional = repository.findById(id);
        if (personaOptional.isPresent()) {
            Persona personaExistente = personaOptional.get();
            personaExistente.setCodigo(personaActualizada.getCodigo());
            personaExistente.setNombre(personaActualizada.getNombre());
            personaExistente.setApellidoMaterno(personaActualizada.getApellidoMaterno());
            personaExistente.setApellidoPaterno(personaActualizada.getApellidoPaterno());
            personaExistente.setTipo(personaActualizada.getTipo());
            personaExistente.setEspecialidad(personaActualizada.getEspecialidad());
            personaExistente.setCuenta(personaActualizada.getCuenta());
            personaExistente.setEmail(personaActualizada.getEmail());
            return repository.save(personaExistente);
        } else {
            return null;
        }
    }
    public int generarCodigoUsuario() {
        Random random = new Random();
        // Genera número de 6 dígitos
        return 100000 + random.nextInt(900000);
    }


    public int generarCodigoUnico() {
        int codigo;
        do {
            codigo = generarCodigoUsuario();
        } while (repository.existsByCodigo(codigo)); // Repite hasta encontrar un código único
        return codigo;
    }

    public Persona actualizarRol(Long personaId, Long rolId) {
        Optional<Persona> personaOptional = repository.findById(personaId);
        
        if (personaOptional.isPresent()) {
            Persona persona = personaOptional.get();
            Rol rol = rolRepository.findById(rolId).orElse(null);
            //persona.setRol(rol); // Asigna el nuevo rol
            return repository.save(persona); // Guarda la persona actualizada
        }
        return null; // Maneja el caso cuando la persona no existe
    }


    public Persona actualizarRol(Long id, Rol nuevoRol) {
        Optional<Persona> personaOptional = repository.findById(id);
        
        if (personaOptional.isPresent()) {
            Persona persona = personaOptional.get();
            //persona.setRol(nuevoRol); // Establece el nuevo rol
            return repository.save(persona); // Guarda la persona actualizada
        }
        return null; // Retorna null si no se encontró la persona
    }

    public Optional<Persona> buscarPersonaPorId(Long id) {
        return repository.findById(id); // Suponiendo que tienes un repositorio que extiende JpaRepository
    }
    
    public Optional<Rol> buscarRolPorIdPersona(Long id) {
        // Suponiendo que tienes un método para obtener a la persona
        Optional<Persona> personaOptional = repository.findById(id);
        
        if (personaOptional.isPresent()) {
           //return Optional.of(personaOptional.get().getRol()); // Asumiendo que la persona tiene un método getRol()
        }
        
        return Optional.empty();
    }
    
 
    public void asignarRolesPorDefecto(Persona persona) {

        List<PersonaRolUnidad> rolesPersona = new ArrayList<>();
        for (Rol permiso : rolRepository.findAll()) {
            PersonaRolUnidad personaRol = new PersonaRolUnidad();
            personaRol.setPersona(persona);
            personaRol.setRol(permiso);
            personaRol.setEstado(false);
            rolesPersona.add(personaRol);
        }
        PersonaRolRepository.saveAll(rolesPersona);
    }

    public Page<Persona> obtenerPersonasPaginadas(Pageable pageable) {
        return repository.findAllActiveOrderedByIdDesc(pageable); // Solo lista las personas activas y ordenadas
    }

    public Long obtenerIdPersonaPorCodigo(int codigo) { 
    
        // Verificar si el código es válido
        if (codigo == 0) {
            logger.warn("El código proporcionado es nulo o vacío.");
            return null; // O 0L si prefieres un valor por defecto
        }
    
        try {
            // Supongamos que el repositorio tiene un método findIdByCodigoAndActivoTrue
            List <Long> idPersona = repository.findIdByCodigoAndActivoTrue(codigo);
            //REtorna el primer id encontrado
            return idPersona.get(0);
        } catch (EntityNotFoundException e) {
            // Excepción específica para cuando no se encuentra la entidad
            logger.error("No se encontró un registro con el código: {}", codigo, e);
        } catch (DataAccessException e) {
            // Error relacionado con la base de datos
            logger.error("Error al acceder a la base de datos para el código {}: {}", codigo, e.getMessage(), e);
        } catch (Exception e) {
            // Captura de excepciones generales
            logger.error("Se produjo un error inesperado para el código {}: {}", codigo, e.getMessage(), e);
        }
        return null; // Valor por defecto en caso de error
    }
    //!SPECIALIDAD
    public EspecialidadDTO asignarEspecialidad(Long personaId, Long especialidadId) {
        try {
            modelMapper = new ModelMapper();
            logger.info("Iniciando asignación de especialidad {} a persona {}", especialidadId, personaId);
            
            Persona persona = repository.findByIdOrThrow(personaId);
            logger.debug("Persona encontrada: {}", persona.getNombre());
            
            Especialidad especialidad = especialidadRepository.findById(especialidadId)
                .orElseThrow(() -> new IllegalArgumentException("Especialidad no encontrada con ID: " + especialidadId));
            logger.debug("Especialidad encontrada: {}", especialidad.getNombre());
            
            persona.setEspecialidad(especialidad);
            repository.save(persona);
            
            logger.info("Especialidad asignada exitosamente a la persona {}", personaId);
            return modelMapper.map(especialidad, EspecialidadDTO.class);
            
        } catch (IllegalArgumentException e) {
            logger.error("Error al asignar especialidad: {}", e.getMessage());
            throw new RuntimeException("Error al asignar especialidad: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error inesperado al asignar especialidad: {}", e.getMessage(), e);
            throw new RuntimeException("Error inesperado al asignar especialidad", e);
        }
    }

    public EspecialidadDTO actualizarEspecialidad(Long personaId, Long nuevoEspecialidadId) {
        try {
            modelMapper = new ModelMapper();
            logger.info("Iniciando actualización de especialidad para persona {}", personaId);
            
            Persona persona = repository.findByIdOrThrow(personaId);
            logger.debug("Persona encontrada: {}", persona.getNombre());
            
            Especialidad nuevaEspecialidad = especialidadRepository.findById(nuevoEspecialidadId)
                .orElseThrow(() -> new IllegalArgumentException("Especialidad no encontrada con ID: " + nuevoEspecialidadId));
            logger.debug("Nueva especialidad encontrada: {}", nuevaEspecialidad.getNombre());
            
            Especialidad especialidadAnterior = persona.getEspecialidad();
            persona.setEspecialidad(nuevaEspecialidad);
            repository.save(persona);
            
            logger.info("Especialidad actualizada exitosamente para la persona {}. Anterior: {}, Nueva: {}", 
                personaId, 
                especialidadAnterior != null ? especialidadAnterior.getNombre() : "Sin especialidad",
                nuevaEspecialidad.getNombre());
                
            return modelMapper.map(nuevaEspecialidad, EspecialidadDTO.class);
            
        } catch (IllegalArgumentException e) {
            logger.error("Error al actualizar especialidad: {}", e.getMessage());
            throw new RuntimeException("Error al actualizar especialidad: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error inesperado al actualizar especialidad: {}", e.getMessage(), e);
            throw new RuntimeException("Error inesperado al actualizar especialidad", e);
        }
    }

    public void removerEspecialidad(Long personaId) {
        try {
            modelMapper = new ModelMapper();
            logger.info("Iniciando remoción de especialidad para persona {}", personaId);
            
            Persona persona = repository.findByIdOrThrow(personaId);
            logger.debug("Persona encontrada: {}", persona.getNombre());
            
            Especialidad especialidadAnterior = persona.getEspecialidad();
            if (especialidadAnterior != null) {
                logger.debug("Removiendo especialidad: {}", especialidadAnterior.getNombre());
                persona.setEspecialidad(null);
                repository.save(persona);
                logger.info("Especialidad removida exitosamente de la persona {}", personaId);
            } else {
                logger.info("La persona {} no tenía especialidad asignada", personaId);
            }
            
        } catch (IllegalArgumentException e) {
            logger.error("Error al remover especialidad: {}", e.getMessage());
            throw new RuntimeException("Error al remover especialidad: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error inesperado al remover especialidad: {}", e.getMessage(), e);
            throw new RuntimeException("Error inesperado al remover especialidad", e);
        }
    }
    
    public boolean existePorCorreo(String correo) {
        try {
            boolean existe = repository.existsByEmailAndActivoTrue(correo);
            if (existe) {
                logger.info("Ya existe una persona activa con el correo: {}", correo);
            } else {
                logger.info("No existe una persona activa con el correo: {}", correo);
            }
            return existe;
        } catch (Exception e) {
            logger.error("Error inesperado al verificar la existencia del correo: {}", correo, e);
            return false; // Devuelve false si ocurre un error inesperado
        }
    }
}
