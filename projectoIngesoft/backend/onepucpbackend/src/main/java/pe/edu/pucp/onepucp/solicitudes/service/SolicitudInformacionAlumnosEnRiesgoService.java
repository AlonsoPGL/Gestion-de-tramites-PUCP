package pe.edu.pucp.onepucp.solicitudes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudCartaPresentacion;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudInformacionAlumnosEnRiesgo;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudCartaPresentacionRepository;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudInformacionAlumnosEnRiesgoRepository;

import java.util.List;
@Service
public class SolicitudInformacionAlumnosEnRiesgoService {
    @Autowired
    private SolicitudInformacionAlumnosEnRiesgoRepository solicitudInformacionAlumnosEnRiesgoRepository;


    public List<SolicitudInformacionAlumnosEnRiesgo> listarSolicitudesPorIdDocente(Long idDocente) {

    return  solicitudInformacionAlumnosEnRiesgoRepository.findByHorario_Docentes_id(idDocente);
    }

    public SolicitudInformacionAlumnosEnRiesgo guardarSolicitud(SolicitudInformacionAlumnosEnRiesgo solicitud) {
        // El metodo save actualizara si el ID existe
        return solicitudInformacionAlumnosEnRiesgoRepository.save(solicitud);
    }



}
