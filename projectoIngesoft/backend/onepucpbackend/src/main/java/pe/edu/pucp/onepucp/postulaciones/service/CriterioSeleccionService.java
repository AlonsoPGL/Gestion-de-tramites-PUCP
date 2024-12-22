package pe.edu.pucp.onepucp.postulaciones.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.pucp.onepucp.postulaciones.model.CriterioSeleccion;
import pe.edu.pucp.onepucp.postulaciones.model.ProcesoDeSeleccion;
import pe.edu.pucp.onepucp.postulaciones.repository.CriterioSeleccionRepository;
import pe.edu.pucp.onepucp.postulaciones.repository.ProcesoDeSeleccionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CriterioSeleccionService {

    @Autowired
    private CriterioSeleccionRepository criterioSeleccionRepository;

    @Autowired
    private ProcesoDeSeleccionRepository procesoDeSeleccionRepository;

    public List<CriterioSeleccion> obtenerCriteriosPorProcesoActivo() {
        return criterioSeleccionRepository.findAllByProcesoDeSeleccionActivo();
    }

    public void guardarCriterioSeleccion(Long id, CriterioSeleccion criterioSeleccion) {
       Optional<ProcesoDeSeleccion> procesoDeSeleccion= procesoDeSeleccionRepository.findById(id);
       criterioSeleccion.setProcesoDeSeleccion(procesoDeSeleccion.get());
        criterioSeleccionRepository.save(criterioSeleccion);

    }
}