package pe.edu.pucp.onepucp.institucion.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.dto.PlanDeEstudioDTO;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.TipoUnidad;
import pe.edu.pucp.onepucp.institucion.repository.EspecialidadRepository;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.PersonaRolUnidad;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.service.PersonaRolUnidadService;
import pe.edu.pucp.onepucp.rrhh.service.PersonaService;
import pe.edu.pucp.onepucp.rrhh.service.RolService;
@Service
public class EspecialidadService {
    
    private static final Logger logger = LoggerFactory.getLogger(EspecialidadService.class); // Logger

    @Autowired
    private EspecialidadRepository repository;

    @Autowired
    private PlanDeEstudioService planDeEstudioService;
    @Autowired
    private RolService rolService;

    @Autowired
    private PersonaRolUnidadService personaRolUnidadService;

    @Autowired
    private PersonaService personaService;
    private ModelMapper modelMapper;

    //!LISTAR
    public List<EspecialidadDTO> listarEspecialidades() {
        try {
            modelMapper = new ModelMapper();
            List<Especialidad> especialidades = (List<Especialidad>) repository.findAll();
            List<EspecialidadDTO> especialidadesDTO = new ArrayList<>();
            for (Especialidad especialidad : especialidades) {
                if (especialidad.isActivo()) {
                    EspecialidadDTO especialidadDTO = modelMapper.map(especialidad, EspecialidadDTO.class);
                    especialidadesDTO.add(especialidadDTO);
                }
            }
            Collections.reverse(especialidadesDTO);
            logger.info("Se han listado {} especialidades activas", especialidadesDTO.size());
            return especialidadesDTO;
        } catch (Exception e) {
            logger.error("Error al listar especialidades: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public boolean existeEspecialidadPorCodigo(String nombre) {
        try {
            logger.info("Buscando especialidad con código: {}", nombre);
            return repository.existsByCodigoAndActivoTrue(nombre);
        } catch (Exception e) {
            logger.error("Error al verificar la existencia de especialidad con código {}: {}", nombre, e.getMessage());
            return false;
        }
    }

    // Método para obtener especialidades paginadas como DTO
    public Page<EspecialidadDTO> obtenerEspecialidadesDTOPaginadas(Pageable pageable) {
        try {
            modelMapper = new ModelMapper();
            Page<Especialidad> especialidadesPage = repository.findAllActiveOrderedByIdDesc(pageable);
            logger.info("Se han encontrado {} especialidades activas en la página {}", especialidadesPage.getTotalElements(), pageable.getPageNumber());
            return especialidadesPage.map(especialidad -> modelMapper.map(especialidad, EspecialidadDTO.class));
        } catch (Exception e) {
            logger.error("Error al obtener especialidades paginadas: {}", e.getMessage());
            return Page.empty();
        }
    }

    //!OBTENER POR ID
    public EspecialidadDTO obtenerEspecialidadPorId(Long id) {
        try {
            modelMapper = new ModelMapper();
            Optional<Especialidad> especialidadOptional = repository.findById(id);
            if (especialidadOptional.isPresent()) {
                EspecialidadDTO especialidadDTO = modelMapper.map(especialidadOptional.get(), EspecialidadDTO.class);
                logger.info("Especialidad encontrada con ID: {}", id);
                return especialidadDTO;
            } else {
                logger.warn("Especialidad no encontrada con ID: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al obtener la especialidad con ID {}: {}", id, e.getMessage());
            return null;
        }
    }

    //!INSERTAR
    public EspecialidadDTO insertarEspecialidad(EspecialidadDTO especialidadDTO) {
        try {
            logger.info("Insertando especialidad: {}", especialidadDTO.getImpresionEspecialidad());
            modelMapper = new ModelMapper();
            Especialidad especialidad = modelMapper.map(especialidadDTO, Especialidad.class);
            especialidad.setActivo(true);
            especialidad.setTipo(TipoUnidad.ESPECIALIDAD);
            // Insertar su coordinador y asistente de carrera
            if (especialidadDTO.getCoordinador() != null) {
                try {
                    logger.info("Procesando actualización del coordinador para la especialidad con ID {}. Coordinador DTO: {}", especialidad.getId(), especialidadDTO.getCoordinador());
                    Persona coordinador = modelMapper.map(especialidadDTO.getCoordinador(), Persona.class);
                    especialidad.setCoordinador(coordinador);
                    logger.info("Coordinador asignado correctamente para la especialidad con ID {}: {}", especialidad.getId(), coordinador.getId());
                } catch (Exception e) {
                    logger.error("Error al asignar el coordinador para la especialidad con ID {}. Detalle del error: {}", especialidad.getId(), e.getMessage());
                    throw new RuntimeException("Error al asignar el coordinador", e);
                }
            }
            
            if (especialidadDTO.getAsistenteDeCarrera() != null) {
                try {
                    logger.info("Procesando actualización del asistente de carrera para la especialidad con ID {}. Asistente DTO: {}", especialidad.getId(), especialidadDTO.getAsistenteDeCarrera());
                    Persona asistente = modelMapper.map(especialidadDTO.getAsistenteDeCarrera(), Persona.class);
                    especialidad.setAsistenteDeCarrera(asistente);
                    logger.info("Asistente de carrera asignado correctamente para la especialidad con ID {}: {}", especialidad.getId(), asistente.getId());
                } catch (Exception e) {
                    logger.error("Error al asignar el asistente de carrera para la especialidad con ID {}. Detalle del error: {}", especialidad.getId(), e.getMessage());
                    throw new RuntimeException("Error al asignar el asistente de carrera", e);
                }
            }
            
            
            especialidad = repository.save(especialidad);
            
            especialidadDTO.setId(especialidad.getId()); // Asegúrate de establecer el ID actualizado
    
            // Crear y insertar el plan de estudio asociado utilizando el EspecialidadDTO completo
            PlanDeEstudioDTO planDeEstudioDTO = new PlanDeEstudioDTO();
            planDeEstudioDTO.setNombre(especialidadDTO.getNombre());
            planDeEstudioDTO.setActivo(true);
            planDeEstudioDTO.setEspecialidad(especialidadDTO);
            planDeEstudioService.insertarPlanDeEstudio(planDeEstudioDTO);
            //Asignar Coordinador y Asistente su Especialidad
            if (especialidadDTO.getCoordinador() != null) {
                personaService.asignarEspecialidad(especialidadDTO.getCoordinador().getId(), especialidadDTO.getId());
            }
            if (especialidadDTO.getAsistenteDeCarrera() != null) {
                personaService.asignarEspecialidad(especialidadDTO.getAsistenteDeCarrera().getId(), especialidadDTO.getId());
            }
            //!---------------------
             
            // Asignar el rol al secretario académico
            asignarRolAlDirectorDeCarrera(especialidad);
            // Asignar el rol al Asistente de carerra
            asignarAsistenteDeCarrera(especialidad);

            logger.info("Especialidad insertada con éxito: {}", especialidadDTO.getCodigo());
            return especialidadDTO;
        } catch (Exception e) {
            logger.error("Error al insertar la especialidad: {}", e.getMessage());
            return null;
        }
    }
    
    public void asignarRolAlDirectorDeCarrera(Especialidad especialidad){
        if (especialidad.getCoordinador() != null) {
            Rol directoDeCarreraRol = rolService.obtenerRolPorNombre("DIRECTOR DE CARRERA");
            Persona persona = especialidad.getCoordinador();

            // Crear la entidad PersonaRolUnidad
            PersonaRolUnidad personaRolUnidad = new PersonaRolUnidad();
            personaRolUnidad.setPersona(persona);
            personaRolUnidad.setRol(directoDeCarreraRol);
            personaRolUnidad.setUnidad(especialidad);
            personaRolUnidad.setEstado(true); // Estado activo

            // Guardar en la base de datos
            personaRolUnidadService.insertar(personaRolUnidad);
        }
    }

    public void asignarAsistenteDeCarrera(Especialidad especialidad){
        if (especialidad.getAsistenteDeCarrera() != null) {
            Rol asistenteDeCarrera = rolService.obtenerRolPorNombre("ASISTENTE DE CARRERA");
            Persona persona = especialidad.getAsistenteDeCarrera();

            // Crear la entidad PersonaRolUnidad
            PersonaRolUnidad personaRolUnidad = new PersonaRolUnidad();
            personaRolUnidad.setPersona(persona);
            personaRolUnidad.setRol(asistenteDeCarrera);
            personaRolUnidad.setUnidad(especialidad);
            personaRolUnidad.setEstado(true); // Estado activo

            // Guardar en la base de datos
            personaRolUnidadService.insertar(personaRolUnidad);
        }
    }
    //!ELIMINAR
    public void eliminarEspecialidad(Long id) {
        try {
            modelMapper = new ModelMapper();
            Optional<Especialidad> especialidadOptional = repository.findById(id);
            if (especialidadOptional.isPresent()) {
                Especialidad especialidad = especialidadOptional.get();
                especialidad.setActivo(false);
                especialidad.setCoordinador(null);
                especialidad.setAsistenteDeCarrera(null);
                
                repository.save(especialidad);

                // Desactivar el plan de estudio asociado
                PlanDeEstudioDTO planDeEstudio = planDeEstudioService.obtenerPlanDeEstudioPorEspecialidad(id);
                if (planDeEstudio != null) {
                    planDeEstudioService.eliminarPlanDeEstudio(planDeEstudio.getIdPlanDeEstudio());
                }
                //!---------------------DESASIGNAR LAS PERSONAS ASOCIADAS-------------
                
                logger.info("Especialidad con ID: {} eliminada con éxito", id);
            } else {
                logger.warn("No se encontró especialidad con ID: {}", id);
            }
        } catch (Exception e) {
            logger.error("Error al eliminar la especialidad con ID {}: {}", id, e.getMessage());
        }
    }

    //!ACTUALIZAR
    public EspecialidadDTO actualizarEspecialidad(Long id, EspecialidadDTO especialidadDtoActualizado) {
        try {
            Optional<Especialidad> especialidadOptional = repository.findById(id);
            logger.info("Los datos de la especialidad a actualizar son:  {}", especialidadDtoActualizado.getImpresionEspecialidad());
            if (especialidadOptional.isPresent()) {
                modelMapper = new ModelMapper();
                Especialidad especialidadExistente = especialidadOptional.get();
                especialidadExistente.setNombre(especialidadDtoActualizado.getNombre());
                especialidadExistente.setTelefonoContacto(especialidadDtoActualizado.getTelefonoContacto());
                especialidadExistente.setCorreoContacto(especialidadDtoActualizado.getCorreoContacto());
                especialidadExistente.setDireccionWeb(especialidadDtoActualizado.getDireccionWeb());
                especialidadExistente.setCodigo(especialidadDtoActualizado.getCodigo());
                especialidadExistente.setTipo(TipoUnidad.ESPECIALIDAD);
                especialidadExistente.setActivo(true);
                 
                /* 
                //SE HACE MAS ABAJO ASIGNANDO ROLES Y QUITANDO 
                //!Actualizar Coordinador y Asistente de Carrera
                if (especialidadDtoActualizado.getCoordinador() != null) {
                    try {
                        logger.info("Actualizando coordinador para la especialidad con ID {}. Coordinador DTO: {}", especialidadExistente.getId(), especialidadDtoActualizado.getCoordinador());
                        Persona coordinador = modelMapper.map(especialidadDtoActualizado.getCoordinador(), Persona.class);
                        especialidadExistente.setCoordinador(coordinador);
                        logger.info("Coordinador actualizado correctamente: {}", coordinador.getId());
                    } catch (Exception e) {
                        logger.error("Error al actualizar el coordinador para la especialidad con ID {}. Error: {}", especialidadExistente.getId(), e.getMessage());
                        throw new RuntimeException("No se pudo actualizar el coordinador", e);
                    }
                }
                
                if (especialidadDtoActualizado.getAsistenteDeCarrera() != null) {
                    try {
                        logger.info("Actualizando asistente de carrera para la especialidad con ID {}. Asistente DTO: {}", especialidadExistente.getId(), especialidadDtoActualizado.getAsistenteDeCarrera());
                        Persona asistente = modelMapper.map(especialidadDtoActualizado.getAsistenteDeCarrera(), Persona.class);
                        especialidadExistente.setAsistenteDeCarrera(asistente);
                        logger.info("Asistente de carrera actualizado correctamente: {}", asistente.getId());
                    } catch (Exception e) {
                        logger.error("Error al actualizar el asistente de carrera para la especialidad con ID {}. Error: {}", especialidadExistente.getId(), e.getMessage());
                        throw new RuntimeException("No se pudo actualizar el asistente de carrera", e);
                    }
                }
                
                */

                // Actualizar el nombre del plan de estudio asociado
                PlanDeEstudioDTO planDeEstudio = planDeEstudioService.obtenerPlanDeEstudioPorEspecialidad(id);
                if (planDeEstudio != null) {
                    planDeEstudio.setNombre(especialidadExistente.getNombre());
                    planDeEstudio.setEspecialidad(modelMapper.map(especialidadExistente, EspecialidadDTO.class));
                    planDeEstudioService.actualizarPlanDeEstudio(planDeEstudio.getIdPlanDeEstudio(), planDeEstudio);
                }
                

                actualizarDirectorDeCarrera(especialidadDtoActualizado,especialidadExistente);
                actualizarAsistenteDeCarrera(especialidadDtoActualizado,especialidadExistente);
                especialidadExistente = repository.save(especialidadExistente);

                //!---------------------ACTUALIZAR LAS PERSONAS ASOCIADAS-------------
                if (especialidadDtoActualizado.getCoordinador() != null) {
                    personaService.asignarEspecialidad(especialidadDtoActualizado.getCoordinador().getId(), especialidadDtoActualizado.getId());
                }
                if (especialidadDtoActualizado.getAsistenteDeCarrera() != null) {
                    personaService.asignarEspecialidad(especialidadDtoActualizado.getAsistenteDeCarrera().getId(), especialidadDtoActualizado.getId());
                }
                //!-----------------------#############-----------------------//
                
                logger.info("Especialidad con ID: {} actualizada con éxito", id);
                return modelMapper.map(especialidadExistente, EspecialidadDTO.class);
            } else {
                logger.warn("No se encontró especialidad con ID: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al actualizar la especialidad con ID {}: {}", id, e.getMessage());
            return null;
        }
    }

    public void actualizarDirectorDeCarrera(EspecialidadDTO especialidadDtoActualizado,Especialidad especialidadExistente){
        // Comprobar si ha cambiado el director de carrera
        if (especialidadDtoActualizado.getCoordinador() != null) {
            // Verificar si el secretario académico ha cambiado
            if (especialidadExistente.getCoordinador() == null || 
                !especialidadExistente.getCoordinador().getId().equals(especialidadDtoActualizado.getCoordinador().getId())) {

                // Si hay un secretario académico anterior, eliminar su rol
                if (especialidadExistente.getCoordinador() != null) {
                    PersonaRolUnidad personaRolUnidadAnterior = personaRolUnidadService.obtenerPorPersonaYUnidad(
                        especialidadExistente.getCoordinador(), especialidadExistente);
                    if (personaRolUnidadAnterior != null) {
                        logger.info("Eliminando el rol del antiguo director de carrera...");
                        personaRolUnidadAnterior.setEstado(false);  // Desactivamos la relación
                        personaRolUnidadService.insertar(personaRolUnidadAnterior);  // Actualizamos el registro
                    }
                }

                // Asignar el nuevo secretario académico
                Persona nuevoCoordinador= modelMapper.map(especialidadDtoActualizado.getCoordinador(), Persona.class);
                especialidadExistente.setCoordinador(nuevoCoordinador);

                // Asignar el rol de "DIRECTOR DE CARRERA" al director de carrera
                Rol directoDeCarreraRol = rolService.obtenerRolPorNombre("DIRECTOR DE CARRERA");
                if (directoDeCarreraRol != null) {
                    PersonaRolUnidad personaRolUnidadNuevo = new PersonaRolUnidad();
                    personaRolUnidadNuevo.setPersona(nuevoCoordinador);
                    personaRolUnidadNuevo.setRol(directoDeCarreraRol);
                    personaRolUnidadNuevo.setUnidad(especialidadExistente);
                    personaRolUnidadNuevo.setEstado(true);  // Estado activo
                    personaRolUnidadService.insertar(personaRolUnidadNuevo);
                } else {
                    logger.error("No se encontró el rol 'DIRECTOR DE CARRERA'.");
                    throw new RuntimeException("No se encontró el rol 'DIRECTOR DE CARRERA'.");
                }
            }
        } else {
            // Si no se especifica un secretario académico, lo eliminamos de la facultad
            especialidadExistente.setCoordinador(null);
        }

    }   

    public void actualizarAsistenteDeCarrera(EspecialidadDTO especialidadDtoActualizado,Especialidad especialidadExistente){
        // Comprobar si ha cambiado el director de carrera
        if (especialidadDtoActualizado.getAsistenteDeCarrera() != null) {
            // Verificar si el secretario académico ha cambiado
            if (especialidadExistente.getAsistenteDeCarrera() == null || 
                !especialidadExistente.getAsistenteDeCarrera().getId().equals(especialidadDtoActualizado.getAsistenteDeCarrera().getId())) {

                // Si hay un secretario académico anterior, eliminar su rol
                if (especialidadExistente.getAsistenteDeCarrera() != null) {
                    PersonaRolUnidad personaRolUnidadAnterior = personaRolUnidadService.obtenerPorPersonaYUnidad(
                        especialidadExistente.getAsistenteDeCarrera(), especialidadExistente);
                    if (personaRolUnidadAnterior != null) {
                        logger.info("Eliminando el rol del antiguo asistente de carrera...");
                        personaRolUnidadAnterior.setEstado(false);  // Desactivamos la relación
                        personaRolUnidadService.insertar(personaRolUnidadAnterior);  // Actualizamos el registro
                    }
                }

                // Asignar el nuevo secretario académico
                Persona nuevoAsistenteCarrera= modelMapper.map(especialidadDtoActualizado.getAsistenteDeCarrera(), Persona.class);
                especialidadExistente.setAsistenteDeCarrera(nuevoAsistenteCarrera);

                // Asignar el rol de "DIRECTOR DE CARRERA" al director de carrera
                Rol asistenteDeCarreraRol = rolService.obtenerRolPorNombre("ASISTENTE DE CARRERA");
                if (asistenteDeCarreraRol != null) {
                    PersonaRolUnidad personaRolUnidadNuevo = new PersonaRolUnidad();
                    personaRolUnidadNuevo.setPersona(nuevoAsistenteCarrera);
                    personaRolUnidadNuevo.setRol(asistenteDeCarreraRol);
                    personaRolUnidadNuevo.setUnidad(especialidadExistente);
                    personaRolUnidadNuevo.setEstado(true);  // Estado activo
                    personaRolUnidadService.insertar(personaRolUnidadNuevo);
                } else {
                    logger.error("No se encontró el rol 'ASISTENTE DE CARRERA'.");
                    throw new RuntimeException("No se encontró el rol 'ASISTENTE DE CARRERA'.");
                }
            }
        } else {
            // Si no se especifica un secretario académico, lo eliminamos de la facultad
            especialidadExistente.setCoordinador(null);
        }

    }   

    //!EXISTE
    public boolean existeCodigo(String codigo) {
        try {
            logger.info("Verificando existencia de especialidad con código: {}", codigo);
            return repository.existsByCodigoAndActivoTrue(codigo);
        } catch (Exception e) {
            logger.error("Error al verificar existencia de especialidad con código {}: {}", codigo, e.getMessage());
            return false;
        }
    }

    // Existen por AsistenteCarrera
    public boolean existePorAsistenteCarrera(Long id) {
        try {
            logger.info("Verificando existencia de especialidad con Asistente de Carrera ID: {}", id);
            return repository.countByAsistenteDeCarreraIdAndActivoTrue(id) > 0;
        } catch (Exception e) {
            logger.error("Error al verificar existencia por Asistente de Carrera con ID {}: {}", id, e.getMessage());
            return false;
        }
    }

    // Existen por Coordinador
    public boolean existePorCoordinador(Long idCoordinador) {
        try {
            logger.info("Verificando existencia de especialidad con Coordinador ID: {}", idCoordinador);
            return repository.countByCoordinadorIdAndActivoTrue(idCoordinador) > 0;
        } catch (Exception e) {
            logger.error("Error al verificar existencia por Coordinador con ID {}: {}", idCoordinador, e.getMessage());
            return false;
        }
    }

    // Buscar por Coordinador (retorna solo el primer resultado)
    public EspecialidadDTO buscarPorCoordinador(Long idCoordinador) {
        try {
            modelMapper = new ModelMapper();
            List<Especialidad> especialidades = repository.findByCoordinadorId(idCoordinador);
            if (!especialidades.isEmpty()) {
                logger.info("Especialidad encontrada para Coordinador con ID: {}", idCoordinador);
                return modelMapper.map(especialidades.get(0), EspecialidadDTO.class);
            }
            logger.warn("No se encontraron especialidades para el Coordinador con ID: {}", idCoordinador);
            return null;
        } catch (Exception e) {
            logger.error("Error al buscar especialidad por Coordinador con ID {}: {}", idCoordinador, e.getMessage());
            return null;
        }
    }

    public List<EspecialidadDTO> obtenerEspecialidadesPorFacultad(Long idFacultad) {
        try {
            modelMapper = new ModelMapper();
            List<Especialidad> especialidades = repository.findByFacultadId(idFacultad);
            List<EspecialidadDTO> especialidadesDTO = new ArrayList<>();
            for (Especialidad especialidad : especialidades) {
                if (especialidad.isActivo()) {
                    EspecialidadDTO especialidadDTO = modelMapper.map(especialidad, EspecialidadDTO.class);
                    especialidadesDTO.add(especialidadDTO);
                }
            }
            Collections.reverse(especialidadesDTO);
            logger.info("Se han listado {} especialidades activas", especialidadesDTO.size());
            return especialidadesDTO;
        } catch (Exception e) {
            logger.error("Error al listar especialidades: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}
