package pe.edu.pucp.onepucp.rrhh.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO;
import pe.edu.pucp.onepucp.rrhh.model.Docente;

@Repository
public interface DocenteRepository extends CrudRepository<Docente,Long> {
    @Query("""
        SELECT new pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO(
            d.id, d.nombre, d.apellidoPaterno, d.apellidoMaterno, 
            d.email, d.codigo, d.activo
        )
        FROM Docente d
        WHERE (:apellidoPaterno IS NULL OR d.apellidoPaterno LIKE CONCAT('%', :apellidoPaterno, '%'))
        AND (:apellidoMaterno IS NULL OR d.apellidoMaterno LIKE CONCAT('%', :apellidoMaterno, '%'))
        AND (:nombres IS NULL OR d.nombre LIKE CONCAT('%', :nombres, '%'))
        AND (:codigo IS NULL OR CAST(d.codigo AS string) LIKE CONCAT('%', :codigo, '%'))
    """)
    List<DocenteDTO> buscarPorCriterios(
            @Param("apellidoPaterno") String apellidoPaterno,
            @Param("apellidoMaterno") String apellidoMaterno,
            @Param("nombres") String nombres,
            @Param("codigo") Integer codigo
    );

    @Query("SELECT d FROM Docente d " +
            "WHERE d.id = :idDocente")
    Docente findByDocenteId(@Param("idDocente") Long idDocente);
    

    @Query("SELECT d FROM Docente d " +
        "JOIN d.personaRol r " +
        "JOIN r.rol ro " +
       "WHERE ro.id = 9")
    List<Docente> findDocentes();
}
