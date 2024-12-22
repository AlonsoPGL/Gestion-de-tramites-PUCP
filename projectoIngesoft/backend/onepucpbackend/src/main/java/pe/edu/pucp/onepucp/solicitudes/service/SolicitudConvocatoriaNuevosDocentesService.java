package pe.edu.pucp.onepucp.solicitudes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.edu.pucp.onepucp.solicitudes.model.SolicitudConvocatoriaNuevosDocentes;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudConvocatoriaNuevosDocentesRepository;

@Service
public class SolicitudConvocatoriaNuevosDocentesService {
    @Autowired
    private SolicitudConvocatoriaNuevosDocentesRepository repository;
    public void guardarSolicitudConvocatoriaNuevosDocentes(SolicitudConvocatoriaNuevosDocentes solicitudConvocatoriaNuevosDocentes) {
    repository.save(solicitudConvocatoriaNuevosDocentes);
    }
    public byte[] obtenerDocumentoDeSolicitudConvocatoriaNuevosDocentes(Long id) {
        SolicitudConvocatoriaNuevosDocentes solicitudConvocatoriaNuevosDocentes = repository.findById(id).get();
        if(solicitudConvocatoriaNuevosDocentes == null) {
            return null;
        }
        return solicitudConvocatoriaNuevosDocentes.getDocumento();
    }
}

