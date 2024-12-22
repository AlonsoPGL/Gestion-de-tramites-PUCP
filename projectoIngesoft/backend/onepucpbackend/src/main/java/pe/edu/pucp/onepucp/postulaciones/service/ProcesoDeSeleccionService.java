package pe.edu.pucp.onepucp.postulaciones.service;

import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import pe.edu.pucp.onepucp.postulaciones.model.Postulacion;
import pe.edu.pucp.onepucp.postulaciones.model.ProcesoDeSeleccion;
import pe.edu.pucp.onepucp.postulaciones.repository.ProcesoDeSeleccionRepository;

import java.util.List;

@Service
public class ProcesoDeSeleccionService {
    @Autowired
    private ProcesoDeSeleccionRepository repository;

    public void guardarProcesoDeSeleccion(ProcesoDeSeleccion procesoDeSeleccion) {
        repository.save(procesoDeSeleccion);
    }

    public byte[] buscarRequisitosPorId(Long id){
        ProcesoDeSeleccion procesoSelecccion = repository.findById(id).orElseThrow(()
                -> new RuntimeException("Envío no encontrado"));
        return procesoSelecccion.getRequisitos();
    }


    public Page<ProcesoDeSeleccion> listarProcesoDeSelecionPaginado(int page, int size) {
        Pageable pageable= PageRequest.of(page,size, Sort.by("id").descending());
        return repository.findAll(pageable);
    }
}


