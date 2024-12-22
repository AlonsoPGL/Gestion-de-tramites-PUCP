package pe.edu.pucp.onepucp.institucion.service;

import java.util.Collections;
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
import pe.edu.pucp.onepucp.institucion.model.Departamento;
import pe.edu.pucp.onepucp.institucion.model.TipoUnidad;
import pe.edu.pucp.onepucp.institucion.repository.DepartamentoRepository;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.PersonaRolUnidad;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.service.PersonaRolUnidadService;
import pe.edu.pucp.onepucp.rrhh.service.RolService;

@Service
public class DepartamentoService {

    private static final Logger logger = LoggerFactory.getLogger(DepartamentoService.class);

    @Autowired
    private DepartamentoRepository repository;

    @Autowired
    private RolService rolService;

    @Autowired
    private PersonaRolUnidadService personaRolUnidadService;

    private ModelMapper modelMapper;

//!REGISTRAR
    @Transactional
    public DepartamentoDTO insertarDepartamento(DepartamentoDTO departamentoDTO) {
        try {
            logger.info("Iniciando la inserción de un nuevo departamento...");
            modelMapper = new ModelMapper();
            Departamento departamento = modelMapper.map(departamentoDTO, Departamento.class);

            // Mapear el jefe
            if (departamentoDTO.getJefe() != null) {
                Persona jefe = modelMapper.map(departamentoDTO.getJefe(), Persona.class);
                departamento.setJefe(jefe);
            }

            departamento.setActivo(true);
            departamento.setTipo(TipoUnidad.DEPARTAMENTO);
            departamento = repository.save(departamento);

            // Asignar el rol al secretario académico
            asignarRolAlJefeDeDepartamento(departamento);

            logger.info("Departamento registrado con éxito: {}", departamento.getCodigo());
            return modelMapper.map(departamento, DepartamentoDTO.class);
        } catch (Exception e) {
            logger.error("Error al registrar el departamento: {}", e.getMessage());
            throw e;
        }
    }

    public void asignarRolAlJefeDeDepartamento(Departamento departamento){
        if (departamento.getJefe() != null) {
            Rol jefeDepartamentoRol = rolService.obtenerRolPorNombre("JEFE DE DEPARTAMENTO");
            Persona persona = departamento.getJefe();

            // Crear la entidad PersonaRolUnidad
            PersonaRolUnidad personaRolUnidad = new PersonaRolUnidad();
            personaRolUnidad.setPersona(persona);
            personaRolUnidad.setRol(jefeDepartamentoRol);
            personaRolUnidad.setUnidad(departamento);
            personaRolUnidad.setEstado(true); // Estado activo

            // Guardar en la base de datos
            personaRolUnidadService.insertar(personaRolUnidad);
        }
    }
 
//!LISTAR TODOS
public List<DepartamentoDTO> obtenerTodosLosDepartamentos() {
    try {
        logger.info("Obteniendo todos los departamentos activos...");
        List<DepartamentoDTO> departamentosDTO = repository.findAll().stream()
                .filter(Departamento::isActivo)
                .map(departamento -> {
                    // Crear nuevo DTO y mapear manualmente
                    DepartamentoDTO dto = new DepartamentoDTO();
                    
                    // Mapear atributos heredados de UnidadDTO
                    dto.setId(departamento.getId());
                    dto.setCodigo(departamento.getCodigo());
                    dto.setNombre(departamento.getNombre());
                    dto.setTelefonoContacto(departamento.getTelefonoContacto());
                    dto.setCorreoContacto(departamento.getCorreoContacto());
                    dto.setDireccionWeb(departamento.getDireccionWeb());
                    dto.setTipo(departamento.getTipo());
                    
                    // Mapear atributos propios de DepartamentoDTO
                    dto.setActivo(departamento.isActivo());
                    
                    // Mapear el jefe si existe
                    if (departamento.getJefe() != null) {
                        PersonaDTO jefeDTO = new PersonaDTO();
                        Persona jefe = departamento.getJefe();
                        
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
                    
                    return dto;
                })
                .collect(Collectors.toList());

        // Invertir el orden de la lista
        Collections.reverse(departamentosDTO);

        logger.info("Se han listado {} departamentos activos", departamentosDTO.size());
        return departamentosDTO;
        
    } catch (Exception e) {
        logger.error("Error al listar los departamentos: {}", e.getMessage());
        throw e;
    }
}
// Método para obtener departamentos activos paginados
public Page<DepartamentoDTO> obtenerDepartamentosDTOPaginados(Pageable pageable) {
    try {
        logger.info("Obteniendo departamentos activos paginados...");
        Page<Departamento> departamentosPage = repository.findByActivoTrue(pageable);

        // Mapear manualmente cada entidad Departamento a DepartamentoDTO
        Page<DepartamentoDTO> departamentosDTOPage = departamentosPage.map(departamento -> {
            DepartamentoDTO dto = new DepartamentoDTO();
            
            // Mapear atributos heredados de UnidadDTO
            dto.setId(departamento.getId());
            dto.setCodigo(departamento.getCodigo());
            dto.setNombre(departamento.getNombre());
            dto.setTelefonoContacto(departamento.getTelefonoContacto());
            dto.setCorreoContacto(departamento.getCorreoContacto());
            dto.setDireccionWeb(departamento.getDireccionWeb());
            dto.setTipo(departamento.getTipo());
            
            // Mapear atributos propios de DepartamentoDTO
            dto.setActivo(departamento.isActivo());
            
            // Mapear el jefe si existe
            if (departamento.getJefe() != null) {
                PersonaDTO jefeDTO = new PersonaDTO();
                Persona jefe = departamento.getJefe();
                
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
            
            return dto;
        });

        logger.info("Se obtuvieron {} departamentos activos en la página {}",
                departamentosDTOPage.getTotalElements(), pageable.getPageNumber());
        return departamentosDTOPage;
        
    } catch (Exception e) {
        logger.error("Error al obtener departamentos paginados: {}", e.getMessage());
        throw e;
    }
}
//!OBTENER POR ID
    public DepartamentoDTO obtenerDepartamentoPorId(Long id) {
        try {
            logger.info("Buscando departamento con ID: {}", id);
            modelMapper = new ModelMapper();
            Optional<Departamento> departamentoOptional = repository.findById(id);

            if (departamentoOptional.isPresent()) {
                Departamento departamento = departamentoOptional.get();
                DepartamentoDTO departamentoDTO = modelMapper.map(departamento, DepartamentoDTO.class);

                // Mapear el jefe a PersonaDTO
                if (departamento.getJefe() != null) {
                    departamentoDTO.setJefe(modelMapper.map(departamento.getJefe(), PersonaDTO.class));
                }

                logger.info("Departamento encontrado con ID: {}", id);
                return departamentoDTO;
            }

            logger.warn("Departamento no encontrado con ID: {}", id);
            return null;
        } catch (Exception e) {
            logger.error("Error al obtener el departamento con ID: {}", e.getMessage());
            throw e;
        }
    }

//!ACTUALIZAR
    public DepartamentoDTO actualizarDepartamento(Long id, DepartamentoDTO departamentoDTOActualizado) {
        try {
            logger.info("Actualizando departamento con ID: {}", id);
            modelMapper = new ModelMapper();
            Optional<Departamento> departamentoOptional = repository.findById(id);

            if (departamentoOptional.isPresent()) {
                Departamento departamentoExistente = departamentoOptional.get();

                // Actualizar campos básicos
                departamentoExistente.setCodigo(departamentoDTOActualizado.getCodigo());
                departamentoExistente.setNombre(departamentoDTOActualizado.getNombre());
                departamentoExistente.setCorreoContacto(departamentoDTOActualizado.getCorreoContacto());
                departamentoExistente.setDireccionWeb(departamentoDTOActualizado.getDireccionWeb());
                departamentoExistente.setTelefonoContacto(departamentoDTOActualizado.getTelefonoContacto());

                // Actualizar el jefe
                /* 
                if (departamentoDTOActualizado.getJefe() != null) {
                    Persona jefe = modelMapper.map(departamentoDTOActualizado.getJefe(), Persona.class);
                    departamentoExistente.setJefe(jefe);
                }
                */

                actualizarJefeDeDepartamento(departamentoDTOActualizado,departamentoExistente);
                departamentoExistente = repository.save(departamentoExistente);

                logger.info("Departamento con ID: {} actualizado con éxito", id);
                return modelMapper.map(departamentoExistente, DepartamentoDTO.class);
            }

            logger.warn("No se encontró el departamento con ID: {}", id);
            return null;
        } catch (Exception e) {
            logger.error("Error al actualizar el departamento con ID: {}", e.getMessage());
            throw e;
        }
    }


    public void actualizarJefeDeDepartamento(DepartamentoDTO departamentoDTOActualizado,Departamento departamentoExistente){
        // Comprobar si ha cambiado el director de carrera
        if (departamentoDTOActualizado.getJefe() != null) {
            // Verificar si el secretario académico ha cambiado
            if (departamentoExistente.getJefe() == null || 
                !departamentoExistente.getJefe().getId().equals(departamentoDTOActualizado.getJefe().getId())) {

                // Si hay un secretario académico anterior, eliminar su rol
                if (departamentoExistente.getJefe() != null) {
                    PersonaRolUnidad personaRolUnidadAnterior = personaRolUnidadService.obtenerPorPersonaYUnidad(
                        departamentoExistente.getJefe(), departamentoExistente);
                    if (personaRolUnidadAnterior != null) {
                        logger.info("Eliminando el rol del antiguo jefe de departamento...");
                        personaRolUnidadAnterior.setEstado(false);  // Desactivamos la relación
                        personaRolUnidadService.insertar(personaRolUnidadAnterior);  // Actualizamos el registro
                    }
                }

                // Asignar el nuevo jefe departamento
                Persona nuevoJefeDepartamento= modelMapper.map(departamentoDTOActualizado.getJefe(), Persona.class);
                departamentoExistente.setJefe(nuevoJefeDepartamento);

                // Asignar el rol de "DIRECTOR DE CARRERA" al director de carrera
                Rol jefeDepartamentoRol = rolService.obtenerRolPorNombre("JEFE DE DEPARTAMENTO");
                if (jefeDepartamentoRol != null) {
                    PersonaRolUnidad personaRolUnidadNuevo = new PersonaRolUnidad();
                    personaRolUnidadNuevo.setPersona(nuevoJefeDepartamento);
                    personaRolUnidadNuevo.setRol(jefeDepartamentoRol);
                    personaRolUnidadNuevo.setUnidad(departamentoExistente);
                    personaRolUnidadNuevo.setEstado(true);  // Estado activo
                    personaRolUnidadService.insertar(personaRolUnidadNuevo);
                } else {
                    logger.error("No se encontró el rol 'JEFE DE DEPARTAMENTO'.");
                    throw new RuntimeException("No se encontró el rol 'JEFE DE DEPARTAMENTO'.");
                }
            }
        } else {
            // Si no se especifica un secretario académico, lo eliminamos de la facultad
            departamentoExistente.setJefe(null);
        }

    }   

//!BUSCAR POR NOMBRE
    public List<DepartamentoDTO> buscarDepartamentoPorNombre(String nombre) {
        try {
            logger.info("Buscando departamentos que contienen el nombre: {}", nombre);
            modelMapper = new ModelMapper();
            List<DepartamentoDTO> departamentos = repository.findAll().stream()
                    .filter(departamento -> departamento.isActivo() && departamento.getNombre().contains(nombre))
                    .map(departamento -> {
                        DepartamentoDTO departamentoDTO = modelMapper.map(departamento, DepartamentoDTO.class);

                        // Mapear el jefe a PersonaDTO
                        if (departamento.getJefe() != null) {
                            departamentoDTO.setJefe(modelMapper.map(departamento.getJefe(), PersonaDTO.class));
                        }
                        return departamentoDTO;
                    })
                    .collect(Collectors.toList());

            logger.info("Se encontraron {} departamentos que coinciden con el nombre: {}", departamentos.size(), nombre);
            return departamentos;
        } catch (Exception e) {
            logger.error("Error al buscar departamentos por nombre: {}", e.getMessage());
            throw e;
        }
    }

//!ELIMINAR
    public boolean eliminarDepartamento(Long id) {
        try {
            logger.info("Intentando eliminar el departamento con ID: {}", id);
            modelMapper = new ModelMapper();
            Optional<Departamento> departamentoOptional = repository.findById(id);

            if (departamentoOptional.isPresent()) {
                Departamento departamento = departamentoOptional.get();
                departamento.setActivo(false);
                departamento.setJefe(null);
                repository.save(departamento);

                logger.info("Departamento con ID: {} eliminado con éxito", id);
                return true;
            }

            logger.warn("No se encontró el departamento con ID: {}", id);
            return false;
        } catch (Exception e) {
            logger.error("Error al eliminar el departamento con ID: {}", e.getMessage());
            throw e;
        }
    }

    //! EXISTE POR CÓDIGO
    public boolean existeDepartamentoPorCodigo(String codigo) {
        try {
            logger.info("Verificando existencia de departamento con código: {}", codigo);
            boolean existe = repository.existsByCodigoAndActivoTrue(codigo);
            logger.info("Resultado de existencia por código '{}': {}", codigo, existe);
            return existe;
        } catch (Exception e) {
            logger.error("Error al verificar existencia de departamento por código '{}': {}", codigo, e.getMessage(), e);
            throw e; // Lanzar la excepción para que el controlador maneje el error
        }
    }

//! EXISTE POR NOMBRE
    public boolean existeDepartamentoPorNombre(String nombre) {
        try {
            logger.info("Verificando existencia de departamento con nombre: {}", nombre);
            // Adaptar el repositorio si no hay un método similar; aquí se simula la búsqueda.
            boolean existe = repository.findAll().stream()
                    .anyMatch(departamento -> departamento.isActivo() && departamento.getNombre().equalsIgnoreCase(nombre));
            logger.info("Resultado de existencia por nombre '{}': {}", nombre, existe);
            return existe;
        } catch (Exception e) {
            logger.error("Error al verificar existencia de departamento por nombre '{}': {}", nombre, e.getMessage(), e);
            throw e; // Lanzar la excepción para que el controlador maneje el error
        }
    }

//! EXISTE JEFE POR ID
    public boolean existeDepartamentoPorIdJeje(Long id) {
        try {
            logger.info("Verificando existencia de departamento con jefe ID: {}", id);
            boolean existe = repository.findAll().stream()
                    .anyMatch(departamento -> departamento.isActivo() && departamento.getJefe() != null && departamento.getJefe().getId().equals(id));
            logger.info("Resultado de existencia de jefe por ID '{}': {}", id, existe);
            return existe;
        } catch (Exception e) {
            logger.error("Error al verificar existencia de jefe con ID '{}': {}", id, e.getMessage(), e);
            throw e; // Lanzar la excepción para que el controlador maneje el error
        }
    }
}
