package  service;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import pe.edu.pucp.onepucp.rrhh.model.AlumnoEnRiesgo;
import pe.edu.pucp.onepucp.institucion.model.Curso;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.rrhh.repository.AlumnoEnRiesgoRepository;
import pe.edu.pucp.onepucp.rrhh.service.AlumnoEnRiesgoService;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@ActiveProfiles("test")
class AlumnoEnRiesgoServiceTest {
    @Autowired
    private AlumnoEnRiesgoService service;

    @Autowired
    private AlumnoEnRiesgoRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll(); // Limpiar la base de datos antes de cada prueba
    }

    @Test
    void testInsertarAlumnoEnRiesgo() {
        // Arrange
        Horario horario = new Horario();
        horario.setIdHorario(1L);


        Especialidad especialidad = new Especialidad();
        especialidad.setId(1L);
        especialidad.setNombre("Ingeniería Informática");

        AlumnoEnRiesgo alumno = new AlumnoEnRiesgo();
        alumno.setNombre("Juan");
        alumno.setApellidoPaterno("Pérez");
        alumno.setApellidoMaterno("García");
        alumno.setCodigo("20200123");
        alumno.setSemestre("2024-1"); 
        alumno.setVez(2);
        alumno.setEspecialidad(especialidad);

        // Act
        AlumnoEnRiesgo alumnoGuardado = service.insertarAlumnoEnRiesgo(alumno);

        // Assert
        assertNotNull(alumnoGuardado.getId());
        assertEquals("Juan", alumnoGuardado.getNombre());
        assertEquals("20200123", alumnoGuardado.getCodigo());
    }

    @Test
    void testObtenerTodosLosAlumnosEnRiesgo() {
        // Arrange
        crearAlumnoEnRiesgoParaPrueba("2024-1");
        crearAlumnoEnRiesgoParaPrueba("2024-1");

        // Act
        ArrayList<AlumnoEnRiesgo> alumnos = service.obtenerTodosLosAlumnosEnRiesgo();

        // Assert
        assertEquals(2, alumnos.size());
    }

    @Test
    void testBuscarAlumnoEnRiesgoPorSemestre() {
        // Arrange
        crearAlumnoEnRiesgoParaPrueba("2024-1");
        crearAlumnoEnRiesgoParaPrueba("2023-2");

        // Act
        ArrayList<AlumnoEnRiesgo> alumnos = service.buscarAlumnoEnRiesgoPorSemestre("2024-1");

        // Assert
        assertEquals(1, alumnos.size());
        assertEquals("2024-1", alumnos.get(0).getSemestre());
    }

    private AlumnoEnRiesgo crearAlumnoEnRiesgoParaPrueba(String semestre) {
        Curso curso = new Curso();
        curso.setIdCurso(1L);
        curso.setNombre("Curso Test");

        Especialidad especialidad = new Especialidad();
        especialidad.setId(1L);
        especialidad.setNombre("Especialidad Test");

        AlumnoEnRiesgo alumno = new AlumnoEnRiesgo();
        alumno.setNombre("Test");
        alumno.setApellidoPaterno("Test");
        alumno.setCodigo("TEST" + Math.random());
        alumno.setSemestre(semestre); 
        alumno.setEspecialidad(especialidad);

        return service.insertarAlumnoEnRiesgo(alumno);
    }
}
