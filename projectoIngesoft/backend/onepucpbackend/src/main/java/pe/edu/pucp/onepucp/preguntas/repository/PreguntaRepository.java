package pe.edu.pucp.onepucp.preguntas.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.preguntas.model.Pregunta;

@Repository 
public interface PreguntaRepository extends CrudRepository<Pregunta,Long> {
   
    @Query("SELECT p FROM Pregunta p WHERE p.encuesta.idEncuesta = :idEncuesta")
    List<Pregunta> listarEncuestaID(@Param("idEncuesta") Long id_Encuesta);
}
