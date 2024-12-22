package pe.edu.pucp.onepucp.solicitudes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.pucp.onepucp.institucion.dto.CursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.CursoDTO2;
import pe.edu.pucp.onepucp.institucion.dto.PlanDeEstudioXCursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.SolicitudPedidosCursoDTO_update;
import pe.edu.pucp.onepucp.institucion.model.Curso;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.institucion.repository.CursoRepository;
import pe.edu.pucp.onepucp.institucion.repository.HorarioRepository;
import pe.edu.pucp.onepucp.institucion.service.CursoService;
import pe.edu.pucp.onepucp.institucion.service.HorarioService;
import pe.edu.pucp.onepucp.institucion.service.PlanDeEstudioXCursoService;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudPedidoCursoDTO;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudPedidosCursosDTO;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudPedidosCursosDTO_insert;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudPedidosCursosXplanDTO;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoAprobacion;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudPedidoCurso;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudPedidosCursos;
import pe.edu.pucp.onepucp.solicitudes.service.SolicitudPedidosCursosService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("SolicitudPedidosCursos")
public class SolicitudPedidosCursosController {
    @Autowired
    private SolicitudPedidosCursosService service;

    @Autowired
    private PlanDeEstudioXCursoService planDeEStudioXCursoService;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @PostMapping("/insertar")
    public void insertarSolicitudPedidos(@RequestBody SolicitudPedidosCursosDTO_insert solicitudes) {
         service.insertarSolicitudPedidos(solicitudes);
        //return newsolicitudes;
    }
    @PutMapping("/actualizar")
    public void actualizarSolicitudPedidos(@RequestBody SolicitudPedidosCursoDTO_update solicitudes) {
       service.actualizar_SolicitudPedidos(solicitudes);
        //return newsolicitudes;
    }


    /* 
    @GetMapping("/listar/{id}")
    public List<SolicitudPedidoCursoDTO> obtenerSolicitudesPorId(@PathVariable Long id) {
        return service.obtenerSolicitudesPorIdSolicitudPedido(id);
    }
        */
    @GetMapping("/listar")
    public Page<SolicitudPedidosCursosDTO> obtenerSolicitudes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) Long especialidadId) {  // Añadimos el filtro de especialidad
        return service.obtenerSolicitudesPaginadas(page, size, especialidadId);  // Pasamos especialidadId al servicio
    }
    @GetMapping("/listarSoli")
    public SolicitudPedidosCursosXplanDTO obtenerSolicitudesPlan(
            @RequestParam(required = false) Long idUnidad
      /*  @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "500") int size*/)
            {  // Añadimos el filtro de especialidad
        return service.obtenerSolicitudesPlanPaginadas(idUnidad);  // Pasamos especialidadId al servicio
    }
    @PutMapping("/{id}/{idUnidad}/estado")
    public ResponseEntity<?> actualizarEstadoEnvio(@PathVariable Long id, @PathVariable Long idUnidad, @RequestBody String nuevoEstado) {
    
        // Obtener la lista de Planes de Estudio X Curso
        List<PlanDeEstudioXCursoDTO> resultados = planDeEStudioXCursoService.obtenerPlanDeEstudioXCursoPorIdUnidad(idUnidad);
    
        // Iterar sobre cada PlanDeEstudioXCursoDTO
        for (PlanDeEstudioXCursoDTO planCurso : resultados) {
            // Obtener el curso correspondiente desde el DTO
            CursoDTO cursoDTO = planCurso.getCurso();
    
            // Obtener la cantidad de horarios a crear para este curso
            int cantHorarios = planCurso.getCantHorarios(); 
    
            // Buscar el curso en la base de datos usando Optional
            Optional<Curso> cursoOptional = cursoRepository.findById(cursoDTO.getIdCurso());
    
            // Si el curso no se encuentra, retornar un error (Curso no encontrado)
            if (!cursoOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
            }
    
            // Obtener el curso de Optional
            Curso curso = cursoOptional.get();
    
            // Crear los horarios para este curso
            for (int i = 1; i <= cantHorarios; i++) {
                // Generar el código del horario (por ejemplo: 0881, 0882, ...)
                String codigoHorario = String.format("088%d", i);  // Esto generará códigos como 0881, 0882, 0883, etc.
    
                // Crear el nuevo horario
                Horario nuevoHorario = new Horario();
                nuevoHorario.setCodigo(codigoHorario);  // Asignar el código generado
                nuevoHorario.setNombreCurso(curso.getNombre());  // Asignar el nombre del curso
                nuevoHorario.setCodigoCurso(curso.getCodigo());  // Asignar el código del curso
                nuevoHorario.setCreditoCurso(curso.getCreditos());  // Asignar los créditos del curso
                nuevoHorario.setActivo(true);  // Asignar que el horario está activo
                nuevoHorario.setVisible(true);  // Si es visible
                nuevoHorario.setCantAlumnos(0);  // Aquí puedes definir el valor que corresponda
    
                // Asignar el curso a este horario
                nuevoHorario.setCurso(curso);  // Asociamos el curso encontrado a este horario
    
                // Aquí deberías guardar o agregar este horario a la base de datos
                horarioRepository.save(nuevoHorario);
            }
        }
    
        // Asignar el nuevo estado a la solicitud
        EstadoSolicitud estado = EstadoSolicitud.valueOf(nuevoEstado.toUpperCase());
        service.actualizarEstadoSolicitud(id, estado);
    
        return ResponseEntity.status(HttpStatus.OK).build();
    }
    


}
