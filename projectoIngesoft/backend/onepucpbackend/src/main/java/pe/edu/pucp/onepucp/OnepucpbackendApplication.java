package pe.edu.pucp.onepucp;

import java.util.ArrayList;
import java.util.List;
//import org.hibernate.mapping.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import pe.edu.pucp.onepucp.preguntas.model.Encuesta;
import pe.edu.pucp.onepucp.preguntas.model.Pregunta;
import pe.edu.pucp.onepucp.preguntas.repository.EncuestaRepository;
import pe.edu.pucp.onepucp.rrhh.model.Cuenta;
import pe.edu.pucp.onepucp.rrhh.model.Permiso;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.TipoPersona;
import pe.edu.pucp.onepucp.rrhh.repository.PermisoRepository;

import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.TipoPersona;

import pe.edu.pucp.onepucp.rrhh.repository.PersonaRepository;
//remove then
import java.time.LocalDate;
@SpringBootApplication
public class OnepucpbackendApplication implements CommandLineRunner{

	@Autowired
	PersonaRepository repository;

	@Autowired
	EncuestaRepository encuestaRepository;

	@Autowired
    private PermisoRepository permisoRepository;

	public static void main(String[] args) {
		SpringApplication.run(OnepucpbackendApplication.class, args);
	}

	@Override
	public void run(String ... args) throws Exception{
		/* 
		Persona user=new Persona();
		Cuenta cuenta=new Cuenta();

		cuenta.setActivo(true);
		cuenta.setContrasenia("contraseñaIncorrecta");
		cuenta.setUsuario("admin");
		user.setCuenta(cuenta);
		user.setNombre("Adrian");
		user.setApellidoMaterno("fujiki");
		user.setApellidoPaterno("escobar");
		user.setEmail("adrian@pucp");
		user.setTipo(TipoPersona.ADMINISTRADOR);
		
		repository.save(user);
		//List<Usuario> usuarios = (List<Usuario>)repository.findAll();
		*/
		/* 
		Encuesta encuesta = new Encuesta();
        encuesta.setTitulo("Evaluación de Docentes");
        encuesta.setEsIntermedia(true);
        encuesta.setJefeEspecialidad("María Gómez");
        encuesta.setFechaInicio(LocalDate.of(2024, 1, 1));
        encuesta.setFechaFin(LocalDate.of(2024, 1, 31));

        PreguntaTextBox pregunta1 = new PreguntaTextBox();
        pregunta1.setNumeracion(1);
        pregunta1.setDescripcion("¿Cómo calificaría el servicio?");
        pregunta1.setRespuesta("Muy bueno");
        pregunta1.setActivo(true);
        pregunta1.setEncuesta(encuesta);

        PreguntaOpcionMultiple pregunta2 = new PreguntaOpcionMultiple();
        pregunta2.setNumeracion(2);
        pregunta2.setDescripcion("¿Recomendaría este producto?");
        pregunta2.setPuntaje(5);
        pregunta2.setActivo(true);
        pregunta2.setEncuesta(encuesta);

        List<Pregunta>preguntas = new ArrayList<>();
        preguntas.add(pregunta1);
        preguntas.add(pregunta2);
        encuesta.setPreguntas(preguntas);
		encuestaRepository.save(encuesta);
		*/
	}

}
