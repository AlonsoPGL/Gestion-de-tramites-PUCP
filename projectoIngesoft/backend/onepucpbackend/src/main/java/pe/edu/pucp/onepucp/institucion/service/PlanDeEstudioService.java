package pe.edu.pucp.onepucp.institucion.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import pe.edu.pucp.onepucp.institucion.dto.PlanDeEstudioDTO;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.PlanDeEstudio;
import pe.edu.pucp.onepucp.institucion.repository.EspecialidadRepository;
import pe.edu.pucp.onepucp.institucion.repository.PlanDeEstudioRepository;
@Service
public class PlanDeEstudioService {
    @Autowired
    private PlanDeEstudioRepository planDeEstudioRepository;
    
    @Autowired
    private EspecialidadRepository especialidadRepository;
    
    private  ModelMapper modelMapper;
    public List<PlanDeEstudioDTO> listarPlanesDeEstudio() {
        try {
            modelMapper = new ModelMapper();
            List<PlanDeEstudio> planes = planDeEstudioRepository.findAllByActivoTrue();
            return planes.stream()
                    .map(plan -> modelMapper.map(plan, PlanDeEstudioDTO.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error al listar los planes de estudio: " + e.getMessage());
        }
    }
    //!INSERTAR
    @Transactional
    public PlanDeEstudioDTO insertarPlanDeEstudio(PlanDeEstudioDTO planDeEstudioDTO) {
        try {
            // Convertir DTO a entidad
            modelMapper = new ModelMapper();
            PlanDeEstudio planDeEstudio = modelMapper.map(planDeEstudioDTO, PlanDeEstudio.class);
            
            // Verificar y establecer la especialidad
            if (planDeEstudioDTO.getEspecialidad() != null && planDeEstudioDTO.getEspecialidad().getId() != null) {
                Optional<Especialidad> especialidad = especialidadRepository.findById(planDeEstudioDTO.getEspecialidad().getId());
                if (especialidad.isPresent()) {
                    planDeEstudio.setEspecialidad(especialidad.get());
                }
            }
            
            // Establecer activo por defecto
            planDeEstudio.setActivo(true);
            
            // Guardar el plan de estudio
            planDeEstudio = planDeEstudioRepository.save(planDeEstudio);
            
            // Convertir la entidad guardada de vuelta a DTO
            return modelMapper.map(planDeEstudio, PlanDeEstudioDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Error al insertar el plan de estudio: " + e.getMessage());
        }
    }

    //!OBTENER POR ID
    public PlanDeEstudioDTO obtenerPlanDeEstudioPorId(Long id) {
        modelMapper = new ModelMapper();
        Optional<PlanDeEstudio> planDeEstudio = planDeEstudioRepository.findById(id);
        if (planDeEstudio.isPresent()) {
            return modelMapper.map(planDeEstudio.get(), PlanDeEstudioDTO.class);
        }
        return null;
    }
    //!OBTENER POR ESPECIALIDAD
    public PlanDeEstudioDTO obtenerPlanDeEstudioPorEspecialidad(Long id) {
        modelMapper = new ModelMapper();
        Optional<PlanDeEstudio> planDeEstudio = planDeEstudioRepository.findByEspecialidadId(id);
        if (planDeEstudio.isPresent()) {
            return modelMapper.map(planDeEstudio.get(), PlanDeEstudioDTO.class);
        }
        return null;
    }
    //!ELIMINAR (SOFT DELETE)
    @Transactional
    public boolean eliminarPlanDeEstudio(Long id) {
        modelMapper = new ModelMapper();
        try {
            Optional<PlanDeEstudio> planOptional = planDeEstudioRepository.findById(id);
            if (planOptional.isPresent()) {
                PlanDeEstudio plan = planOptional.get();
                plan.setActivo(false);
                planDeEstudioRepository.save(plan);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar el plan de estudio: " + e.getMessage());
        }
    }

    //!ACTUALIZAR
    @Transactional
    public PlanDeEstudioDTO actualizarPlanDeEstudio(Long id, PlanDeEstudioDTO planDeEstudioDTO) {
        modelMapper = new ModelMapper();
        try {
            Optional<PlanDeEstudio> planExistenteOpt = planDeEstudioRepository.findById(id);
            if (planExistenteOpt.isPresent()) {
                PlanDeEstudio planExistente = planExistenteOpt.get();
                
                // Actualizar campos básicos
                planExistente.setNombre(planDeEstudioDTO.getNombre());
                
                // Actualizar especialidad si se proporciona
                if (planDeEstudioDTO.getEspecialidad() != null && 
                    planDeEstudioDTO.getEspecialidad().getId() != null) {
                    Optional<Especialidad> especialidad = especialidadRepository.findById(
                        planDeEstudioDTO.getEspecialidad().getId());
                    especialidad.ifPresent(planExistente::setEspecialidad);
                }
                
                // Mantener el plan activo
                planExistente.setActivo(true);
                
                // Guardar cambios
                PlanDeEstudio planActualizado = planDeEstudioRepository.save(planExistente);
                
                // Convertir a DTO y retornar
                return modelMapper.map(planActualizado, PlanDeEstudioDTO.class);
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar el plan de estudio: " + e.getMessage());
        }
    }
    //!EXISTS BY ID
    public boolean existePlanDeEstudioPorId(Long id) {
        return planDeEstudioRepository.existsByIdPlanDeEstudioAndActivoTrue(id);
    }
}