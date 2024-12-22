package pe.edu.pucp.onepucp.preguntas.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.preguntas.model.Pregunta;
import pe.edu.pucp.onepucp.preguntas.model.RespuestasTxt_X_Docente;
public interface RespuestasTxt_X_DocenteRepository extends CrudRepository<RespuestasTxt_X_Docente,Long>{
    
    @Query("SELECT p FROM RespuestasTxt_X_Docente p WHERE p.docente.id = :idProfe AND p.pregunta.encuesta.idEncuesta = :idencuesta")
    List<RespuestasTxt_X_Docente> listarRespuestas(@Param("idProfe") Long idProfe, @Param("idencuesta") Long idencuesta);
}
