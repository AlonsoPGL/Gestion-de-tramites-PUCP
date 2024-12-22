package pe.edu.pucp.onepucp.institucion.repository;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import pe.edu.pucp.onepucp.institucion.model.Curso;

@DataJpaTest
//@SpringBootTest // Esta anotación indica que se levante el contexto de Spring para la prueba
//@ActiveProfiles("test")
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)  // Esto usa una base de datos embebida

public class CursoRepositoryTests {

    @Autowired
    private CursoRepository cursoRepository;

   @Test
   void testGuiardarCurso(){
    //given -dado o ocndicion previa o configuracion
       Curso newCurso=new Curso();
       newCurso.setCodigo("CS101");
       newCurso.setNombre("Introducción a la Programación");
       newCurso.setCreditos(3);
       newCurso.setActivo(true);

//       Curso savedCurso=cursoRepository.save(newCurso);
//
//        assertNotNull(savedCurso,"el curso se guardo");
//       assertEquals("CS101", savedCurso.getCodigo(), "El código del curso debe coincidir");
   }
}
