package pe.edu.pucp.onepucp.institucion.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.institucion.dto.PlanDeEstudioDTO;
import pe.edu.pucp.onepucp.institucion.service.PlanDeEstudioService;


@RestController
@RequestMapping("/institucion/planDeEstudio")
public class PlanDeEstudioController {
    
    private static final Logger logger = LoggerFactory.getLogger(PlanDeEstudioController.class);
    
    @Autowired
    private PlanDeEstudioService service;
    @GetMapping("/listar")
    public ResponseEntity<List<PlanDeEstudioDTO>> listarPlanesDeEstudio() {
        logger.info("Iniciando listado de planes de estudio");
        try {
            List<PlanDeEstudioDTO> planes = service.listarPlanesDeEstudio();
            logger.info("Se encontraron {} planes de estudio", planes.size());
            return ResponseEntity.ok(planes);
        } catch (Exception e) {
            logger.error("Error al listar planes de estudio: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    //!INSERTAR
    @PostMapping("/insertar")
    public ResponseEntity<PlanDeEstudioDTO> insertarPlanDeEstudio(@RequestBody PlanDeEstudioDTO planDeEstudioDTO) {
        logger.info("Iniciando inserción de plan de estudio: {}", planDeEstudioDTO.getNombre());
        try {
            PlanDeEstudioDTO nuevoPlan = service.insertarPlanDeEstudio(planDeEstudioDTO);
            if (nuevoPlan != null) {
                logger.info("Plan de estudio insertado con éxito: {}", nuevoPlan.getIdPlanDeEstudio());
                return ResponseEntity.ok(nuevoPlan);
            } else {
                logger.error("Error al insertar plan de estudio");
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error("Error inesperado al insertar plan de estudio: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    //!OBTENER POR ID
    @GetMapping("/obtener/{id}")
    public ResponseEntity<PlanDeEstudioDTO> obtenerPlanDeEstudioPorId(@PathVariable Long id) {
        logger.info("Buscando plan de estudio con id: {}", id);
        try {
            PlanDeEstudioDTO plan = service.obtenerPlanDeEstudioPorId(id);
            if (plan != null) {
                logger.info("Plan de estudio encontrado: {}", plan.getNombre());
                return ResponseEntity.ok(plan);
            } else {
                logger.info("Plan de estudio no encontrado con id: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error al buscar plan de estudio: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    //!OBTENER POR ID DE ESPECIALIDAD
    @GetMapping("/obtenerPorEspecialidad/{id}")  //solo es 1
    public ResponseEntity<PlanDeEstudioDTO> obtenerPlanDeEstudioPorEspecialidad(@PathVariable Long id) {
        logger.info("Buscando plan de estudio con id de especialidad: {}", id);
        try {
            PlanDeEstudioDTO plan = service.obtenerPlanDeEstudioPorEspecialidad(id);
            if (plan != null) {
                logger.info("Plan de estudio encontrado: {}", plan.getNombre());
                return ResponseEntity.ok(plan);
            } else {
                logger.info("Plan de estudio no encontrado con id de especialidad: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error al buscar plan de estudio: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    //!ELIMINAR
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarPlanDeEstudio(@PathVariable Long id) {
        logger.info("Iniciando eliminación de plan de estudio con id: {}", id);
        try {
            boolean eliminado = service.eliminarPlanDeEstudio(id);
            if (eliminado) {
                logger.info("Plan de estudio eliminado con éxito");
                return ResponseEntity.ok("Plan de estudio eliminado con éxito");
            } else {
                logger.info("No se pudo eliminar el plan de estudio");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error al eliminar plan de estudio: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error al eliminar el plan de estudio");
        }
    }

    //!ACTUALIZAR
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<PlanDeEstudioDTO> actualizarPlanDeEstudio(
            @PathVariable Long id,
            @RequestBody PlanDeEstudioDTO planDeEstudioDTO) {
        logger.info("Iniciando actualización de plan de estudio: {}", planDeEstudioDTO.getNombre());
        try {
            PlanDeEstudioDTO planActualizado = service.actualizarPlanDeEstudio(id, planDeEstudioDTO);
            if (planActualizado != null) {
                logger.info("Plan de estudio actualizado con éxito: {}", planActualizado.getIdPlanDeEstudio());
                return ResponseEntity.ok(planActualizado);
            } else {
                logger.info("Plan de estudio no encontrado para actualizar");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error al actualizar plan de estudio: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}