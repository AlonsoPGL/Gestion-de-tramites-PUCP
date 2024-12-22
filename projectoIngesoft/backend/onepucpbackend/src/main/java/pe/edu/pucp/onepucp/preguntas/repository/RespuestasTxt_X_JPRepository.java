package pe.edu.pucp.onepucp.preguntas.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.preguntas.model.RespuestasTxt_X_Docente;
import pe.edu.pucp.onepucp.preguntas.model.RespuestasTxt_X_JP;
public interface RespuestasTxt_X_JPRepository extends CrudRepository<RespuestasTxt_X_JP,Long>{

    @Query("SELECT p FROM RespuestasTxt_X_JP p WHERE p.jp.id = :idJp AND p.pregunta.encuesta.idEncuesta = :idencuesta")
    List<RespuestasTxt_X_JP> listarRespuestas(@Param("idJp") Long idJp,@Param("idencuesta") Long idencuesta);
}
