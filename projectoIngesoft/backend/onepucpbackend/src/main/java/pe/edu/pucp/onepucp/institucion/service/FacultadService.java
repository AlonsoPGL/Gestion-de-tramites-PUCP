package pe.edu.pucp.onepucp.institucion.service;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import pe.edu.pucp.onepucp.institucion.dto.FacultadDTO;
import pe.edu.pucp.onepucp.institucion.model.Facultad;
import pe.edu.pucp.onepucp.institucion.model.TipoUnidad;
import pe.edu.pucp.onepucp.institucion.repository.FacultadRepository;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.PersonaRolUnidad;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.service.PersonaRolUnidadService;
import pe.edu.pucp.onepucp.rrhh.service.RolService;

@Service
public class FacultadService {
    private static final Logger logger = LoggerFactory.getLogger(FacultadService.class);
    
    @Autowired
    private FacultadRepository repository;
    @Autowired
    private RolService rolService;
    @Autowired
    private PersonaRolUnidadService personaRolUnidadService;
    
    private ModelMapper modelMapper;

    //!LISTAR  
    //?TODAS
    public List<FacultadDTO> obtenerTodasLasFacultades() {
        try {
            logger.info("Obteniendo todas las facultades activas...");
            modelMapper = new ModelMapper();
            List<Facultad> facultades = repository.findAllByActivoTrue();
            logger.info("Total de facultades activas encontradas: {}", facultades.size());
            return facultades.stream()
                             .map(facultad -> modelMapper.map(facultad, FacultadDTO.class))
                             .toList();
        } catch (Exception e) {
            logger.error("Error al obtener todas las facultades: {}", e.getMessage(), e);
            throw e;
        }
    }

    //?INDEXADO
    public Page<FacultadDTO> obtenerFacultadesDTOPaginadas(Pageable pageable) {
        try {
            logger.info("Obteniendo facultades paginadas como DTO. Página: {}", pageable.getPageNumber());
            modelMapper = new ModelMapper();
            Page<Facultad> facultadesPage = repository.findAllActiveOrderedByIdDesc(pageable);
            logger.info("Total de elementos paginados obtenidos: {}", facultadesPage.getTotalElements());
            return facultadesPage.map(facultad -> modelMapper.map(facultad, FacultadDTO.class));
        } catch (Exception e) {
            logger.error("Error al obtener facultades paginadas: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Page<Facultad> obtenerFacultadesPaginadas(Pageable pageable) {
        try {
            logger.info("Obteniendo facultades paginadas sin DTO. Página: {}", pageable.getPageNumber());
            Page<Facultad> facultadesPage = repository.findAllActiveOrderedByIdDesc(pageable);
            logger.info("Total de elementos paginados obtenidos: {}", facultadesPage.getTotalElements());
            return facultadesPage;
        } catch (Exception e) {
            logger.error("Error al obtener facultades paginadas sin DTO: {}", e.getMessage(), e);
            throw e;
        }
    }

    //!INSERTAR
    public FacultadDTO insertarFacultad(FacultadDTO facultadDTO) {
        try {
            logger.info("Iniciando la inserción de una nueva facultad...");
            modelMapper = new ModelMapper();
            Facultad facultad = modelMapper.map(facultadDTO, Facultad.class);
            facultad.setActivo(true);
            facultad.setTipo(TipoUnidad.FACULTAD);
            if(facultad.getSecretarioAcademico() != null) {
                
                facultad.setSecretarioAcademico( modelMapper.map(facultadDTO.getSecretarioAcademico(), Persona.class));
            }
            facultad = repository.save(facultad);
            FacultadDTO result = modelMapper.map(facultad, FacultadDTO.class);
            logger.info("Facultad insertada con éxito. Código: {}", result.getCodigo());


            
            // Asignar el rol al secretario académico
            if (facultad.getSecretarioAcademico() != null) {
                Rol secretarioAcademicoRol = rolService.obtenerRolPorNombre("SECRETARIO ACADEMICO");
                Persona persona = facultad.getSecretarioAcademico();

                // Crear la entidad PersonaRolUnidad
                PersonaRolUnidad personaRolUnidad = new PersonaRolUnidad();
                personaRolUnidad.setPersona(persona);
                personaRolUnidad.setRol(secretarioAcademicoRol);
                personaRolUnidad.setUnidad(facultad);
                personaRolUnidad.setEstado(true); // Estado activo

                // Guardar en la base de datos
                personaRolUnidadService.insertar(personaRolUnidad);
            }

        return result;
        } catch (DataAccessException e) {
            logger.error("Error al acceder a la base de datos durante la inserción: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            logger.error("Error inesperado al insertar la facultad: {}", e.getMessage(), e);
            throw e;
        }
    }

    //!ELIMINAR
    public boolean eliminarFacultad(long id) {
        try {
            logger.info("Intentando eliminar la facultad con ID: {}", id);
            Optional<Facultad> facultad = repository.findById(id);
            if (facultad.isPresent()) {
                facultad.get().setActivo(false);
                facultad.get().setSecretarioAcademico(null);
                repository.save(facultad.get());
                logger.info("Facultad eliminada con éxito. ID: {}", id);
                return true;
            } else {
                logger.warn("Facultad no encontrada para eliminar. ID: {}", id);
                return false;
            }
        } catch (DataAccessException e) {
            logger.error("Error al acceder a la base de datos al intentar eliminar la facultad: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            logger.error("Error inesperado al eliminar la facultad: {}", e.getMessage(), e);
            throw e;
        }
    }

    //!OBTENER POR ID
    public FacultadDTO obtenerFacultadPorId(Long id) {
        try {
            logger.info("Buscando facultad con ID: {}", id);
            Optional<Facultad> facultadOptional = repository.findById(id);
            if (facultadOptional.isPresent()) {
                Facultad facultad = facultadOptional.get();
                modelMapper = new ModelMapper();
                FacultadDTO facultadDTO = modelMapper.map(facultad, FacultadDTO.class);
                logger.info("Facultad obtenida por ID: {}", id);
                return facultadDTO;
            } else {
                logger.warn("Facultad no encontrada por ID: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al buscar la facultad por ID: {}", e.getMessage(), e);
            throw e;
        }
    }

    //!ACTUALIZAR
    public FacultadDTO actualizarFacultad(Long id, FacultadDTO facultadDtoActualizado) {
        try {
            logger.info("Actualizando facultad con ID: {}", id);
            Optional<Facultad> facultadOptional = repository.findById(id);
    
            if (facultadOptional.isPresent()) {
                Facultad facultadExistente = facultadOptional.get();
                facultadExistente.setId(id);
                facultadExistente.setCodigo(facultadDtoActualizado.getCodigo());
                facultadExistente.setNombre(facultadDtoActualizado.getNombre());
                facultadExistente.setTelefonoContacto(facultadDtoActualizado.getTelefonoContacto());
                facultadExistente.setCorreoContacto(facultadDtoActualizado.getCorreoContacto());
                facultadExistente.setDireccionWeb(facultadDtoActualizado.getDireccionWeb());
                facultadExistente.setTipo(facultadDtoActualizado.getTipo());
                facultadExistente.setActivo(facultadDtoActualizado.isActivo());  // Mantener el estado activo o inactivo
                
                // Comprobar si ha cambiado el secretario académico
                if (facultadDtoActualizado.getSecretarioAcademico() != null) {
                    // Verificar si el secretario académico ha cambiado
                    if (facultadExistente.getSecretarioAcademico() == null || 
                        !facultadExistente.getSecretarioAcademico().getId().equals(facultadDtoActualizado.getSecretarioAcademico().getId())) {
    
                        // Si hay un secretario académico anterior, eliminar su rol
                        if (facultadExistente.getSecretarioAcademico() != null) {
                            PersonaRolUnidad personaRolUnidadAnterior = personaRolUnidadService.obtenerPorPersonaYUnidad(
                                    facultadExistente.getSecretarioAcademico(), facultadExistente);
                            if (personaRolUnidadAnterior != null) {
                                logger.info("Eliminando el rol del antiguo secretario académico...");
                                personaRolUnidadAnterior.setEstado(false);  // Desactivamos la relación
                                personaRolUnidadService.insertar(personaRolUnidadAnterior);  // Actualizamos el registro
                            }
                        }
    
                        // Asignar el nuevo secretario académico
                        Persona nuevoSecretarioAcademico = modelMapper.map(facultadDtoActualizado.getSecretarioAcademico(), Persona.class);
                        facultadExistente.setSecretarioAcademico(nuevoSecretarioAcademico);
    
                        // Asignar el rol de "SECRETARIO ACADEMICO" al nuevo secretario académico
                        Rol secretarioAcademicoRol = rolService.obtenerRolPorNombre("SECRETARIO ACADEMICO");
                        if (secretarioAcademicoRol != null) {
                            PersonaRolUnidad personaRolUnidadNuevo = new PersonaRolUnidad();
                            personaRolUnidadNuevo.setPersona(nuevoSecretarioAcademico);
                            personaRolUnidadNuevo.setRol(secretarioAcademicoRol);
                            personaRolUnidadNuevo.setUnidad(facultadExistente);
                            personaRolUnidadNuevo.setEstado(true);  // Estado activo
                            personaRolUnidadService.insertar(personaRolUnidadNuevo);
                        } else {
                            logger.error("No se encontró el rol 'SECRETARIO ACADEMICO'.");
                            throw new RuntimeException("No se encontró el rol 'SECRETARIO ACADEMICO'.");
                        }
                    }
                } else {
                    // Si no se especifica un secretario académico, lo eliminamos de la facultad
                    facultadExistente.setSecretarioAcademico(null);
                }
    
                // Guardamos los cambios en la facultad
                facultadExistente = repository.save(facultadExistente);
                modelMapper = new ModelMapper();
                logger.info("Facultad actualizada exitosamente. ID: {}", id);
                return modelMapper.map(facultadExistente, FacultadDTO.class);
            } else {
                logger.warn("Facultad no encontrada para actualizar. ID: {}", id);
                return null;
            }
        } catch (DataAccessException e) {
            logger.error("Error al acceder a la base de datos al actualizar la facultad: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            logger.error("Error inesperado al actualizar la facultad: {}", e.getMessage(), e);
            throw e;
        }
    }

    //!EXISTE EL CODIGO
    public boolean existeCodigo(String codigo) {
        try {
            boolean existe = repository.existsByCodigoAndActivoTrue(codigo);
            if (existe) {
                logger.info("El código {} ya existe en la base de datos.", codigo);
            } else {
                logger.info("El código {} no existe en la base de datos.", codigo);
            }
            return existe;
        } catch (Exception e) {
            logger.error("Error al verificar existencia del código {}: {}", codigo, e.getMessage(), e);
            throw e;
        }
    }

    public boolean existePorSecretarioAcademico(Long idSecretarioAcademico) {
        try {
            boolean existe = repository.countBySecretarioAcademicoIdAndActivoTrue(idSecretarioAcademico) > 0;
            if (existe) {
                logger.info("El secretario académico con ID {} ya está asignado a una facultad.", idSecretarioAcademico);
            } else {
                logger.info("El secretario académico con ID {} no está asignado a ninguna facultad.", idSecretarioAcademico);
            }
            return existe;
        } catch (Exception e) {
            logger.error("Error al verificar asignación del secretario académico con ID {}: {}", idSecretarioAcademico, e.getMessage(), e);
            throw e;
        }
    }

    public Long obtenerIdFacultadPorCodigo(String codigo) {
        try {
            if (codigo == null || codigo.trim().isEmpty()) {
                logger.error("El código proporcionado es nulo o vacío.");
                return null;
            }

            List<Long> idFacultades = repository.findIdByCodigoAndActivoTrue(codigo);
            if (idFacultades.size() > 1) {
                logger.warn("Se encontraron múltiples facultades con el código: {}", codigo);
            } else if (idFacultades.size() == 0) {
                logger.warn("No se encontró ninguna facultad con el código: {}", codigo);
            }
            logger.info("ID de facultad obtenido para el código: {}", codigo);
            return idFacultades.get(0);
        } catch (EntityNotFoundException e) {
            logger.error("No se encontró un registro con el código: {}", codigo, e);
        } catch (DataAccessException e) {
            logger.error("Error al acceder a la base de datos: {}", e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error inesperado al obtener el ID por código: {}", e.getMessage(), e);
        }
        return null;
    }
}
