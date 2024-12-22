package pe.edu.pucp.onepucp.institucion.service;

import java.util.ArrayList;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pe.edu.pucp.onepucp.institucion.dto.SemestreDTO;
import pe.edu.pucp.onepucp.institucion.model.Semestre;
import pe.edu.pucp.onepucp.institucion.repository.SemestreRepository;
@Service
public class SemestreService {

    private static final Logger logger = LoggerFactory.getLogger(SemestreService.class);

    @Autowired
    private SemestreRepository repository;

    private ModelMapper modelMapper;

    @Transactional
    public SemestreDTO insertarSemestre(SemestreDTO semestreDTO) {
        try {
            logger.info("Iniciando inserción de semestre...");
            modelMapper = new ModelMapper();
            Semestre semestre = modelMapper.map(semestreDTO, Semestre.class);
            semestre.setActivo(true);
            semestre = repository.save(semestre);
            SemestreDTO result = modelMapper.map(semestre, SemestreDTO.class);
            logger.info("Semestre insertado exitosamente con ID: {}", semestre.getIdSemestre());
            return result;
        } catch (Exception e) {
            logger.error("Error al insertar semestre: {}", e.getMessage());
            throw e;
        }
    }

    public ArrayList<Semestre> obtenerTodosLosSemestres() {
        try {
            logger.info("Obteniendo todos los semestres activos...");
            ArrayList<Semestre> semestresActivos = new ArrayList<>();
            for (Semestre semestre : repository.findAll()) {
                if (semestre.isActivo()) {
                    semestresActivos.add(semestre);
                }
            }
            logger.info("Total de semestres activos encontrados: {}", semestresActivos.size());
            return semestresActivos;
        } catch (Exception e) {
            logger.error("Error al obtener semestres activos: {}", e.getMessage());
            throw e;
        }
    }

    public ArrayList<SemestreDTO> buscarSemestrePorNombre(String nombre) {
        try {
            logger.info("Buscando semestres por nombre: {}", nombre);
            ArrayList<SemestreDTO> semestresDTO = new ArrayList<>();
            modelMapper = new ModelMapper();
            for (Semestre semestre : repository.findByNombreContaining(nombre)) {
                SemestreDTO semestreDTO = modelMapper.map(semestre, SemestreDTO.class);
                semestresDTO.add(semestreDTO);
            }
            logger.info("Semestres encontrados: {}", semestresDTO.size());
            return semestresDTO;
        } catch (Exception e) {
            logger.error("Error al buscar semestres por nombre: {}", e.getMessage());
            throw e;
        }
    }

    @Transactional
    public boolean existeSemestrePorNombre(String nombre) {
        try {
            logger.info("Verificando existencia de semestre por nombre: {}", nombre);
            boolean exists = repository.existsByNombreAndActivoTrue(nombre);
            logger.info("Existencia de semestre: {}", exists);
            return exists;
        } catch (Exception e) {
            logger.error("Error al verificar existencia de semestre: {}", e.getMessage());
            throw e;
        }
    }

    public SemestreDTO obtenerSemestrePorId(long id) {
        try {
            logger.info("Obteniendo semestre por ID: {}", id);
            Optional<Semestre> semestreOptional = repository.findById(id);
            if (semestreOptional.isPresent()) {
                Semestre semestre = semestreOptional.get();
                modelMapper = new ModelMapper();
                SemestreDTO semestreDTO = modelMapper.map(semestre, SemestreDTO.class);
                logger.info("Semestre encontrado con ID: {}", id);
                return semestreDTO;
            } else {
                logger.warn("Semestre no encontrado con ID: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al obtener semestre por ID: {}", e.getMessage());
            throw e;
        }
    }

    public boolean eliminarSemestre(long id) {
        try {
            logger.info("Eliminando semestre con ID: {}", id);
            Optional<Semestre> semestre = repository.findById(id);
            if (semestre.isPresent()) {
                semestre.get().setActivo(false);
                repository.save(semestre.get());
                logger.info("Semestre eliminado con éxito: {}", id);
                return true;
            } else {
                logger.warn("Semestre no encontrado para eliminar con ID: {}", id);
                return false;
            }
        } catch (Exception e) {
            logger.error("Error al eliminar semestre: {}", e.getMessage());
            throw e;
        }
    }

    public SemestreDTO actualizarSemestre(Long id, SemestreDTO semestreActualizado) {
        try {
            logger.info("Actualizando semestre con ID: {}", id);
            Optional<Semestre> semestreOptional = repository.findById(id);
            if (semestreOptional.isPresent()) {
                Semestre semestreExistente = semestreOptional.get();
                semestreExistente.setNombre(semestreActualizado.getNombre());
                semestreExistente.setFechaInicio(semestreActualizado.getFechaInicio());
                semestreExistente.setFechaFin(semestreActualizado.getFechaFin());
                modelMapper = new ModelMapper();
                SemestreDTO updatedDTO = modelMapper.map(repository.save(semestreExistente), SemestreDTO.class);
                logger.info("Semestre actualizado con éxito: {}", id);
                return updatedDTO;
            } else {
                logger.warn("Semestre no encontrado para actualizar con ID: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al actualizar semestre: {}", e.getMessage());
            throw e;
        }
    }

    public ArrayList<SemestreDTO> listarSemestres() {
        try {
            logger.info("Listando todos los semestres activos...");
            ArrayList<SemestreDTO> semestresDTO = new ArrayList<>();
            //voltea este ArrayList de manera inversa

            for (Semestre semestre : repository.findAllByActivoTrue()) {
                modelMapper = new ModelMapper();
                SemestreDTO semestreDTO = modelMapper.map(semestre, SemestreDTO.class);
                semestresDTO.add(semestreDTO); 
                
            }
            logger.info("Total de semestres activos listados: {}", semestresDTO.size());
            return semestresDTO;
        } catch (Exception e) {
            logger.error("Error al listar semestres activos: {}", e.getMessage());
            throw e;
        }
    }

    public Page<SemestreDTO> obtenerSemestresDTOPaginados(Pageable pageable) {
        try {
            logger.info("Obteniendo semestres paginados...");
            Page<Semestre> semestresPage = repository.findAllActiveOrderedByIdDesc(pageable);
            modelMapper = new ModelMapper();
            Page<SemestreDTO> semestreDTOPage = semestresPage.map(semestre -> modelMapper.map(semestre, SemestreDTO.class));
            logger.info("Semestres paginados obtenidos con éxito.");
    
            return semestreDTOPage;
        } catch (Exception e) {
            logger.error("Error al obtener semestres paginados: {}", e.getMessage());
            throw e;
        }
    }

    public Page<Semestre> obtenerSemestresPaginados(Pageable pageable) {
        try {
            logger.info("Obteniendo semestres activos paginados...");
            return repository.findAllActiveOrderedByIdDesc(pageable);
        } catch (Exception e) {
            logger.error("Error al obtener semestres activos paginados: {}", e.getMessage());
            throw e;
        }
    }
}
