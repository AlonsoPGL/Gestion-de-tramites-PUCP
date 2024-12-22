package pe.edu.pucp.onepucp.solicitudes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

//import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudCartaDTO;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudCartaPresentacion;
@Repository
public interface SolicitudCartaPresentacionRepository extends CrudRepository<SolicitudCartaPresentacion,Long>{
    List<SolicitudCartaPresentacion> findByIntegrantes_Id(Long alumnoId);
    List<SolicitudCartaPresentacion> findByEspecialidad_Id(Long especialidadId);

    /*
    @Query("SELECT new pe.edu.pucp.onepucp.solicitudes.dto.SolicitudCartaDTO(" +
            "scp.id, scp.profesor.id, scp.actividadesDesarrollar, scp.empresaPractica, scp.curso.id, " +
            "scp.especialidad.id, " +
            "new pe.edu.pucp.onepucp.rrhh.dto.PersonaDTO(e.id, e.nombre, e.especialidad, e.apellidoPaterno, e.apellidoMaterno, e.email, e.codigo, e.tipo, e.cuenta)" +
            ") " +
            "FROM SolicitudCartaPresentacion scp " +
            "JOIN scp.emisor e " +  // Asegúrate de que 'emisor' está mapeado correctamente
            "WHERE scp.especialidad.id = :id")
    List<SolicitudCartaDTO> findByEspecialidad_IdAsDTO(@Param("id") Long especialidadId);
    */
}
