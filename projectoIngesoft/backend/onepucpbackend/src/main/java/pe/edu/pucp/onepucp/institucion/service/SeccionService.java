package pe.edu.pucp.onepucp.institucion.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pe.edu.pucp.onepucp.institucion.dto.DepartamentoDTO;
import pe.edu.pucp.onepucp.institucion.dto.SeccionDTO;
import pe.edu.pucp.onepucp.institucion.dto.SeccionDTOInsersion;
import pe.edu.pucp.onepucp.institucion.model.Departamento;
import pe.edu.pucp.onepucp.institucion.model.Seccion;
import pe.edu.pucp.onepucp.institucion.model.TipoUnidad;
import pe.edu.pucp.onepucp.institucion.repository.SeccionRepository;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.PersonaRolUnidad;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.service.PersonaRolUnidadService;
import pe.edu.pucp.onepucp.rrhh.service.RolService;

@Service
public class SeccionService {

    private static final Logger logger = LoggerFactory.getLogger(SeccionService.class); // Logger

    @Autowired
    private SeccionRepository repository;

    @Autowired
    private RolService rolService;

    @Autowired
    private PersonaRolUnidadService personaRolUnidadService;


    private ModelMapper modelMapper;
    
    //!REGISTRAR
    @Transactional
    public SeccionDTO insertarSeccion(SeccionDTO seccionDTO) {
        try {
            logger.info("Iniciando inserción de una nueva sección...");
            
            // Crear nueva entidad Seccion y mapear manualmente
            Seccion seccion = new Seccion();
            
            // Mapear atributos heredados de Unidad
            seccion.setId(seccionDTO.getId());
            seccion.setCodigo(seccionDTO.getCodigo());
            seccion.setNombre(seccionDTO.getNombre());
            seccion.setTelefonoContacto(seccionDTO.getTelefonoContacto());
            seccion.setCorreoContacto(seccionDTO.getCorreoContacto());
            seccion.setDireccionWeb(seccionDTO.getDireccionWeb());
            
            // Establecer valores por defecto
            seccion.setActivo(true);
            seccion.setTipo(TipoUnidad.SECCION);
    
            // Mapear departamento si existe
            if (seccionDTO.getDepartamento() != null) {
                Departamento departamento = new Departamento();
                departamento.setId(seccionDTO.getDepartamento().getId());
                // Solo necesitamos el ID para la relación
                seccion.setDepartamento(departamento);
            }
    
            // Mapear jefe si existe
            if (seccionDTO.getJefe() != null) {
                Persona jefe = new Persona();
                PersonaDTO jefeDTO = seccionDTO.getJefe();
                jefe.setId(jefeDTO.getId());
                // Solo necesitamos el ID para la relación
                seccion.setJefe(jefe);
            }
    
            // Mapear asistente si existe
            if (seccionDTO.getAsistente() != null) {
                Persona asistente = new Persona();
                PersonaDTO asistenteDTO = seccionDTO.getAsistente();
                asistente.setId(asistenteDTO.getId());
                // Solo necesitamos el ID para la relación
                seccion.setAsistente(asistente);
            }
    
            // Guardar la sección
            seccion = repository.save(seccion);
            
            // Asignar roles
            asignarRolAlJefeDeSeccion(seccion);
            asignarAsistenteDeSeccion(seccion);
    
            // Crear DTO de respuesta
            SeccionDTO seccionRespuesta = new SeccionDTO();
            
            // Mapear atributos de la respuesta
            seccionRespuesta.setId(seccion.getId());
            seccionRespuesta.setCodigo(seccion.getCodigo());
            seccionRespuesta.setNombre(seccion.getNombre());
            seccionRespuesta.setTelefonoContacto(seccion.getTelefonoContacto());
            seccionRespuesta.setCorreoContacto(seccion.getCorreoContacto());
            seccionRespuesta.setDireccionWeb(seccion.getDireccionWeb());
            seccionRespuesta.setTipo(seccion.getTipo());
            seccionRespuesta.setActivo(seccion.isActivo());
            
            // Mapear relaciones en la respuesta si existen
            if (seccion.getDepartamento() != null) {
                DepartamentoDTO depDTO = new DepartamentoDTO();
                depDTO.setId(seccion.getDepartamento().getId());
                depDTO.setNombre(seccion.getDepartamento().getNombre());
                seccionRespuesta.setDepartamento(depDTO);
            }
    
            if (seccion.getJefe() != null) {
                PersonaDTO jefeDTO = new PersonaDTO();
                jefeDTO.setId(seccion.getJefe().getId());
                jefeDTO.setNombre(seccion.getJefe().getNombre());
                seccionRespuesta.setJefe(jefeDTO);
            }
    
            if (seccion.getAsistente() != null) {
                PersonaDTO asistenteDTO = new PersonaDTO();
                asistenteDTO.setId(seccion.getAsistente().getId());
                asistenteDTO.setNombre(seccion.getAsistente().getNombre());
                seccionRespuesta.setAsistente(asistenteDTO);
            }
    
            logger.info("Sección insertada con éxito: {}", seccionRespuesta.getCodigo());
            return seccionRespuesta;
            
        } catch (Exception e) {
            logger.error("Error al insertar la sección: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    public void asignarRolAlJefeDeSeccion(Seccion seccion){
        if (seccion.getJefe() != null) {
            Rol JefeSeccionRol = rolService.obtenerRolPorNombre("COORDINADOR DE SECCIÓN");
            Persona persona = seccion.getJefe();

            // Crear la entidad PersonaRolUnidad
            PersonaRolUnidad personaRolUnidad = new PersonaRolUnidad();
            personaRolUnidad.setPersona(persona);
            personaRolUnidad.setRol(JefeSeccionRol);
            personaRolUnidad.setUnidad(seccion);
            personaRolUnidad.setEstado(true); // Estado activo

            // Guardar en la base de datos
            personaRolUnidadService.insertar(personaRolUnidad);
        }
    }

    public void asignarAsistenteDeSeccion(Seccion seccion){
        if (seccion.getAsistente() != null) {
            Rol asistenteSeccionRol = rolService.obtenerRolPorNombre("ASISTENTE DE LA SECCION");
            Persona persona = seccion.getAsistente();

            // Crear la entidad PersonaRolUnidad
            PersonaRolUnidad personaRolUnidad = new PersonaRolUnidad();
            personaRolUnidad.setPersona(persona);
            personaRolUnidad.setRol(asistenteSeccionRol);
            personaRolUnidad.setUnidad(seccion);
            personaRolUnidad.setEstado(true); // Estado activo

            // Guardar en la base de datos
            personaRolUnidadService.insertar(personaRolUnidad);
        }
    }
    //!LISTAR TODOS
    public ArrayList<Seccion> obtenerTodosLosSeccions() {
        try {
            logger.info("Obteniendo todas las secciones activas...");
            ArrayList<Seccion> seccionsActivos = new ArrayList<>();
            for (Seccion seccion : repository.findAll()) {
                if (seccion.isActivo()) {
                    seccionsActivos.add(seccion);
                }
            }
            logger.info("Se han listado {} secciones activas.", seccionsActivos.size()); // Log
            return seccionsActivos;
        } catch (Exception e) {
            logger.error("Error al obtener todas las secciones: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    //? LISTAR DTO
public List<SeccionDTO> obtenerTodasLasSeccionesDTO() {
    try {
        logger.info("Obteniendo todas las secciones activas como DTO...");
        List<Seccion> secciones = repository.findAllByActivoTrue();
        
        List<SeccionDTO> seccionesDTO = secciones.stream()
                .map(seccion -> {
                    // Crear nuevo DTO de Sección
                    SeccionDTO dto = new SeccionDTO();
                    
                    // Mapear atributos heredados de UnidadDTO
                    dto.setId(seccion.getId());
                    dto.setCodigo(seccion.getCodigo());
                    dto.setNombre(seccion.getNombre());
                    dto.setTelefonoContacto(seccion.getTelefonoContacto());
                    dto.setCorreoContacto(seccion.getCorreoContacto());
                    dto.setDireccionWeb(seccion.getDireccionWeb());
                    dto.setTipo(seccion.getTipo());
                    
                    // Mapear atributos propios de SeccionDTO
                    dto.setActivo(seccion.isActivo());
                    
                    // Mapear Departamento si existe
                    if (seccion.getDepartamento() != null) {
                        DepartamentoDTO depDTO = new DepartamentoDTO();
                        Departamento dep = seccion.getDepartamento();
                        depDTO.setId(dep.getId());
                        depDTO.setCodigo(dep.getCodigo());
                        depDTO.setNombre(dep.getNombre());
                        depDTO.setActivo(dep.isActivo());
                        dto.setDepartamento(depDTO);
                    }
                    
                    // Mapear Jefe si existe
                    if (seccion.getJefe() != null) {
                        PersonaDTO jefeDTO = new PersonaDTO();
                        Persona jefe = seccion.getJefe();
                        jefeDTO.setId(jefe.getId());
                        jefeDTO.setNombre(jefe.getNombre());
                        jefeDTO.setApellidoPaterno(jefe.getApellidoPaterno());
                        jefeDTO.setApellidoMaterno(jefe.getApellidoMaterno());
                        jefeDTO.setEmail(jefe.getEmail());
                        jefeDTO.setCodigo(jefe.getCodigo());
                        jefeDTO.setActivo(jefe.isActivo());
                        jefeDTO.setTipo(jefe.getTipo());
                        dto.setJefe(jefeDTO);
                    }
                    
                    // Mapear Asistente si existe
                    if (seccion.getAsistente() != null) {
                        PersonaDTO asistenteDTO = new PersonaDTO();
                        Persona asistente = seccion.getAsistente();
                        asistenteDTO.setId(asistente.getId());
                        asistenteDTO.setNombre(asistente.getNombre());
                        asistenteDTO.setApellidoPaterno(asistente.getApellidoPaterno());
                        asistenteDTO.setApellidoMaterno(asistente.getApellidoMaterno());
                        asistenteDTO.setEmail(asistente.getEmail());
                        asistenteDTO.setCodigo(asistente.getCodigo());
                        asistenteDTO.setActivo(asistente.isActivo());
                        asistenteDTO.setTipo(asistente.getTipo());
                        dto.setAsistente(asistenteDTO);
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());

        logger.info("Se han listado {} secciones activas como DTOs.", seccionesDTO.size());
        return seccionesDTO;
        
    } catch (Exception e) {
        logger.error("Error al obtener secciones activas como DTO: {}", e.getMessage(), e);
        throw e;
    }
}
    
    //?LISTAR INDEXADO
    public Page<SeccionDTO> obtenerSeccionesDTOPaginadas(Pageable pageable) {
        try {
            logger.info("Obteniendo secciones activas paginadas. Página: {}", pageable.getPageNumber());
            modelMapper = new ModelMapper();
            Page<Seccion> seccionesPage = repository.findAllActiveOrderedByIdDesc(pageable);
            logger.info("Se han encontrado {} secciones activas en la página {}", seccionesPage.getTotalElements(), pageable.getPageNumber()); // Log
            return seccionesPage.map(seccion -> modelMapper.map(seccion, SeccionDTO.class));
        } catch (Exception e) {
            logger.error("Error al obtener secciones paginadas: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    //? LISTAR PAGINADO SIN DTO
    public Page<Seccion> obtenerSeccionesPaginadas(Pageable pageable) {
        try {
            logger.info("Obteniendo secciones activas paginadas sin DTO...");
            return repository.findAllActiveOrderedByIdDesc(pageable);
        } catch (Exception e) {
            logger.error("Error al obtener secciones paginadas sin DTO: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    //!BUSCAR POR NOMBRE
    public ArrayList<Seccion> buscarSeccionPorNombre(String nombre) {
        try {
            logger.info("Buscando secciones con el nombre que contiene: {}", nombre);
            ArrayList<Seccion> seccions = new ArrayList<>();
            for (Seccion seccion : repository.findAll()) {
                if (seccion.getNombre().contains(nombre) && seccion.isActivo()) {
                    seccions.add(seccion);
                }
            }
            logger.info("Se han encontrado {} secciones con el nombre: {}", seccions.size(), nombre); // Log
            return seccions;
        } catch (Exception e) {
            logger.error("Error al buscar secciones por nombre: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    //!OBTENER POR ID
    public Seccion obtenerSeccionPorId(long id) {
        try {
            logger.info("Buscando sección con ID: {}", id);
            Optional<Seccion> seccion = repository.findById(id);
            if (seccion.isPresent()) {
                logger.info("Sección encontrada con ID: {}", id); // Log
                return seccion.get();
            }
            logger.warn("No se encontró sección con ID: {}", id); // Log
            return null;
        } catch (Exception e) {
            logger.error("Error al obtener sección por ID: {}", e.getMessage(), e);
            throw e;
        }
    }
    //? OBTENER PRIMERO POR CODIGO
    public SeccionDTOInsersion obtenerPrimeroPorCodigo(String codigo) {
        modelMapper = new ModelMapper();
        try {
            logger.info("Buscando sección con código: {}", codigo);
            Optional<Seccion> seccion = repository.findFirstByCodigoAndActivoTrue(codigo);
            if (seccion.isPresent()) {
                logger.info("Sección encontrada con código: {}", codigo); // Log
                return modelMapper.map(seccion.get(), SeccionDTOInsersion.class);
            }
            logger.warn("No se encontró sección con código: {}", codigo); // Log
            return null;
        } catch (Exception e) {
            logger.error("Error al obtener sección por código: {}", e.getMessage(), e);
            throw e;
        }
    }
    //!ELIMINAR SECCION
    public boolean eliminarSeccion(long id) {
        try {
            logger.info("Intentando eliminar sección con ID: {}", id);
            Optional<Seccion> seccion = repository.findById(id);
            if (seccion.isPresent()) {
                seccion.get().setActivo(false);
                seccion.get().setJefe(null);
                seccion.get().setAsistente(null);
                repository.save(seccion.get());
    
                logger.info("Sección con ID: {} eliminada con éxito", id); // Log
                return true;
            }
            logger.warn("No se encontró sección con ID: {}", id); // Log
            return false;
        } catch (Exception e) {
            logger.error("Error al eliminar sección con ID: {}", id, e);
            throw e;
        }
    }
    
    //!ACTUALIZAR SECCION
    //!ACTUALIZAR SECCION
    public SeccionDTO actualizarSeccion(Long id, SeccionDTO seccionDTOActualizado) {
        try {
            logger.info("Actualizando sección con ID: {}", id);
            
            Optional<Seccion> seccionOptional = repository.findById(id);
            if (seccionOptional.isPresent()) {
                Seccion seccionExistente = seccionOptional.get();
                
                // Actualizar campos básicos heredados de Unidad
                seccionExistente.setNombre(seccionDTOActualizado.getNombre());
                seccionExistente.setCodigo(seccionDTOActualizado.getCodigo());
                seccionExistente.setCorreoContacto(seccionDTOActualizado.getCorreoContacto());
                seccionExistente.setDireccionWeb(seccionDTOActualizado.getDireccionWeb());
                seccionExistente.setTelefonoContacto(seccionDTOActualizado.getTelefonoContacto());
                
                // Actualizar departamento si existe
                if (seccionDTOActualizado.getDepartamento() != null) {
                    try {
                        logger.debug("Actualizando departamento de sección: {}", seccionDTOActualizado.getDepartamento().getId());
                        Departamento departamento = new Departamento();
                        departamento.setId(seccionDTOActualizado.getDepartamento().getId());
                        seccionExistente.setDepartamento(departamento);
                    } catch (Exception e) {
                        logger.error("Error al actualizar el departamento de sección: {}", e.getMessage());
                        throw new RuntimeException("Error al actualizar el departamento de sección", e);
                    }
                }
    
                // Actualizar jefe y asistente usando los métodos existentes
                actualizarJefeDeSeccion(seccionDTOActualizado, seccionExistente);
                actualizarAsistenteDeSeccion(seccionDTOActualizado, seccionExistente);
                
                // Guardar los cambios
                Seccion seccionGuardada = repository.save(seccionExistente);
                logger.info("Sección con ID: {} actualizada con éxito", id);
                
                // Crear y retornar DTO de respuesta
                SeccionDTO seccionRespuesta = new SeccionDTO();
                
                // Mapear atributos básicos
                seccionRespuesta.setId(seccionGuardada.getId());
                seccionRespuesta.setCodigo(seccionGuardada.getCodigo());
                seccionRespuesta.setNombre(seccionGuardada.getNombre());
                seccionRespuesta.setTelefonoContacto(seccionGuardada.getTelefonoContacto());
                seccionRespuesta.setCorreoContacto(seccionGuardada.getCorreoContacto());
                seccionRespuesta.setDireccionWeb(seccionGuardada.getDireccionWeb());
                seccionRespuesta.setTipo(seccionGuardada.getTipo());
                seccionRespuesta.setActivo(seccionGuardada.isActivo());
                
                // Mapear departamento en la respuesta
                if (seccionGuardada.getDepartamento() != null) {
                    DepartamentoDTO depDTO = new DepartamentoDTO();
                    depDTO.setId(seccionGuardada.getDepartamento().getId());
                    depDTO.setNombre(seccionGuardada.getDepartamento().getNombre());
                    seccionRespuesta.setDepartamento(depDTO);
                }
                
                // Mapear jefe en la respuesta
                if (seccionGuardada.getJefe() != null) {
                    PersonaDTO jefeDTO = new PersonaDTO();
                    jefeDTO.setId(seccionGuardada.getJefe().getId());
                    jefeDTO.setNombre(seccionGuardada.getJefe().getNombre());
                    seccionRespuesta.setJefe(jefeDTO);
                }
                
                // Mapear asistente en la respuesta
                if (seccionGuardada.getAsistente() != null) {
                    PersonaDTO asistenteDTO = new PersonaDTO();
                    asistenteDTO.setId(seccionGuardada.getAsistente().getId());
                    asistenteDTO.setNombre(seccionGuardada.getAsistente().getNombre());
                    seccionRespuesta.setAsistente(asistenteDTO);
                }
                
                return seccionRespuesta;
            } else {
                logger.warn("No se encontró sección con ID: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al actualizar sección con ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Error al actualizar la sección", e);
        }
    }
    public void actualizarJefeDeSeccion(SeccionDTO seccionDTOActualizado ,Seccion seccionExistente){
        // Comprobar si ha cambiado el director de carrera
        if (seccionDTOActualizado.getJefe() != null) {
            // Verificar si el secretario académico ha cambiado
            if (seccionExistente.getJefe() == null || 
                !seccionExistente.getJefe().getId().equals(seccionDTOActualizado.getJefe().getId())) {

                // Si hay un secretario académico anterior, eliminar su rol
                if (seccionExistente.getJefe() != null) {
                    PersonaRolUnidad personaRolUnidadAnterior = personaRolUnidadService.obtenerPorPersonaYUnidad(
                        seccionExistente.getJefe(), seccionExistente);
                    if (personaRolUnidadAnterior != null) {
                        logger.info("Eliminando el rol del antiguo jefe de seccion...");
                        personaRolUnidadAnterior.setEstado(false);  // Desactivamos la relación
                        personaRolUnidadService.insertar(personaRolUnidadAnterior);  // Actualizamos el registro
                    }
                }

                // Asignar el nuevo jefe departamento
                Persona nuevoJefeSeccion= modelMapper.map(seccionDTOActualizado.getJefe(), Persona.class);
                seccionExistente.setJefe(nuevoJefeSeccion);

                // Asignar el rol de "DIRECTOR DE CARRERA" al director de carrera
                Rol jefeSeccionRol = rolService.obtenerRolPorNombre("COORDINADOR DE SECCIÓN");
                if (jefeSeccionRol != null) {
                    PersonaRolUnidad personaRolUnidadNuevo = new PersonaRolUnidad();
                    personaRolUnidadNuevo.setPersona(nuevoJefeSeccion);
                    personaRolUnidadNuevo.setRol(jefeSeccionRol);
                    personaRolUnidadNuevo.setUnidad(seccionExistente);
                    personaRolUnidadNuevo.setEstado(true);  // Estado activo
                    personaRolUnidadService.insertar(personaRolUnidadNuevo);
                } else {
                    logger.error("No se encontró el rol 'COORDINADOR DE SECCIÓN'.");
                    throw new RuntimeException("No se encontró el rol 'COORDINADOR DE SECCIÓN'.");
                }
            }
        } else {
            // Si no se especifica un secretario académico, lo eliminamos de la facultad
            seccionExistente.setJefe(null);
        }

    }   

    public void actualizarAsistenteDeSeccion(SeccionDTO seccionDTOActualizado ,Seccion seccionExistente){
        // Comprobar si ha cambiado el director de carrera
        if (seccionDTOActualizado.getAsistente() != null) {
            // Verificar si el secretario académico ha cambiado
            if (seccionExistente.getAsistente() == null || 
                !seccionExistente.getAsistente().getId().equals(seccionDTOActualizado.getAsistente().getId())) {

                // Si hay un secretario académico anterior, eliminar su rol
                if (seccionExistente.getAsistente() != null) {
                    PersonaRolUnidad personaRolUnidadAnterior = personaRolUnidadService.obtenerPorPersonaYUnidad(
                        seccionExistente.getAsistente(), seccionExistente);
                    if (personaRolUnidadAnterior != null) {
                        logger.info("Eliminando el rol del antiguo asistente de seccion...");
                        personaRolUnidadAnterior.setEstado(false);  // Desactivamos la relación
                        personaRolUnidadService.insertar(personaRolUnidadAnterior);  // Actualizamos el registro
                    }
                }

                // Asignar el nuevo jefe departamento
                Persona nuevoAsistenteSeccion= modelMapper.map(seccionDTOActualizado.getAsistente(), Persona.class);
                seccionExistente.setAsistente(nuevoAsistenteSeccion);

                // Asignar el rol de "DIRECTOR DE CARRERA" al director de carrera
                Rol asistenteSeccionRol = rolService.obtenerRolPorNombre("ASISTENTE DE LA SECCION");
                if (asistenteSeccionRol != null) {
                    PersonaRolUnidad personaRolUnidadNuevo = new PersonaRolUnidad();
                    personaRolUnidadNuevo.setPersona(nuevoAsistenteSeccion);
                    personaRolUnidadNuevo.setRol(asistenteSeccionRol);
                    personaRolUnidadNuevo.setUnidad(seccionExistente);
                    personaRolUnidadNuevo.setEstado(true);  // Estado activo
                    personaRolUnidadService.insertar(personaRolUnidadNuevo);
                } else {
                    logger.error("No se encontró el rol 'ASISTENTE DE LA SECCION'.");
                    throw new RuntimeException("No se encontró el rol 'ASISTENTE DE LA SECCION'.");
                }
            }
        } else {
            // Si no se especifica un secretario académico, lo eliminamos de la facultad
            seccionExistente.setAsistente(null);
        }

    }   

    //!EXISTS
    public boolean existeCodigo(String codigo) {
        try {
            boolean exists = repository.existsByCodigoAndActivoTrue(codigo);
            logger.info("Verificando existencia de sección con código: {} - Existe: {}", codigo, exists); // Log
            return exists;
        } catch (Exception e) {
            logger.error("Error al verificar existencia de sección con código: {}", codigo, e);
            throw e;
        }
    }
    
    public boolean existePorJefe(Long id) {
        try {
            boolean exists = repository.countByJefeIdAndActivoTrue(id) > 0;
            logger.info("Verificando existencia de sección con Jefe ID: {} - Existe: {}", id, exists); // Log
            return exists;
        } catch (Exception e) {
            logger.error("Error al verificar existencia de sección con Jefe ID: {}", id, e);
            throw e;
        }
    }
    
    public boolean existePorAsistente(Long id) {
        try {
            boolean exists = repository.countByAsistenteIdAndActivoTrue(id) > 0;
            logger.info("Verificando existencia de sección con Asistente ID: {} - Existe: {}", id, exists); // Log
            return exists;
        } catch (Exception e) {
            logger.error("Error al verificar existencia de sección con Asistente ID: {}", id, e);
            throw e;
        }
    }
    
}
