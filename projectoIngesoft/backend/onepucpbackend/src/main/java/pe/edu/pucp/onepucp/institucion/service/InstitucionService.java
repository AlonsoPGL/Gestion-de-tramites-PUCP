package pe.edu.pucp.onepucp.institucion.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.edu.pucp.onepucp.institucion.model.Institucion;
import pe.edu.pucp.onepucp.institucion.repository.InstitucionRepository;

@Service
public class InstitucionService {

    @Autowired
    private InstitucionRepository institucionRepository;

    private static final Logger logger = LoggerFactory.getLogger(InstitucionService.class);

//!OBTENER POR ID
    public Optional<Institucion> obtenerPorId(Long id) {
        try {
            logger.info("Buscando institución con ID: {}", id);
            Optional<Institucion> institucion = institucionRepository.findById(id);
        
            if (institucion.isPresent()) {
                

                logger.info("Institución encontrada con ID: {}", id);
            } else {
                logger.warn("No se encontró ninguna institución con ID: {}", id);
            }

            return institucion;
        } catch (Exception e) {
            logger.error("Error al obtener institución por ID: {}", id, e);
            throw e;
        }
    }

//!GUARDAR
    public Institucion guardar(Institucion institucion) {
        try {
            logger.info("Guardando institución con los siguientes datos: {}", institucion);
            //!ASignar semesre a la institucion si es posible si no se puede continua normal
            if(institucion.getSemestre()!=null){
                logger.info("Se asignará el semestre con ID: {} a la institución", institucion.getSemestre().getIdSemestre());
            }
            else{
                logger.warn("No se asignará ningún semestre a la institución");
            }
            Institucion institucionGuardada = institucionRepository.save(institucion);
            logger.info("Institución guardada con éxito. ID: {}", institucionGuardada.getIdInstitucion());
            return institucionGuardada;
        } catch (Exception e) {
            logger.error("Error al guardar la institución: {}", institucion, e);
            throw e;
        }
    }
    //!OBTENER SEMESTRE POR ID
    public Long obtenerSemestrePorIdInstitucion(Long idInstitucion) {
        try {
            logger.info("Buscando semestre con ID de institución: {}", idInstitucion);
            Long idSemestre;
            Optional<Institucion> instiOptional= institucionRepository.findById(idInstitucion);
            if(instiOptional.isEmpty()){
                logger.warn("No se encontró ninguna institución con ID: {}", idInstitucion);
                return null;
            }
            else{
                logger.info("Institución encontrada con ID: {}", idInstitucion);
                idSemestre = instiOptional.get().getSemestre().getIdSemestre();
            }
            

            if (idSemestre != null) {
                logger.info("Semestre encontrado con ID de institución: {}", idInstitucion);
            } else {
                logger.warn("No se encontró ningún semestre con ID de institución: {}", idInstitucion);
            }

            return idSemestre;
        } catch (Exception e) {
            logger.error("Error al obtener semestre por ID de institución: {}", idInstitucion, e);
            throw e;
        }
    }
}
