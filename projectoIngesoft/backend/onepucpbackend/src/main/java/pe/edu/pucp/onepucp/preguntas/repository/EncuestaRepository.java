package pe.edu.pucp.onepucp.preguntas.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.preguntas.model.Encuesta;
import pe.edu.pucp.onepucp.preguntas.model.TipoEncuesta;
import pe.edu.pucp.onepucp.rrhh.model.Persona;

@Repository
public interface EncuestaRepository extends JpaRepository<Encuesta,Long>{

    Page<Encuesta> findByActivoTrue(Pageable pageable);
    Page<Encuesta> findByActivoTrueAndTipo(TipoEncuesta tipo, Pageable pageable);

    /*@Query("SELECT e FROM Encuesta e " +
       "JOIN e.facultad f " +
       "JOIN f.especialidades esp " +
       "JOIN esp.cursos c " +
       "JOIN c.horarios h " +
       "JOIN h.docentes d " +
       "WHERE d.id = :idProfe AND e.tipo = 'DOCENTE'") */



       @Query("SELECT e FROM Encuesta e " +
        "JOIN e.facultad f " +
        "JOIN f.especialidades esp " +
        "JOIN esp.cursos c " +
        "JOIN c.horarios h " +
        "JOIN h.docentes d " +
       "WHERE d.id = :idProfe AND e.tipo = 'DOCENTE' AND e.activo = true")
    List <Encuesta> obtenerEncuestasProfesor(Long idProfe);

    @Query("SELECT e FROM Encuesta e " +
        "JOIN e.facultad f " +
        "JOIN f.especialidades esp " +
        "JOIN esp.cursos c " +
        "JOIN c.horarios h " +
        "JOIN h.jps d " +
       "WHERE d.id = :idJpe AND e.tipo = 'JP' AND e.activo = true")
    List <Encuesta> obtenerEncuestasJp(Long idJpe);
}
