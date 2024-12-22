package pe.edu.pucp.onepucp.institucion.service;

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

import pe.edu.pucp.onepucp.institucion.dto.CursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO;
import pe.edu.pucp.onepucp.institucion.dto.PlanDeEstudioDTO;
import pe.edu.pucp.onepucp.institucion.dto.PlanDeEstudioXCursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.SeccionDTOInsersion;
import pe.edu.pucp.onepucp.institucion.model.Curso;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.institucion.model.PlanDeEstudio;
import pe.edu.pucp.onepucp.institucion.model.PlanDeEstudioXCurso;
import pe.edu.pucp.onepucp.institucion.model.Seccion;
import pe.edu.pucp.onepucp.institucion.repository.CursoRepository;
import pe.edu.pucp.onepucp.institucion.repository.PlanDeEstudioRepository;
import pe.edu.pucp.onepucp.institucion.repository.PlanDeEstudioXCursoRepository;
@Service
public class PlanDeEstudioXCursoService {

    private static final Logger logger = LoggerFactory.getLogger(PlanDeEstudioXCursoService.class);
    
    @Autowired
    private PlanDeEstudioXCursoRepository planDeEstudioXCursoRepository;
    
    @Autowired
    private PlanDeEstudioRepository planDeEstudioRepository;
    
    @Autowired
    private CursoRepository cursoRepository;
    
    @Autowired
    private CursoService cursoService;
    
    private ModelMapper modelMapper = new ModelMapper();

    @Transactional
    public PlanDeEstudioXCursoDTO insertarPlanDeEstudioXCurso(PlanDeEstudioXCursoDTO planDeEstudioXCursoDTO) {
        try {
            logger.info("Iniciando inserción de la relación plan de estudio-curso");

            // Crear una nueva instancia en lugar de usar ModelMapper
            PlanDeEstudioXCurso planDeEstudioXCurso = new PlanDeEstudioXCurso();
            planDeEstudioXCurso.setCiclo(planDeEstudioXCursoDTO.getCiclo());
            planDeEstudioXCurso.setEsElectivo(planDeEstudioXCursoDTO.isEsElectivo());

            planDeEstudioXCurso.setActivo(true);
            planDeEstudioXCurso.setCantHorarios(planDeEstudioXCursoDTO.getCantHorarios());

        // Verificar y establecer el plan de estudio
            if (planDeEstudioXCursoDTO.getPlanDeEstudio() != null && 
                planDeEstudioXCursoDTO.getPlanDeEstudio().getIdPlanDeEstudio() != null) {
                PlanDeEstudio planDeEstudio = planDeEstudioRepository
                    .findById(planDeEstudioXCursoDTO.getPlanDeEstudio().getIdPlanDeEstudio())
                    .orElseThrow(() -> {
                        logger.error("Plan de estudio no encontrado");
                        return new RuntimeException("Plan de estudio no encontrado");
                    });
                planDeEstudioXCurso.setPlanDeEstudio(planDeEstudio);
            }

            // Crear el curso
            CursoDTO cursoDTO = planDeEstudioXCursoDTO.getCurso();
            CursoDTO nuevoCurso = cursoService.insertarCurso(cursoDTO);
            if (nuevoCurso == null) {
                logger.error("Error al insertar el curso");
                throw new RuntimeException("Error al insertar el curso");
            }

            // Verificar y establecer el curso
            if (nuevoCurso != null && nuevoCurso.getIdCurso() != null) {
                Optional<Curso> curso = cursoRepository.findById(nuevoCurso.getIdCurso());
                if (curso.isPresent()) {
                    planDeEstudioXCurso.setCurso(curso.get());
                } else {
                    logger.error("Curso no encontrado");
                    throw new RuntimeException("Curso no encontrado");
                }
            }
            // Establecer activo por defecto
            planDeEstudioXCurso.setActivo(true);

            // Guardar la relación
            planDeEstudioXCurso = planDeEstudioXCursoRepository.save(planDeEstudioXCurso);
            // Configurar ModelMapper para la conversión a DTO
            ModelMapper dtoMapper = new ModelMapper();
            dtoMapper.getConfiguration()
                .setPropertyCondition(context -> context.getSource() != null)
                .setSkipNullEnabled(true);
                
            // Convertir manualmente para evitar referencias circulares
            PlanDeEstudioXCursoDTO resultDTO = new PlanDeEstudioXCursoDTO();
            resultDTO.setId(planDeEstudioXCurso.getId());
            resultDTO.setCiclo(planDeEstudioXCurso.getCiclo());
            // resultDTO.setEsElectivo(planDeEstudioXCurso.getEs());
            resultDTO.setActivo(planDeEstudioXCurso.isActivo());
            
            // Mapear curso sin referencias circulares
            if (planDeEstudioXCurso.getCurso() != null) {
                CursoDTO cursoDTO2 = new CursoDTO();
                cursoDTO2.setIdCurso(planDeEstudioXCurso.getCurso().getIdCurso());
                cursoDTO2.setCodigo(planDeEstudioXCurso.getCurso().getCodigo());
                cursoDTO2.setNombre(planDeEstudioXCurso.getCurso().getNombre());
                cursoDTO2.setCreditos(planDeEstudioXCurso.getCurso().getCreditos());
                cursoDTO2.setActivo(planDeEstudioXCurso.getCurso().isActivo());
                //!Ahora con la seccion
                cursoDTO2.setTiene_laboratorio(planDeEstudioXCurso.getCurso().isTiene_laboratorio());
                cursoDTO2.setTiene_practica(planDeEstudioXCurso.getCurso().isTiene_practica());
                cursoDTO2.setTiene_clase(planDeEstudioXCurso.getCurso().isTiene_clase());
                cursoDTO2.setTiene_examen(planDeEstudioXCurso.getCurso().isTiene_examen());
                // Sección
                if (planDeEstudioXCurso.getCurso().getSeccion() != null) {
                    SeccionDTOInsersion seccionDTO = new SeccionDTOInsersion();
                    seccionDTO.setId(planDeEstudioXCurso.getCurso().getSeccion().getId());
                    cursoDTO2.setSeccion(seccionDTO);
                }
 
                resultDTO.setCurso(cursoDTO2);
            }

            // Mapear plan de estudio sin referencias circulares
            if (planDeEstudioXCurso.getPlanDeEstudio() != null) {
                PlanDeEstudioDTO planDTO = new PlanDeEstudioDTO();
                planDTO.setIdPlanDeEstudio(planDeEstudioXCurso.getPlanDeEstudio().getIdPlanDeEstudio());
                planDTO.setNombre(planDeEstudioXCurso.getPlanDeEstudio().getNombre());
                resultDTO.setPlanDeEstudio(planDTO);
            }

            logger.info("Relación plan de estudio-curso insertada correctamente");
            return resultDTO;

        } catch (Exception e) {
            logger.error("Error al insertar la relación plan de estudio-curso: " + e.getMessage());
            throw new RuntimeException("Error al insertar la relación plan de estudio-curso: " + e.getMessage());
        }
    }

    @Transactional
    public PlanDeEstudioXCursoDTO actualizarPlanDeEstudioXCurso(Long id, PlanDeEstudioXCursoDTO planDeEstudioXCursoDTO) {
        try {
            logger.info("Iniciando actualización de la relación plan de estudio-curso con id: {}", id);
    
            Optional<PlanDeEstudioXCurso> planXCursoExistenteOpt = planDeEstudioXCursoRepository.findById(id);
            if (planXCursoExistenteOpt.isPresent()) {
                PlanDeEstudioXCurso planXCursoExistente = planXCursoExistenteOpt.get();
    
                // Actualizar ciclo si se proporciona
                if (planDeEstudioXCursoDTO.getCiclo() > 0) {
                    planXCursoExistente.setCiclo(planDeEstudioXCursoDTO.getCiclo());
                }
    
                // Actualizar esElectivo si se proporciona
                planXCursoExistente.setEsElectivo(planDeEstudioXCursoDTO.isEsElectivo());
                planXCursoExistente.setActivo(true);
    
                // Actualizar plan de estudio si se proporciona
                if (planDeEstudioXCursoDTO.getPlanDeEstudio() != null && 
                    planDeEstudioXCursoDTO.getPlanDeEstudio().getIdPlanDeEstudio() != null) {
                    PlanDeEstudio planDeEstudio = planDeEstudioRepository
                        .findById(planDeEstudioXCursoDTO.getPlanDeEstudio().getIdPlanDeEstudio())
                        .orElseThrow(() -> new RuntimeException("Plan de estudio no encontrado"));
                    planXCursoExistente.setPlanDeEstudio(planDeEstudio);
                }
    
                // Actualizar curso si se proporciona
                if (planDeEstudioXCursoDTO.getCurso() != null) {
                    CursoDTO cursoDTO = planDeEstudioXCursoDTO.getCurso();
                    CursoDTO cursoActualizado = cursoService.actualizarCursoParcial(cursoDTO.getIdCurso(), cursoDTO);
                    
                    if (cursoActualizado != null) {
                        Curso curso = cursoRepository.findById(cursoActualizado.getIdCurso())
                            .orElseThrow(() -> new RuntimeException("Curso no encontrado después de actualizar"));
                        planXCursoExistente.setCurso(curso);
                    }
                }
    
                // Guardar cambios
                PlanDeEstudioXCurso planXCursoActualizado = planDeEstudioXCursoRepository.save(planXCursoExistente);
    
                // Convertir manualmente a DTO
                PlanDeEstudioXCursoDTO resultDTO = new PlanDeEstudioXCursoDTO();
                resultDTO.setId(planXCursoActualizado.getId());
                resultDTO.setCiclo(planXCursoActualizado.getCiclo());
                resultDTO.setEsElectivo(planXCursoActualizado.isEsElectivo());
                resultDTO.setActivo(planXCursoActualizado.isActivo());
    
                // Mapear curso
                if (planXCursoActualizado.getCurso() != null) {
                    CursoDTO cursoDTO = new CursoDTO();
                    cursoDTO.setIdCurso(planXCursoActualizado.getCurso().getIdCurso());
                    cursoDTO.setCodigo(planXCursoActualizado.getCurso().getCodigo());
                    cursoDTO.setNombre(planXCursoActualizado.getCurso().getNombre());
                    cursoDTO.setCreditos(planXCursoActualizado.getCurso().getCreditos());
                    cursoDTO.setActivo(planXCursoActualizado.getCurso().isActivo());
                    cursoDTO.setTiene_laboratorio(planXCursoActualizado.getCurso().isTiene_laboratorio());
                    cursoDTO.setTiene_practica(planXCursoActualizado.getCurso().isTiene_practica());
                    cursoDTO.setTiene_clase(planXCursoActualizado.getCurso().isTiene_clase());
                    cursoDTO.setTiene_examen(planXCursoActualizado.getCurso().isTiene_examen());
                    // Sección

                    if (planXCursoActualizado.getCurso().getSeccion() != null) {
                        SeccionDTOInsersion seccionDTO = new SeccionDTOInsersion();
                        seccionDTO.setId(planXCursoActualizado.getCurso().getSeccion().getId());
                        cursoDTO.setSeccion(seccionDTO);
                    }
                    resultDTO.setCurso(cursoDTO);
                }
    
                // Mapear plan de estudio
                if (planXCursoActualizado.getPlanDeEstudio() != null) {
                    PlanDeEstudioDTO planDTO = new PlanDeEstudioDTO();
                    planDTO.setIdPlanDeEstudio(planXCursoActualizado.getPlanDeEstudio().getIdPlanDeEstudio());
                    planDTO.setNombre(planXCursoActualizado.getPlanDeEstudio().getNombre());
                    resultDTO.setPlanDeEstudio(planDTO);
                }
    
                logger.info("Relación plan de estudio-curso actualizada correctamente");
                return resultDTO;
            }
            return null;
        } catch (Exception e) {
            logger.error("Error al actualizar la relación plan de estudio-curso: " + e.getMessage());
            throw new RuntimeException("Error al actualizar la relación plan de estudio-curso: " + e.getMessage());
        }
    }

    @Transactional
    public boolean eliminarPlanDeEstudioXCurso(Long id) {
        try {
            logger.info("Iniciando eliminación de la relación plan de estudio-curso con id: {}", id);

            Optional<PlanDeEstudioXCurso> planXCursoOptional = planDeEstudioXCursoRepository.findById(id);
            if (planXCursoOptional.isPresent()) {
                PlanDeEstudioXCurso planXCurso = planXCursoOptional.get();
                planXCurso.setActivo(false);
                planDeEstudioXCursoRepository.save(planXCurso);
                logger.info("Relación plan de estudio-curso eliminada correctamente");
                return true;
            }
            return false;
        } catch (Exception e) {
            logger.error("Error al eliminar la relación plan de estudio-curso: " + e.getMessage());
            throw new RuntimeException("Error al eliminar la relación plan de estudio-curso: " + e.getMessage());
        }
    }
    //!LISTADO
    public Page<PlanDeEstudioXCursoDTO> listarCursosPorPlanDeEstudioId(Long idPlanDeEstudio, Pageable pageable) {
        try {
            logger.info("Listando cursos para el plan de estudio con id: {}", idPlanDeEstudio);

            Page<PlanDeEstudioXCurso> cursosPage = planDeEstudioXCursoRepository
                    .findCursosByPlanDeEstudioIdPlanDeEstudio(idPlanDeEstudio, pageable);
            
            return cursosPage.map(this::convertToDTO);
        } catch (Exception e) {
            logger.error("Error al listar los cursos del plan de estudio: " + e.getMessage());
            throw new RuntimeException("Error al listar los cursos del plan de estudio: " + e.getMessage());
        }
    }
    private PlanDeEstudioXCursoDTO convertToDTO(PlanDeEstudioXCurso entity) {
        PlanDeEstudioXCursoDTO dto = new PlanDeEstudioXCursoDTO();
        dto.setId(entity.getId());
        dto.setCantHorarios(entity.getCantHorarios());
        dto.setCiclo(entity.getCiclo());
        dto.setEsElectivo(entity.isEsElectivo());
        dto.setActivo(entity.isActivo());
        
        if(entity.getPlanDeEstudio() != null) {
            dto.setPlanDeEstudio(convertToPlanDeEstudioDTO(entity.getPlanDeEstudio()));
        }
        
        if(entity.getCurso() != null) {
            dto.setCurso(convertToCursoDTO(entity.getCurso()));
        }
        
        return dto;
    }

    private PlanDeEstudioDTO convertToPlanDeEstudioDTO(PlanDeEstudio planDeEstudio) {
        PlanDeEstudioDTO dto = new PlanDeEstudioDTO();
        dto.setIdPlanDeEstudio(planDeEstudio.getIdPlanDeEstudio());
        dto.setNombre(planDeEstudio.getNombre());
        dto.setActivo(planDeEstudio.isActivo());
        
        if(planDeEstudio.getEspecialidad() != null) {
            dto.setEspecialidad(convertToEspecialidadDTO(planDeEstudio.getEspecialidad()));
        }
        
        return dto;
    }

    private CursoDTO convertToCursoDTO(Curso curso) {
        CursoDTO dto = new CursoDTO();
        dto.setIdCurso(curso.getIdCurso());
        dto.setNombre(curso.getNombre());
        dto.setCodigo(curso.getCodigo());
        dto.setCreditos(curso.getCreditos());
        dto.setActivo(curso.isActivo());
        dto.setTiene_laboratorio(curso.isTiene_laboratorio());
        dto.setTiene_practica(curso.isTiene_practica());
        dto.setTiene_clase(curso.isTiene_clase());
        dto.setTiene_examen(curso.isTiene_examen());
        
        if(curso.getEspecialidad() != null) {
            dto.setEspecialidad(convertToEspecialidadDTO(curso.getEspecialidad()));
        }
        
        if(curso.getSeccion() != null) {
            dto.setSeccion(convertToSeccionDTO(curso.getSeccion()));
        }
        
        // Si necesitas mapear la lista de horarios
        if(curso.getHorarios() != null && !curso.getHorarios().isEmpty()) {
            dto.setHorarios(curso.getHorarios().stream()
                .map(this::convertToHorarioDTO)
                .collect(Collectors.toList()));
        }
        
        return dto;
    }

    private EspecialidadDTO convertToEspecialidadDTO(Especialidad especialidad) {
        EspecialidadDTO dto = new EspecialidadDTO();
        // Mapea los campos necesarios de Especialidad
        return modelMapper.map(especialidad, EspecialidadDTO.class); // Podemos usar modelMapper para entidades simples
    }

    private SeccionDTOInsersion convertToSeccionDTO(Seccion seccion) {
        SeccionDTOInsersion dto = new SeccionDTOInsersion();
        // Mapea los campos necesarios de Seccion
        return modelMapper.map(seccion, SeccionDTOInsersion.class); // Podemos usar modelMapper para entidades simples
    }

    private HorarioDTO convertToHorarioDTO(Horario horario) {
        HorarioDTO dto = new HorarioDTO();
        // Mapea los campos necesarios de Horario
        return modelMapper.map(horario, HorarioDTO.class); // Podemos usar modelMapper para entidades simples
    }
    //!FIN

    public Page<PlanDeEstudioXCursoDTO> listarCursosPorCicloYPlanDeEstudio(
            int ciclo, Long idPlanDeEstudio, Pageable pageable) {
        try {
            logger.info("Listando cursos para el ciclo {} y plan de estudio con id: {}", ciclo, idPlanDeEstudio);

            Page<PlanDeEstudioXCurso> cursosPage = planDeEstudioXCursoRepository
                .findCursosByCicloAndPlanDeEstudioId(ciclo, idPlanDeEstudio, pageable);
            return cursosPage.map(curso -> modelMapper.map(curso, PlanDeEstudioXCursoDTO.class));
        } catch (Exception e) {
            logger.error("Error al listar los cursos por ciclo: " + e.getMessage());
            throw new RuntimeException("Error al listar los cursos por ciclo: " + e.getMessage());
        }
    }

    public Page<PlanDeEstudioXCursoDTO> listarCursosElectivosPorPlanDeEstudio(
            Long idPlanDeEstudio, Pageable pageable) {
        try {
            logger.info("Listando cursos electivos para el plan de estudio con id: {}", idPlanDeEstudio);

            Page<PlanDeEstudioXCurso> cursosPage = planDeEstudioXCursoRepository
                .findCursosElectivosByPlanDeEstudioId(idPlanDeEstudio, pageable);
            return cursosPage.map(curso -> modelMapper.map(curso, PlanDeEstudioXCursoDTO.class));
        } catch (Exception e) {
            logger.error("Error al listar los cursos electivos: " + e.getMessage());
            throw new RuntimeException("Error al listar los cursos electivos: " + e.getMessage());
        }
    }

    public List<PlanDeEstudioXCursoDTO> obtenerPlanDeEstudioXCursoPorIdUnidad(Long idUnidad) {
        List<PlanDeEstudioXCurso> planDeEstudioXCursoList = planDeEstudioXCursoRepository.findByIdUnidad(idUnidad);

        return planDeEstudioXCursoList.stream()
                .map(curso -> modelMapper.map(curso, PlanDeEstudioXCursoDTO.class))
                .collect(Collectors.toList());
    }
}
