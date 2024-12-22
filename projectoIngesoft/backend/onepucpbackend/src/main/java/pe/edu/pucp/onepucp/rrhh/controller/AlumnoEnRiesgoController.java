package pe.edu.pucp.onepucp.rrhh.controller;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.rrhh.model.AlumnoEnRiesgo;
import pe.edu.pucp.onepucp.rrhh.service.AlumnoEnRiesgoService;

@RestController
@RequestMapping("/rrhh/alumnoEnRiesgo")
public class AlumnoEnRiesgoController {
    private static final Logger logger = LoggerFactory.getLogger(AlumnoEnRiesgoController.class);
    @Autowired
    AlumnoEnRiesgoService alumnoEnRiesgoService;
    //!INSERTAR
    @PostMapping("/insertar")
    public AlumnoEnRiesgo insertarAlumnoEnRiesgo(@RequestBody AlumnoEnRiesgo alumnoEnRiesgo) {
        logger.info("Iniciando inserción de alumno en riesgo: {}", alumnoEnRiesgo.getNombre());
        AlumnoEnRiesgo nuevoAlumnoEnRiesgo = alumnoEnRiesgoService.insertarAlumnoEnRiesgo(alumnoEnRiesgo);
        logger.info("Alumno en riesgo insertado con éxito: {}", alumnoEnRiesgo.getId());
        return nuevoAlumnoEnRiesgo;
    }
    //!LISTAR
    @GetMapping("/listar")
    public ArrayList<AlumnoEnRiesgo> listarAlumnoEnRiesgo() {
        logger.info("Listando todas los alumnos en riesgo...");
        ArrayList<AlumnoEnRiesgo> alumnosEnRiesgo = alumnoEnRiesgoService.obtenerTodosLosAlumnosEnRiesgo();
        logger.info("Se encontraron {} alumnos en riesgo", alumnosEnRiesgo.size());
        return alumnosEnRiesgo;
    }
    //!BUSCAR POR SEMESTRE
    @GetMapping("/buscarPorSemestre/{semestre}")
    public ArrayList<AlumnoEnRiesgo> buscarAlumnoEnRiesgoPorSemestre(@PathVariable String semestre) {
        logger.info("Buscando alumno en riesgo por semestre: {}", semestre);
        ArrayList<AlumnoEnRiesgo> alumnosEnRiesgo = alumnoEnRiesgoService.buscarAlumnoEnRiesgoPorSemestre(semestre);
        logger.info("Se encontraron {} alumnos en riesgo", alumnosEnRiesgo.size());
        return alumnosEnRiesgo;
    }
    //!BUSCAR POR ID CURSO
    @GetMapping("/buscarPorIdCurso/{idCurso}")
    public ArrayList<AlumnoEnRiesgo> buscarAlumnoEnRiesgoPorIdCurso(@PathVariable long idCurso) {
        logger.info("Buscando alumno en riesgo por idCurso: {}", idCurso);
        ArrayList<AlumnoEnRiesgo> alumnosEnRiesgo = alumnoEnRiesgoService.buscarAlumnoEnRiesgoPorIdCurso(idCurso);
        logger.info("Se encontraron {} alumnos en riesgo", alumnosEnRiesgo.size());
        return alumnosEnRiesgo;
    }
    //!INSERTAR CSV
    @PostMapping("/insertarCSV")
    public List<AlumnoEnRiesgo> insertarAlumnosEnRiesgoCSV(@RequestBody List<AlumnoEnRiesgo> alumnosEnRiesgo) {
        logger.info("Iniciando inserción de alumnos en riesgo desde CSV...");
        List<AlumnoEnRiesgo> nuevosAlumnosEnRiesgo = new ArrayList<>();
        for (AlumnoEnRiesgo alumnoEnRiesgo : alumnosEnRiesgo) {
            nuevosAlumnosEnRiesgo.add(alumnoEnRiesgoService.insertarAlumnoEnRiesgo(alumnoEnRiesgo));
        }
        logger.info("Alumnos en riesgo insertados con éxito: {}", nuevosAlumnosEnRiesgo.size());
        return nuevosAlumnosEnRiesgo;
    }
}
