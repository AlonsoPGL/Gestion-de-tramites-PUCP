package pe.edu.pucp.onepucp.solicitudes.service;

import java.util.ArrayList;
import java.util.Optional;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import pe.edu.pucp.onepucp.institucion.controller.DepartamentoController;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.repository.EspecialidadRepository;
import pe.edu.pucp.onepucp.institucion.repository.UnidadRepository;
import pe.edu.pucp.onepucp.institucion.service.EspecialidadService;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.repository.AlumnoRepository;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO;

import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudTemaTesisDTO;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoAprobacion;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudTemaTesis;
import pe.edu.pucp.onepucp.solicitudes.model.Tesis;
import pe.edu.pucp.onepucp.solicitudes.model.TipoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.repository.ComentarioTesisRepository;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudTemaTesisRepository;
import pe.edu.pucp.onepucp.solicitudes.repository.TesisRepository;
import org.modelmapper.ModelMapper;

@Service
public class SolicitudTemaTesisService {

    @Autowired
    private SolicitudTemaTesisRepository repository;

    @Autowired
    private TesisRepository tesisRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private ComentarioTesisRepository comentarioTesisRepository;
    private static final Logger logger = LoggerFactory.getLogger(EspecialidadService.class); // Logger 

    ModelMapper modelMapper;

    public void actualizarEstadoSolicitud(Long id, EstadoAprobacion estado) {
        SolicitudTemaTesis solicitudTemaTesis = repository.findById(id).orElseThrow(()
                -> new RuntimeException("Envío no encontrado"));
        solicitudTemaTesis.setEstadoAprobacion(estado);
        repository.save(solicitudTemaTesis);
    }

    public List<SolicitudTemaTesis> listarSolicitudesPorIdEspecialidad(Long idEspecialidad) {
        return repository.findByTesisEspecialidadId(idEspecialidad);
    }

    public SolicitudTemaTesisDTO insertarSolicitudTemaTesis(Long unidadId, SolicitudTemaTesisDTO solicitudTemaTesisDTO) {
        try {
            modelMapper = new ModelMapper();
            Especialidad especialidad = especialidadRepository.findById(unidadId)
            .orElseThrow(() -> new RuntimeException("Especialidad con ID " + unidadId + " no encontrada."));
            // Validar que el alumno no tenga una solicitud de tema de tesis
            SolicitudTemaTesis solicitudTemaTesisExistente = repository.findByEmisorId(solicitudTemaTesisDTO.getEmisor().getId());
    
            if (solicitudTemaTesisExistente != null) {
                if (solicitudTemaTesisDTO.getTesis() != null) {
                    solicitudTemaTesisExistente.getTesis().setJurados(null);
                    LoggerFactory.getLogger(DepartamentoController.class).info("Tesis: {}", solicitudTemaTesisDTO.getTesis());
                }
                solicitudTemaTesisExistente.setEstadoAprobacion(EstadoAprobacion.EN_REVISION_POR_ASESOR);
                SolicitudTemaTesis solicitudTemaTesisActualizada = actualizarSolicitudTemaTesis(
                        solicitudTemaTesisExistente.getId(),
                        modelMapper.map(solicitudTemaTesisDTO, SolicitudTemaTesis.class)
                );
                return modelMapper.map(solicitudTemaTesisActualizada, SolicitudTemaTesisDTO.class);
            }
    
            // Crear nueva instancia y mapear datos básicos
            SolicitudTemaTesis nuevaSolicitudTemaTesis = modelMapper.map(solicitudTemaTesisDTO, SolicitudTemaTesis.class);
    
            // Establecer campos específicos que no vienen en el DTO
            nuevaSolicitudTemaTesis.setAprobadoPorAsesor(false);
            nuevaSolicitudTemaTesis.setAprobadoPorCoordinador(false);
            nuevaSolicitudTemaTesis.setAprobadoPorDirector(false);
            nuevaSolicitudTemaTesis.setComentarios(null);
            nuevaSolicitudTemaTesis.setObservacion(null);
            nuevaSolicitudTemaTesis.setTipo(TipoSolicitud.SOLICITUD_TEMA_TESIS);
            nuevaSolicitudTemaTesis.setEstadoAprobacion(EstadoAprobacion.EN_REVISION_POR_ASESOR);
    
            // Establecer relaciones
            if (solicitudTemaTesisDTO.getAlumno() != null) {
                Alumno alumno = modelMapper.map(solicitudTemaTesisDTO.getEmisor(), Alumno.class);
                nuevaSolicitudTemaTesis.setAlumno(alumno);
            }
            
            if (solicitudTemaTesisDTO.getReceptor() != null) {
                Persona receptor = modelMapper.map(solicitudTemaTesisDTO.getReceptor(), Persona.class);
                nuevaSolicitudTemaTesis.setReceptor(receptor);
            }
            
            if (solicitudTemaTesisDTO.getEmisor() != null) {
                Persona emisor = modelMapper.map(solicitudTemaTesisDTO.getEmisor(), Persona.class);
                nuevaSolicitudTemaTesis.setEmisor(emisor);
            }
    
            nuevaSolicitudTemaTesis.setCorreo(solicitudTemaTesisDTO.getCorreo());
            nuevaSolicitudTemaTesis.setMotivo(solicitudTemaTesisDTO.getMotivo());
            nuevaSolicitudTemaTesis.setEstado(solicitudTemaTesisDTO.getEstado());
            nuevaSolicitudTemaTesis.setFechaCreacion(solicitudTemaTesisDTO.getFechaCreacion());
            nuevaSolicitudTemaTesis.setObservacion(null); 
            if (solicitudTemaTesisDTO.getDocumento() != null) {
                nuevaSolicitudTemaTesis.setDocumento(solicitudTemaTesisDTO.getDocumento());
            }
    
            nuevaSolicitudTemaTesis.setTipo(solicitudTemaTesisDTO.getTipo());
    
            // Manejar la tesis si es una nueva solicitud
            if (solicitudTemaTesisExistente == null && solicitudTemaTesisDTO.getTesis() != null) {
                try {
                    // Crear y guardar la tesis
                    Tesis tesis = new Tesis();
                    tesis.setTitulo(solicitudTemaTesisDTO.getTesis().getTitulo());
                    tesis.setDocumento(solicitudTemaTesisDTO.getDocumento());
    
                    List<Persona> asesores = new ArrayList<>();
                    for (PersonaDTO asesorDTO : solicitudTemaTesisDTO.getTesis().getAsesores()) {
                        asesores.add(modelMapper.map(asesorDTO, Persona.class));
                    }
                    tesis.setAsesores(asesores);
    
                    // Asignar los integrantes
                    if (solicitudTemaTesisDTO.getTesis().getIntegrantes() != null) {
                        List<Alumno> integrantes = new ArrayList<>();
                        for (AlumnoDTO integranteDTO : solicitudTemaTesisDTO.getTesis().getIntegrantes()) {
                            Optional<Alumno> al = alumnoRepository.findById(integranteDTO.getId());
                            if (al.isPresent()) {
                                integrantes.add(al.get());
                            } else {
                                // Maneja el caso en el que no se encuentra el alumno
                                logger.warn("No se encontró el alumno con ID: {}", integranteDTO.getId());
                            }
                        }
                        tesis.setIntegrantes(integrantes);
                    }
                    tesis.setEspecialidad(especialidad);
                    tesis.setDocumento(solicitudTemaTesisDTO.getDocumento());
                    // Guardar la tesis
                    tesisRepository.save(tesis);
                    logger.info("Tesis guardada correctamente: {}", tesis.getTitulo());
    
                    // Asignar la tesis a la solicitud
                    nuevaSolicitudTemaTesis.setTesis(tesis);
    
                    // Actualizar a los alumnos con la tesis guardada
                    for (Alumno a : tesis.getIntegrantes()) {
                        a.setTesis(tesis); // Asignar la tesis al alumno
                        alumnoRepository.save(a); // Guardar el alumno
                    }
    
                } catch (Exception e) {
                    logger.error("Error al crear la tesis: {}", e.getMessage());
                    throw new RuntimeException("Error al crear la tesis", e);
                }
            }
    
            // Guardar la solicitud
            SolicitudTemaTesis solicitudGuardada = repository.save(nuevaSolicitudTemaTesis);
            logger.info("Solicitud de tema de tesis guardada correctamente: {}", solicitudGuardada.getId());
    
            // Convertir y retornar DTO
            return modelMapper.map(solicitudGuardada, SolicitudTemaTesisDTO.class);
    
        } catch (Exception e) {
            logger.error("Error al procesar la solicitud de tema de tesis: {}", e.getMessage());
            throw new RuntimeException("Error al procesar la solicitud de tema de tesis", e);
        }
    }
    
    //!LISTAR
    //?Listar todos
    public ArrayList<SolicitudTemaTesis> listarSolicitudesTemaTesis() {
        return (ArrayList<SolicitudTemaTesis>) repository.findAll();
    }

    //!BUSCAR POR ID SolicitudTemaTesis
    public Optional<SolicitudTemaTesis> buscarSolicitudTemaTesisPorId(Long id) {
        Optional<SolicitudTemaTesis> solicitudTemaTesisOptional = repository.findById(id);
        if (solicitudTemaTesisOptional.isPresent()) {
            return solicitudTemaTesisOptional;
        } else {
            return Optional.empty();
        }
    }
    public Optional<SolicitudTemaTesis> buscarSolicitudTemaTesisPorTesis(Long id) {
        Optional<SolicitudTemaTesis> solicitudTemaTesisOptional = repository.findByTesisId(id);
        if (solicitudTemaTesisOptional.isPresent()) {
            return solicitudTemaTesisOptional;
        } else {
            return Optional.empty();
        }
    }
    //!BUSCAR DOCUMENTOS_SOLICITUD_TESIS_POR_ID_SOLICITUD
    public byte[] buscarDocumentoSolicitudTesisPorId(Long id) {
        SolicitudTemaTesis solicitudTemaTesis = repository.findById(id).orElseThrow(()
                -> new RuntimeException("Envío no encontrado"));
        return solicitudTemaTesis.getDocumento();
    }

    //!BUSCAR ESTADO_SOLICITUD_POR_ID_SOLICITUD
    public EstadoAprobacion buscarEstadoSolicitudPorId(Long id) {
        SolicitudTemaTesis solicitudTemaTesis = repository.findById(id).orElseThrow(()
                -> new RuntimeException("Envío no encontrado"));
        return solicitudTemaTesis.getEstadoAprobacion();
    }

    //!BUSCAR POR ID ALUMNO
    public SolicitudTemaTesis buscarSolicitudTemaTesisPorIdAlumno(Long id) {

        SolicitudTemaTesis solicitudTemaTesis = repository.findByEmisorId(id);
        if (solicitudTemaTesis != null) {
            solicitudTemaTesis.setDocumento(null);
        } else {
            return solicitudTemaTesis;
        }
        return solicitudTemaTesis;
    }

    //!BUSCAR POS ID TESIS  DOCUMENTO_SOLICITUD_TESIS
    public byte[] buscarDocumentoSolicitudTesis(Long id) {
        SolicitudTemaTesis solicitudTemaTesis = repository.findById(id).orElseThrow(()
                -> new RuntimeException("Envío no encontrado"));
        return solicitudTemaTesis.getDocumento();
    }

    //!LISTAR POR ASESOR
    public ArrayList<SolicitudTemaTesis> listarSolicitudesPorIdAsesor(Long id) {
        ArrayList<SolicitudTemaTesis> solicitudes = listarSolicitudesTemaTesis();
        ArrayList<SolicitudTemaTesis> solicitudesPorAsesor = new ArrayList<>();
        for (SolicitudTemaTesis solicitud : solicitudes) {
            if (solicitud.getTesis() != null) {
                if (solicitud.getTesis().getAsesores() != null) {
                    for (Persona asesor : solicitud.getTesis().getAsesores()) {
                        // Comparar el ID del asesor con el ID proporcionado
                        if (asesor.getId().equals(id)) { // Suponiendo que 'getId()' devuelve un Long
                            solicitudesPorAsesor.add(solicitud);
                            break; // Salimos del bucle si encontramos una coincidencia
                        }
                    }
                }
            }
        }

        return solicitudesPorAsesor;
    }

    //!LISTAR POR DIRECTOR
    public ArrayList<SolicitudTemaTesis> listarSolicitudesPorId(Long id) {
        ArrayList<SolicitudTemaTesis> solicitudes = listarSolicitudesTemaTesis();
        ArrayList<SolicitudTemaTesis> solicitudesPorDirector = new ArrayList<>();
        for (SolicitudTemaTesis solicitud : solicitudes) {
            if (solicitud.getEmisor() != null
                    && solicitud.getEmisor().getEspecialidad() != null
                    && solicitud.getEmisor().getEspecialidad().getId().equals(id)) {

                solicitudesPorDirector.add(solicitud);
            }
        }

        return solicitudesPorDirector;
    }

    //!ACTUALIZAR
    public SolicitudTemaTesis actualizarSolicitudTemaTesis(Long id, SolicitudTemaTesis solicitudTemaTesis) {
        Optional<SolicitudTemaTesis> solicitudTemaTesisOptional = repository.findById(id);
        if (solicitudTemaTesisOptional.isPresent()) {
            SolicitudTemaTesis solicitudTemaTesisAActualizar = solicitudTemaTesisOptional.get();

            // Actualizar campos específicos de SolicitudTemaTesis
            solicitudTemaTesisAActualizar.setAprobadoPorAsesor(solicitudTemaTesis.isAprobadoPorAsesor());
            solicitudTemaTesisAActualizar.setAprobadoPorCoordinador(solicitudTemaTesis.isAprobadoPorCoordinador());
            solicitudTemaTesisAActualizar.setAprobadoPorDirector(solicitudTemaTesis.isAprobadoPorDirector());

            //!Crea un nueva lista de comentarios de tesis
            solicitudTemaTesisAActualizar.setEstadoAprobacion(solicitudTemaTesis.getEstadoAprobacion());

            // Actualizar el id para actualizar la tesis 
            if (solicitudTemaTesisAActualizar.getTesis() != null) {
                solicitudTemaTesis.getTesis().setId(solicitudTemaTesisAActualizar.getTesis().getId());
                //!Log para verificar que  tesis se esta mandando
                LoggerFactory.getLogger(DepartamentoController.class).info("Tesis: {}", solicitudTemaTesis.getTesis());
            }

            solicitudTemaTesisAActualizar.setTesis(solicitudTemaTesis.getTesis());
            solicitudTemaTesisAActualizar.getTesis().setAsesores(solicitudTemaTesis.getTesis().getAsesores());
            solicitudTemaTesisAActualizar.getTesis().setIntegrantes(solicitudTemaTesis.getTesis().getIntegrantes());
            solicitudTemaTesisAActualizar.getTesis().setJurados(solicitudTemaTesis.getTesis().getJurados());
            solicitudTemaTesisAActualizar.getTesis().setTitulo(solicitudTemaTesis.getTesis().getTitulo());

            tesisRepository.save(solicitudTemaTesisAActualizar.getTesis());
            //!Eliminar comentarios de tesis
            if (solicitudTemaTesisAActualizar.getEstadoAprobacion().equals(EstadoAprobacion.EN_REVISION_POR_ASESOR)) {
                //actualizar estado de comentarios de tesis a inactivo
                for (int i = 0; i < solicitudTemaTesisAActualizar.getComentarios().size(); i++) {
                    solicitudTemaTesisAActualizar.getComentarios().get(i).setActivo(false);
                    comentarioTesisRepository.save(solicitudTemaTesisAActualizar.getComentarios().get(i));
                }
            }
            solicitudTemaTesisAActualizar.setComentarios(null);
            // Actualizar campos heredados de Solicitud
            solicitudTemaTesisAActualizar.setEmisor(solicitudTemaTesis.getEmisor());
            solicitudTemaTesisAActualizar.setReceptor(solicitudTemaTesis.getReceptor());
            solicitudTemaTesisAActualizar.setCorreo(solicitudTemaTesis.getCorreo());
            solicitudTemaTesisAActualizar.setMotivo(solicitudTemaTesis.getMotivo());
            solicitudTemaTesisAActualizar.setEstado(solicitudTemaTesis.getEstado());
            solicitudTemaTesisAActualizar.setFechaCreacion(solicitudTemaTesis.getFechaCreacion());
            solicitudTemaTesisAActualizar.setObservacion(solicitudTemaTesis.getObservacion());
            solicitudTemaTesisAActualizar.setDocumento(solicitudTemaTesis.getDocumento());
            solicitudTemaTesisAActualizar.setTipo(solicitudTemaTesis.getTipo());

            // Guardar en la base de datos
            return repository.save(solicitudTemaTesisAActualizar);
        } else {
            return null;
        }
    }
}
