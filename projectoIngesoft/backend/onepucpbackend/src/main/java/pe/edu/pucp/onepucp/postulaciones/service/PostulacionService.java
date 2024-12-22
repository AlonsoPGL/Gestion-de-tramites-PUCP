package pe.edu.pucp.onepucp.postulaciones.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.postulaciones.model.EstadoPostulacion;
import pe.edu.pucp.onepucp.postulaciones.model.Postulacion;
import pe.edu.pucp.onepucp.postulaciones.repository.PostulacionRepository;
import pe.edu.pucp.onepucp.rrhh.repository.PersonaRepository;

@Service
public class PostulacionService {
    @Autowired
    private PostulacionRepository repository;

    @Transactional
    public List<Postulacion> ListarPostulaciones() {
        List<Postulacion> postulaciones= (List<Postulacion>)repository.findAllByOrderByIdDesc();
        return postulaciones;
    }
    @Transactional
    public List<Postulacion> ListarPostulacionesPorEstadoPostulacion(EstadoPostulacion estadoPostulacion) {
        List<Postulacion> postulaciones= (List<Postulacion>)repository.findByEstado(estadoPostulacion);
        return postulaciones;
    }
    @Transactional
    public List<Postulacion> ListarPostulacionesPrimeraEtapa() {
        List<Postulacion> postulaciones= (List<Postulacion>)repository.findPostulacionesEnEsperaPrimerFiltro(); 
        return postulaciones;
    }

    @Transactional
    public List<Postulacion> ListarPostulacionesSegundaEtapa() {
        List<Postulacion> postulaciones= (List<Postulacion>)repository.findPostulacionesEnEsperaSegundaFiltro(); 
        return postulaciones;
    }

    @Transactional
    public List<Postulacion> ListarPostulacionesEtapaFinal() {
        List<Postulacion> postulaciones= (List<Postulacion>)repository.findPostulacionesEtapaFinal(); 
        return postulaciones;
    }

    @Transactional
    public boolean updateEstado(Long id, EstadoPostulacion nuevoEstado) {
        Optional<Postulacion> optionalPostulacion = repository.findById(id);

        if (!optionalPostulacion.isPresent()) {
            return false;
        }

        Postulacion postulacion = optionalPostulacion.get();
        postulacion.setEstado(nuevoEstado);
        repository.save(postulacion);
        return true;
    }

    public Postulacion obtenerPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void insertarPostulacion(Postulacion postulacion) {
        postulacion.setFechaPostulacion(new Date());
        postulacion.setEstado(EstadoPostulacion.ESPERA_PASAR_PRIMER_FILTRO);
        repository.save(postulacion);
    }
    @Transactional
    public boolean updatePuntaje(Long id, double nuevoPuntaje){
        Optional<Postulacion> optionalPostulacion = repository.findById(id);

        if(!optionalPostulacion.isPresent()){
            return false;
        }

        Postulacion postulacion = optionalPostulacion.get();
        postulacion.setPuntaje(nuevoPuntaje);
        repository.save(postulacion);
        return true;
    }    
    public byte[] buscarCVPorId(Long id){
        Postulacion postulacion = repository.findById(id).orElseThrow(()
                -> new RuntimeException("Envío no encontrado"));
        return postulacion.getCv();
    }    
    public byte[] buscarReferenciaPorId(Long id){
        Postulacion postulacion = repository.findById(id).orElseThrow(()
                -> new RuntimeException("Envío no encontrado"));
        return postulacion.getReferencias();
    }
    @Transactional
    public boolean updateDatosPuntuacion(Long id,EstadoPostulacion nuevoEstado, double nuevoPuntaje,
                                         String nuevaObservacion) {
        Optional<Postulacion> optionalPostulacion = repository.findById(id);

        if (!optionalPostulacion.isPresent()) {
            return false;
        }

        Postulacion postulacion = optionalPostulacion.get();
        postulacion.setEstado(nuevoEstado);
        postulacion.setPuntaje(nuevoPuntaje);
        postulacion.setObservaciones(nuevaObservacion);
        repository.save(postulacion);
        return true;
    }    
}