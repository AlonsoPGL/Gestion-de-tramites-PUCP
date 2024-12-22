package pe.edu.pucp.onepucp.solicitudes.service;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import pe.edu.pucp.onepucp.institucion.dto.SolicitudPedidosCursoDTO_update;
import pe.edu.pucp.onepucp.institucion.model.Curso;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.PlanDeEstudio;
import pe.edu.pucp.onepucp.institucion.model.PlanDeEstudioXCurso;
import pe.edu.pucp.onepucp.institucion.model.Semestre;
import pe.edu.pucp.onepucp.institucion.repository.CursoRepository;
import pe.edu.pucp.onepucp.institucion.repository.EspecialidadRepository;
import pe.edu.pucp.onepucp.institucion.repository.FacultadRepository;
import pe.edu.pucp.onepucp.institucion.repository.PlanDeEstudioRepository;
import pe.edu.pucp.onepucp.institucion.repository.PlanDeEstudioXCursoRepository;
import pe.edu.pucp.onepucp.institucion.repository.SemestreRepository;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudPedidoCursoDTO_insert;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudPedidosCursosDTO;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudPedidosCursosDTO_insert;
import pe.edu.pucp.onepucp.solicitudes.dto.SolicitudPedidosCursosXplanDTO;
import pe.edu.pucp.onepucp.solicitudes.model.EstadoSolicitud;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudPedidoCurso;
import pe.edu.pucp.onepucp.solicitudes.model.SolicitudPedidosCursos;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudPedidoCursoRepository;
import pe.edu.pucp.onepucp.solicitudes.repository.SolicitudPedidosCursosRespository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class SolicitudPedidosCursosService {
    @Autowired
    private SolicitudPedidosCursosRespository repository;

    @Autowired
    private SolicitudPedidoCursoRepository solicitudPedidoCursoRepository;

    @Autowired
    private FacultadRepository facultadRepository;

    @Autowired
    private SemestreRepository semestreRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private PlanDeEstudioXCursoRepository  planDeEstudioXCursoRepository;

    @Autowired
    private PlanDeEstudioRepository planDeEstudioRepository;
    
    public SolicitudPedidosCursos insertarSolicitudPedidos(SolicitudPedidosCursosDTO_insert solicitudDTO) {
        // Recuperamos la especialidad y semestre
        Especialidad especialidad = especialidadRepository.findById(solicitudDTO.getEspecialidadId())
                .orElseThrow(() -> new RuntimeException("especialidad no encontrada"));
    
        Semestre semestre = (Semestre) semestreRepository.findByNombre(solicitudDTO.getSemestreNombre())
                .orElseThrow(() -> new RuntimeException("Semestre no encontrado"));
    
        // Creamos la entidad SolicitudPedidosCursos
        SolicitudPedidosCursos solicitudPedidosCursos = new SolicitudPedidosCursos();
        solicitudPedidosCursos.setEspecialidad(especialidad);
        solicitudPedidosCursos.setSemestre(semestre);
        solicitudPedidosCursos.setMotivo(solicitudDTO.getMotivo());
        solicitudPedidosCursos.setEstado(EstadoSolicitud.NO_APROBADA);
        solicitudPedidosCursos.setFechaCreacion(new Date());
    
        // Guardamos la solicitud
        SolicitudPedidosCursos savedSolicitud = repository.save(solicitudPedidosCursos);
    
        // Buscamos el PlanDeEstudio relacionado con la especialidad
        PlanDeEstudio planDeEstudio = planDeEstudioRepository.findByEspecialidadId(solicitudDTO.getEspecialidadId())
                .orElseThrow(() -> new RuntimeException("planDeEstudio no encontrada"));
    
        // Actualizamos los PlanDeEstudioXCurso
        for (SolicitudPedidoCursoDTO_insert solicitudCursoDTO : solicitudDTO.getSolicitudPedidoCursos()) {
            // Buscar el PlanDeEstudioXCurso correspondiente a cada curso
            PlanDeEstudioXCurso planDeEstudioXCurso = planDeEstudioXCursoRepository.findByCursoIdAndPlanDeEstudioId(
                    solicitudCursoDTO.getCursoId(), planDeEstudio.getIdPlanDeEstudio())
                    .orElseThrow(() -> new RuntimeException("PlanDeEstudioXCurso no encontrado"));
    
            // Actualizamos el campo cantHorarios
            planDeEstudioXCurso.setCantHorarios(solicitudCursoDTO.getCantHorarios());
            planDeEstudioXCurso.setActivo(true);  // Aseguramos que esté activo si lo es necesario
    
            // Guardamos la entidad actualizada
            planDeEstudioXCursoRepository.save(planDeEstudioXCurso);
        }
    
        return savedSolicitud;  // Devolvemos la solicitud guardada
    }
    
    
    
    
    /* 
    public List<SolicitudPedidoCursoDTO> obtenerSolicitudesPorIdSolicitudPedido(Long idSolicitudPedido) {
        // Obtener todas las solicitudes desde la base de datos
        List<SolicitudPedidoCurso> solicitudes = solicitudPedidoCursoRepository.findBySolicitudPedidoCursoId(idSolicitudPedido);
        ModelMapper modelMapper = new ModelMapper();

        // Crear una lista para los DTOs resultantes
        List<SolicitudPedidoCursoDTO> dtos = new ArrayList<>();

        // Iterar sobre las solicitudes para mapear manualmente cada una
        for (SolicitudPedidoCurso solicitud : solicitudes) {
            // Crear un nuevo DTO para cada solicitud
            SolicitudPedidoCursoDTO dto = new SolicitudPedidoCursoDTO();

            // Mapear los datos del DTO
            dto.setId(solicitud.getId());
            dto.setCantHorarios(solicitud.getCantHorarios());

            // Obtener la lista de cursos, manejando ambos casos
            Object cursos = solicitud.getCurso();
            List<CursoDTO> cursoDTOS = new ArrayList<>();

            // Si es una lista de cursos, mapeamos cada uno
            if (cursos instanceof List) {
                List<Curso> listaCursos = (List<Curso>) cursos;
                // Mapear la lista de cursos a una lista de CursoDTO usando ModelMapper
                cursoDTOS = modelMapper.map(listaCursos, new TypeToken<List<CursoDTO>>() {}.getType());
            } else if (cursos instanceof Curso) {
                // Si es un solo curso, lo mapeamos directamente
                Curso curso = (Curso) cursos;
                CursoDTO cursoDTO = modelMapper.map(curso, CursoDTO.class);
                cursoDTOS.add(cursoDTO);
            }

            // Asignar la lista de cursos mapeados al DTO de solicitud
            dto.setCursos(cursoDTOS);

            // Agregar el DTO a la lista de resultados
            dtos.add(dto);
        }

        // Devolver la lista de DTOs
        return dtos;
    }
*/
    public List<SolicitudPedidosCursosDTO> obtenerSolicitudesSolicitudPedido() {
        ModelMapper modelMapper = new ModelMapper();

        // Obtener toda la lista de solicitudes de pedidos de cursos
        List<SolicitudPedidosCursos> solicitudPedidosCursosList = repository.findAll(); // Esto es una lista, no un solo objeto

        // Mapear la lista de objetos a una lista de DTOs
        List<SolicitudPedidosCursosDTO> solicitudPedidosCursosDTOList = new ArrayList<>();

        for (SolicitudPedidosCursos solicitud : solicitudPedidosCursosList) {
            SolicitudPedidosCursosDTO dto = modelMapper.map(solicitud, SolicitudPedidosCursosDTO.class);
            solicitudPedidosCursosDTOList.add(dto);
        }

        return solicitudPedidosCursosDTOList;
    }

    public Page<SolicitudPedidosCursosDTO> obtenerSolicitudesPaginadas(int page, int size, Long especialidadId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "Id"));


        Page<SolicitudPedidosCursos> solicitudPedidosCursosPage;

        if (especialidadId != null) {
            // Si se proporciona el filtro de especialidad, obtenemos las solicitudes filtradas por especialidad
            solicitudPedidosCursosPage = repository.findByEspecialidadId(especialidadId, pageable);
        } else {
            // Si no se proporciona el filtro, obtenemos todas las solicitudes
            solicitudPedidosCursosPage = repository.findAll(pageable);
        }

        // Mapear la página de entidades a una página de DTOs
        ModelMapper modelMapper = new ModelMapper();
        Page<SolicitudPedidosCursosDTO> solicitudPedidosCursosDTOPage = solicitudPedidosCursosPage.map(
                solicitud -> modelMapper.map(solicitud, SolicitudPedidosCursosDTO.class)
        );

        return solicitudPedidosCursosDTOPage;
    }


    public void actualizar_SolicitudPedidos(SolicitudPedidosCursoDTO_update solicitudDTO) {
        SolicitudPedidosCursos solicitudPedidosCursos = repository.findById(solicitudDTO.getId())
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        Semestre semestre = (Semestre) semestreRepository.findByNombre(solicitudDTO.getSemestreNombre())
                .orElseThrow(() -> new RuntimeException("Semestre no encontrado"));
        // Creamos la entidad SolicitudPedidosCursos
        if(solicitudPedidosCursos != null){
            solicitudPedidosCursos.setSemestre(semestre);
            solicitudPedidosCursos.setMotivo(solicitudDTO.getMotivo());
            SolicitudPedidosCursos savedSolicitud = repository.save(solicitudPedidosCursos);
        }

        // Buscamos el PlanDeEstudio relacionado con la especialidad
        PlanDeEstudio planDeEstudio = planDeEstudioRepository.findByEspecialidadId(solicitudDTO.getEspecialidadId())
                .orElseThrow(() -> new RuntimeException("planDeEstudio no encontrada"));
    
        // Actualizamos los PlanDeEstudioXCurso
        for (SolicitudPedidoCursoDTO_insert solicitudCursoDTO : solicitudDTO.getSolicitudPedidoCursos()) {
            // Buscar el PlanDeEstudioXCurso correspondiente a cada curso
            System.out.println("CURSO" + solicitudCursoDTO.getCursoId() + "PLAN:" + planDeEstudio.getIdPlanDeEstudio());
            PlanDeEstudioXCurso planDeEstudioXCurso = planDeEstudioXCursoRepository.findByCursoIdAndPlanDeEstudioId(
                    solicitudCursoDTO.getCursoId(), planDeEstudio.getIdPlanDeEstudio())
                    .orElseThrow(() -> new RuntimeException("PlanDeEstudioXCurso no encontrado"));
    
            // Actualizamos el campo cantHorarios
            planDeEstudioXCurso.setCantHorarios(solicitudCursoDTO.getCantHorarios());
            planDeEstudioXCurso.setActivo(true);  // Aseguramos que esté activo si lo es necesario
    
            // Guardamos la entidad actualizada
            planDeEstudioXCursoRepository.save(planDeEstudioXCurso);
        }
       
    }

    public void actualizarEstadoSolicitud(Long id, EstadoSolicitud estado) {
        SolicitudPedidosCursos solicitudPedidosCursos=repository.findById(id).orElseThrow(()
                -> new RuntimeException("Envío no encontrado"));
        solicitudPedidosCursos.setEstado(estado);
        repository.save(solicitudPedidosCursos);
    }

    public SolicitudPedidosCursosXplanDTO obtenerSolicitudesPlanPaginadas( long idUnidad) {
        //Pageable pageable = PageRequest.of(page, 100/*, Sort.by(Sort.Direction.DESC, "id")*/);
        Pageable pageable2 = PageRequest.of(0, 100/*, Sort.by(Sort.Direction.DESC, "id")*/);

        SolicitudPedidosCursos  soli = (SolicitudPedidosCursos) repository.findByPlanDeEstudioEspecialidadId(idUnidad);
      List<PlanDeEstudioXCurso> planDeEstudioXCursos= (List<PlanDeEstudioXCurso>) planDeEstudioXCursoRepository.findCursosByPlanDeEstudioIdPlanDeEstudio(
              soli.getPlanDeEstudio().getIdPlanDeEstudio());

      soli.setPlanDeEstudioXCursos(planDeEstudioXCursos);

        ModelMapper modelMapper = new ModelMapper();
        modelMapper.typeMap(SolicitudPedidosCursos.class, SolicitudPedidosCursosXplanDTO.class)
                .addMappings(mapper -> {
                    mapper.map(SolicitudPedidosCursos::getPlanDeEstudioXCursos, SolicitudPedidosCursosXplanDTO::setPlanDeEstudioXCursoDTO);
                });

        // Mapear la entidad a DTO
        SolicitudPedidosCursosXplanDTO solicitudPedidosCursosDTO = modelMapper.map(soli, SolicitudPedidosCursosXplanDTO.class);


        return solicitudPedidosCursosDTO;
    }
}
