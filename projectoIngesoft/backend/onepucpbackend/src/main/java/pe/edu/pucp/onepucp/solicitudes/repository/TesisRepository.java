package pe.edu.pucp.onepucp.solicitudes.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.solicitudes.model.Tesis;

import java.util.List;
import java.util.Optional;

@Repository
public interface TesisRepository extends CrudRepository<Tesis,Long> {
    List<Tesis> findByIntegrantes_id(Long idAlumno);
    List<Tesis> findByEspecialidad_id(Long id);
    List<Tesis> findAll();


    @Query("SELECT a FROM Alumno a WHERE a.tesis.id = :tesisId")
    List<Alumno> findAlumnosByTesisId(@Param("tesisId") Long tesisId);
    
}
