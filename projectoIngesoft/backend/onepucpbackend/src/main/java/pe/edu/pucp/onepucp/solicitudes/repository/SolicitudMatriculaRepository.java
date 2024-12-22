package pe.edu.pucp.onepucp.solicitudes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import pe.edu.pucp.onepucp.solicitudes.model.SolicitudMatricula;

@Repository
public interface SolicitudMatriculaRepository extends JpaRepository<SolicitudMatricula, Long> {

    // Método para encontrar solicitudes por el ID de la especialidad
    List<SolicitudMatricula> findByEspecialidad_Id(Long id);
    //! Para listar al alumno
    List<SolicitudMatricula> findByEmisor_Id(Long idPersona);
    //SolicitudMatricula findById(Long id);

    
}
