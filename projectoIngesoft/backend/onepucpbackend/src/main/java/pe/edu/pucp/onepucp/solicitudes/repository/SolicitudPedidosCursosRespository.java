package pe.edu.pucp.onepucp.solicitudes.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.onepucp.institucion.dto.CursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.CursoDTO2;
import pe.edu.pucp.onepucp.institucion.model.Curso;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudPedidosCursosDTO;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudPedidosCursos;

import java.util.List;

@Repository
public interface SolicitudPedidosCursosRespository extends JpaRepository<SolicitudPedidosCursos,Long> {
   // @Query("SELECT sp FROM SolicitudPedidosCursos sp LEFT JOIN FETCH sp.solicitudPedidoCursos spc LEFT JOIN FETCH spc.curso WHERE sp.id = :id")
    //List<SolicitudPedidosCursos> findAllWithCursos(@Param("id") Long id);
//
//    @Query("SELECT c FROM Curso c JOIN SolicitudPedidoCurso spc ON spc.curso.idCurso = c.idCurso WHERE spc.solicitudPedidoCurso.id = :idSolicitudPedidoCurso")
//    List<Curso> findCursosBySolicitudPedidoCursoId(@Param("idSolicitudPedidoCurso") Long id);
//@Query("SELECT new pe.edu.pucp.onepucp.institucion.dto.CursoDTO2(c.idCurso, c.codigo, c.nombre, c.creditos, c.activo, " +
//        "  (SELECT new pe.edu.pucp.onepucp.institucion.dto.HorarioDTO2(h.idHorario) " +
//        "   FROM Horario h " +
//        "   WHERE h.curso.idCurso = c.idCurso)) " +
//        "FROM Curso c " +
//        "JOIN FETCH SolicitudPedidoCurso spc ON spc.curso.idCurso = c.idCurso " +
//        "JOIN FETCH c.horarios h " + // Ensuring Horarios are fetched
//        "WHERE spc.solicitudPedidoCurso.id = :idSolicitudPedidoCurso")
//List<CursoDTO2> findCursosBySolicitudPedidoCursoId(@Param("idSolicitudPedidoCurso") Long id);
//
//
//
//



//    @Query("SELECT new pe.edu.pucp.onepucp.solicitudes.dto.CursoDTO(c.idCurso, c.codigo, c.nombre, c.creditos, c.activo, " +
//            "   new pe.edu.pucp.onepucp.solicitudes.dto.HorarioDTO(h.idHorario, h.horaInicio, h.horaFin)) " +
//            "FROM Curso c " +
//            "JOIN SolicitudPedidoCurso spc ON spc.curso.idCurso = c.idCurso " +
//            "JOIN Horario h ON h.curso.idCurso = c.idCurso " +  // Añadido JOIN para Horario
//            "WHERE spc.solicitudPedidoCurso.id = :idSolicitudPedidoCurso")
//    List<CursoDTO> findCursosBySolicitudPedidoCursoId(@Param("idSolicitudPedidoCurso") Long id);

    Page<SolicitudPedidosCursos> findByEspecialidadId(Long especialidadId, Pageable pageable);

    SolicitudPedidosCursos findByPlanDeEstudioEspecialidadId(long idUnidad);

    // @Query(value ="SELECT  FROM " ,nativeQuery = true)
   // SolicitudPedidosCursos findByIdUnidad(long idUnidad, Pageable pageable);
}