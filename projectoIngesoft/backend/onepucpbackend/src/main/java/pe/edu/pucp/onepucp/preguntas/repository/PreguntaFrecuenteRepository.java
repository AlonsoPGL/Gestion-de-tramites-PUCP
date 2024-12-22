package pe.edu.pucp.onepucp.preguntas.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.preguntas.model.PreguntaFrecuente;

@Repository 
public interface PreguntaFrecuenteRepository extends CrudRepository<PreguntaFrecuente,Long>{

    List<PreguntaFrecuente> findByPreguntaContainingIgnoreCaseAndActivo(String pregunta, boolean activo);

    // Método para listar solo las preguntas frecuentes activas
    @Query("SELECT p FROM PreguntaFrecuente p WHERE p.activo = true")
    List<PreguntaFrecuente> findAllActive();

}
