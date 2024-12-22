package pe.edu.pucp.onepucp.rrhh.service;

import java.util.ArrayList;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import pe.edu.pucp.onepucp.rrhh.model.AlumnoEnRiesgo;
import pe.edu.pucp.onepucp.rrhh.repository.AlumnoEnRiesgoRepository;
@Service
public class AlumnoEnRiesgoService {
    @Autowired
    private AlumnoEnRiesgoRepository repository;
    private ModelMapper modelMapper;

    //!REGISTRAR
    @Transactional
    public AlumnoEnRiesgo insertarAlumnoEnRiesgo(AlumnoEnRiesgo alumnoEnRiesgo) {
        return repository.save(alumnoEnRiesgo);
    }

    //!LISTAR TODOS
    public ArrayList<AlumnoEnRiesgo> obtenerTodosLosAlumnosEnRiesgo() {
        //!trae todos los alumnos en riesgo
        ArrayList<AlumnoEnRiesgo> alumnosEnRiesgo = new ArrayList<>();
        for (AlumnoEnRiesgo alumnoEnRiesgo : repository.findAll()) {
            alumnosEnRiesgo.add(alumnoEnRiesgo);
        }
        return alumnosEnRiesgo;
    }

    //!BUSCAR POR SEMESTRE  
    // semestre es un String
    public ArrayList<AlumnoEnRiesgo> buscarAlumnoEnRiesgoPorSemestre(String semestre) {
        ArrayList<AlumnoEnRiesgo> alumnosEnRiesgo = new ArrayList<>();
        for (AlumnoEnRiesgo alumnoEnRiesgo : repository.findAll()) {
            if (alumnoEnRiesgo.getSemestre().equals(semestre)) {
                alumnosEnRiesgo.add(alumnoEnRiesgo);
            }
        } 
        return alumnosEnRiesgo;
    }
    //!BUSCAR POR ID Curso
    public ArrayList<AlumnoEnRiesgo> buscarAlumnoEnRiesgoPorIdCurso(long idCurso) {
        ArrayList<AlumnoEnRiesgo> alumnosEnRiesgo = new ArrayList<>();
        for (AlumnoEnRiesgo alumnoEnRiesgo : repository.findAll()) {
            if (alumnoEnRiesgo.getHorario().getCurso().getIdCurso() == idCurso) {
                alumnosEnRiesgo.add(alumnoEnRiesgo);
            }
        }
        return alumnosEnRiesgo;
    }
    

    // ////////////////////////////////


}
