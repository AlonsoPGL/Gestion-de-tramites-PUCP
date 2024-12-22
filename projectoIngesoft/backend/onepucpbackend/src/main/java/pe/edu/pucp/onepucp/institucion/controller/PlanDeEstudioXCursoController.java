package pe.edu.pucp.onepucp.institucion.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.institucion.dto.PlanDeEstudioXCursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.RespuestaPlanDeEstudioXCurso;
import pe.edu.pucp.onepucp.institucion.dto.SeccionDTOInsersion;
import pe.edu.pucp.onepucp.institucion.repository.CursoRepository;
import pe.edu.pucp.onepucp.institucion.service.CursoService;
import pe.edu.pucp.onepucp.institucion.service.PlanDeEstudioService;
import pe.edu.pucp.onepucp.institucion.service.PlanDeEstudioXCursoService;
import pe.edu.pucp.onepucp.institucion.service.SeccionService;

@RestController
@RequestMapping("/institucion/planDeEstudioXCurso")
public class PlanDeEstudioXCursoController {

    private static final Logger logger = LoggerFactory.getLogger(PlanDeEstudioXCursoController.class);

    @Autowired
    private PlanDeEstudioXCursoService service;
    @Autowired
    private CursoService cursoService;
    @Autowired
    private PlanDeEstudioService planDeEstudioService;
    @Autowired
    private CursoRepository cursoRepository;


    @Autowired
    private SeccionService seccionService;
    @PostMapping("/insertar")
    public ResponseEntity<PlanDeEstudioXCursoDTO> insertarPlanDeEstudioXCurso(
            @RequestBody PlanDeEstudioXCursoDTO planDeEstudioXCursoDTO) {
        logger.info("Iniciando inserción de relación plan de estudio-curso. Plan ID: {}, Curso ID: {}",
                planDeEstudioXCursoDTO.getPlanDeEstudio() != null
                ? planDeEstudioXCursoDTO.getPlanDeEstudio().getIdPlanDeEstudio() : "null",
                planDeEstudioXCursoDTO.getCurso() != null
                ? planDeEstudioXCursoDTO.getCurso().getIdCurso() : "null");

        try {
            PlanDeEstudioXCursoDTO nuevaRelacion = service.insertarPlanDeEstudioXCurso(planDeEstudioXCursoDTO);
            if (nuevaRelacion != null) {
                logger.info("Relación plan de estudio-curso insertada con éxito. ID: {}",
                        nuevaRelacion.getId());
                return ResponseEntity.ok(nuevaRelacion);
            } else {
                logger.error("Error al insertar relación plan de estudio-curso");
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error("Error inesperado al insertar relación plan de estudio-curso: {}",
                    e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    //!ELIMINAR
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarPlanDeEstudioXCurso(@PathVariable Long id) {
        logger.info("Iniciando eliminación de relación plan de estudio-curso con id: {}", id);
        try {
            boolean eliminado = service.eliminarPlanDeEstudioXCurso(id);
            if (eliminado) {
                logger.info("Relación plan de estudio-curso desactivada con éxito");
                return ResponseEntity.ok("Relación plan de estudio-curso desactivada con éxito");
            } else {
                logger.info("No se encontró la relación plan de estudio-curso");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error al eliminar relación plan de estudio-curso: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error al eliminar la relación plan de estudio-curso");
        }
    }

    //!ACTUALIZAR
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<PlanDeEstudioXCursoDTO> actualizarPlanDeEstudioXCurso(
            @PathVariable Long id,
            @RequestBody PlanDeEstudioXCursoDTO planDeEstudioXCursoDTO) {
        logger.info("Iniciando actualización de relación plan de estudio-curso con id: {}", id);
        try {
            PlanDeEstudioXCursoDTO planXCursoActualizado = service.actualizarPlanDeEstudioXCurso(id, planDeEstudioXCursoDTO);
            if (planXCursoActualizado != null) {
                logger.info("Relación plan de estudio-curso actualizada con éxito. ID: {}",
                        planXCursoActualizado.getId());
                return ResponseEntity.ok(planXCursoActualizado);
            } else {
                logger.info("No se encontró la relación plan de estudio-curso para actualizar");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error al actualizar relación plan de estudio-curso: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/listar/{idPlanDeEstudio}")
    public ResponseEntity<Page<PlanDeEstudioXCursoDTO>> listarCursosPorPlanDeEstudio(
            @PathVariable Long idPlanDeEstudio, Pageable pageable) {
        logger.info("Iniciando listado de cursos para plan de estudio id: {}", idPlanDeEstudio);
        try {
            Page<PlanDeEstudioXCursoDTO> cursos = service.listarCursosPorPlanDeEstudioId(idPlanDeEstudio, pageable);
            logger.info("Se encontraron {} cursos en la página actual", cursos.getNumberOfElements());
            return ResponseEntity.ok(cursos);
        } catch (Exception e) {
            logger.error("Error al listar cursos del plan de estudio: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/listar/{idPlanDeEstudio}/ciclo/{ciclo}")
    public ResponseEntity<Page<PlanDeEstudioXCursoDTO>> listarCursosPorCiclo(
            @PathVariable Long idPlanDeEstudio,
            @PathVariable int ciclo,
            Pageable pageable) {
        logger.info("Iniciando listado de cursos para plan {} en ciclo {}", idPlanDeEstudio, ciclo);
        try {
            Page<PlanDeEstudioXCursoDTO> cursos = service.listarCursosPorCicloYPlanDeEstudio(
                    ciclo, idPlanDeEstudio, pageable);
            logger.info("Se encontraron {} cursos para el ciclo {}",
                    cursos.getNumberOfElements(), ciclo);
            return ResponseEntity.ok(cursos);
        } catch (Exception e) {
            logger.error("Error al listar cursos por ciclo: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/listar/{idPlanDeEstudio}/electivos")
    public ResponseEntity<Page<PlanDeEstudioXCursoDTO>> listarCursosElectivos(
            @PathVariable Long idPlanDeEstudio,
            Pageable pageable) {
        logger.info("Iniciando listado de cursos electivos para plan {}", idPlanDeEstudio);
        try {
            Page<PlanDeEstudioXCursoDTO> cursosElectivos = service
                    .listarCursosElectivosPorPlanDeEstudio(idPlanDeEstudio, pageable);
            logger.info("Se encontraron {} cursos electivos",
                    cursosElectivos.getNumberOfElements());
            return ResponseEntity.ok(cursosElectivos);
        } catch (Exception e) {
            logger.error("Error al listar cursos electivos: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/insertarCSV")
    public RespuestaPlanDeEstudioXCurso insertarPlanDeEstudioXCursoCsv(@RequestBody List<PlanDeEstudioXCursoDTO> planDeEstudioXCursoDTOs) {
        logger.info("Iniciando inserción de múltiples relaciones PlanDeEstudioXCurso. Total: {}", planDeEstudioXCursoDTOs.size());
    
        List<PlanDeEstudioXCursoDTO> relacionesGuardadas = new ArrayList<>();
        List<String> errores = new ArrayList<>();
    
        for (PlanDeEstudioXCursoDTO dto : planDeEstudioXCursoDTOs) {
            boolean datosValidos = true;
            String error = "Para la relación del curso con código: " + dto.getCurso().getCodigo() + " ";
    
            logger.info("Procesando relación para curso con código: {}", dto.getCurso().getCodigo());
    
            //?Verificar existencia del Plan de Estudio
            if (dto.getPlanDeEstudio() == null || dto.getPlanDeEstudio().getIdPlanDeEstudio() == null) {
                logger.error("Plan de estudio no especificado o inválido.");
                errores.add(error + "Plan de estudio no especificado o inválido.");
                datosValidos = false;
            } else if (!planDeEstudioService.existePlanDeEstudioPorId(dto.getPlanDeEstudio().getIdPlanDeEstudio())) {
                logger.error("Plan de estudio no encontrado con ID: {}", dto.getPlanDeEstudio().getIdPlanDeEstudio());
                errores.add(error + "Plan de estudio no encontrado.");
                datosValidos = false;
            }
    
            //?Verificar existencia del Curso
            if (dto.getCurso() == null || dto.getCurso().getCodigo() == null) {
                logger.error("Curso no especificado o inválido.");
                errores.add(error + "Curso no especificado o inválido.");
                datosValidos = false;
            } else if (cursoService.existePorCodigo(dto.getCurso().getCodigo())) {
                logger.error("Ya existe un curso con el Codigo: {}", dto.getCurso().getCodigo());
                errores.add(error + "Ya existe un curso con el Codigo: " + dto.getCurso().getCodigo());
                datosValidos = false;
            }
            //================================================================================================
            
             
            //?Verificar que el codigo que no este formado por caracteres especiales
            if (dto.getCurso() != null && dto.getCurso().getCodigo() != null && 
                !dto.getCurso().getCodigo().matches("^[a-zA-Z0-9]*$")) {
                logger.error("El código del curso no puede contener caracteres especiales.");
                errores.add(error + "El código del curso no puede contener caracteres especiales.");
                datosValidos = false;
            }
    
            //?Verificar que los creditos sean mayores a 0
            if (dto.getCurso() != null && dto.getCurso().getCreditos() <= 0) {
                logger.error("Los créditos del curso deben ser mayores a 0.");
                errores.add(error + "Los créditos del curso deben ser mayores a 0.");
                datosValidos = false;
            }
            //?Verificar que la seccion exista 
            if(dto.getCurso() != null && dto.getCurso().getSeccion()==null){ 
                logger.error("La sección no se recibe.");
                errores.add(error + "La sección no se recibe.");
                datosValidos = false;
            }
            else if( seccionService.existeCodigo(dto.getCurso().getSeccion().getCodigo())==false){
                logger.error("La sección con codigo" + dto.getCurso().getSeccion().getCodigo() +"no existe en la BD.");
                errores.add(error + "La sección con codigo" + dto.getCurso().getSeccion().getCodigo() +"no existe en la BD.");
                datosValidos = false;
            }
            else {
                 SeccionDTOInsersion seccionDTO = new SeccionDTOInsersion();
                 seccionDTO = seccionService.obtenerPrimeroPorCodigo(dto.getCurso().getSeccion().getCodigo());
                 dto.getCurso().setSeccion(seccionDTO);
            }  

            if (datosValidos) {
                try {
                    PlanDeEstudioXCursoDTO guardado = service.insertarPlanDeEstudioXCurso(dto);
                    relacionesGuardadas.add(guardado);
                    logger.info("Relación PlanDeEstudioXCurso insertada con éxito. Curso: {}", dto.getCurso().getCodigo());
                } catch (Exception e) {
                    logger.error("Error al insertar la relación para curso con código: {}. Detalle: {}",
                            dto.getCurso().getCodigo(), e.getMessage());
                    errores.add(error + "Error al insertar la relación: " + e.getMessage());
                }
            } else {
                logger.error("Datos inválidos para la relación del curso con código: {}", dto.getCurso().getCodigo());
            }
        }
    
        return new RespuestaPlanDeEstudioXCurso(relacionesGuardadas, errores);
    }

    @GetMapping("/obtenerPorIdUnidad/{idUnidad}")
    public ResponseEntity<List<PlanDeEstudioXCursoDTO>> obtenerPorIdUnidad(@PathVariable Long idUnidad) {
        List<PlanDeEstudioXCursoDTO> resultados = service.obtenerPlanDeEstudioXCursoPorIdUnidad(idUnidad);
        if (resultados.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultados);
    }
}

 
