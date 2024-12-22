package pe.edu.pucp.onepucp.preguntas.service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pe.edu.pucp.onepucp.institucion.dto.FacultadDTO;
import pe.edu.pucp.onepucp.institucion.model.Curso;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.model.Facultad;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.institucion.repository.CursoRepository;
import pe.edu.pucp.onepucp.institucion.repository.EspecialidadRepository;
import pe.edu.pucp.onepucp.institucion.repository.HorarioRepository;
import pe.edu.pucp.onepucp.institucion.repository.JefeDePracticaRepository;
import pe.edu.pucp.onepucp.preguntas.DTO.EncuestaDTO;
import pe.edu.pucp.onepucp.preguntas.model.Encuesta;
import pe.edu.pucp.onepucp.preguntas.model.Pregunta;
import pe.edu.pucp.onepucp.preguntas.model.TipoEncuesta;
import pe.edu.pucp.onepucp.preguntas.repository.EncuestaRepository;
import pe.edu.pucp.onepucp.preguntas.repository.PreguntaRepository;
import pe.edu.pucp.onepucp.rrhh.repository.DocenteRepository;

@Service
public class EncuestaService {
    
    private static final Logger logger = LoggerFactory.getLogger(EncuestaService.class);
    @Autowired
    private EncuestaRepository encuestaRepository;

    @Autowired
    private PreguntaRepository preguntaRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private JefeDePracticaRepository jpRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    private ModelMapper modelMapper;

    @Transactional
    public Encuesta crearEncuesta(EncuestaDTO encuestaDTO) {
        Encuesta encuesta = new Encuesta();
        encuesta.setActivo(true);
        encuesta.setTitulo(encuestaDTO.getTitulo());
        FacultadDTO facultadDTO = encuestaDTO.getFacultad();
        modelMapper = new ModelMapper();
        Facultad facultad = modelMapper.map(facultadDTO, Facultad.class);
        encuesta.setFacultad(facultad);
        encuesta.setTipo(TipoEncuesta.DOCENTE);
        encuesta.setFechaInicio(encuestaDTO.getFechaInicio());
        encuesta.setFechaFin(encuestaDTO.getFechaFin());
        encuesta.setEsIntermedia(encuestaDTO.isEsIntermedia());
        List<Pregunta> preguntas = encuestaDTO.getPreguntas();
        encuesta.setPreguntas(new ArrayList<>()); // Temporalmente remover preguntas
        Encuesta savedEncuesta = encuestaRepository.save(encuesta);

        // Reasocia las preguntas con la encuesta guardada y las guarda
        if (preguntas != null) {
            for (Pregunta pregunta : preguntas) {
                pregunta.setEncuesta(savedEncuesta);  // Se asigna la encuesta a cada pregunta 
                pregunta.setActivo(true);
                preguntaRepository.save(pregunta);    
            }
        }
        //para devolver algo 
        savedEncuesta.setPreguntas(preguntas);

        // Llamar al método para asignar horarios
        //asignarHorariosPorTipo(savedEncuesta);
        return savedEncuesta;
    }

    @Transactional
    public Encuesta crearEncuestaJP(EncuestaDTO encuestaDTO) {
        Encuesta encuesta = new Encuesta();
        encuesta.setActivo(true);
        encuesta.setTitulo(encuestaDTO.getTitulo());
        FacultadDTO facultadDTO = encuestaDTO.getFacultad();
        modelMapper = new ModelMapper();
        Facultad facultad = modelMapper.map(facultadDTO, Facultad.class);
        encuesta.setFacultad(facultad);
        encuesta.setTipo(TipoEncuesta.JP);
        encuesta.setFechaInicio(encuestaDTO.getFechaInicio());
        encuesta.setFechaFin(encuestaDTO.getFechaFin());
        encuesta.setEsIntermedia(encuestaDTO.isEsIntermedia());
        List<Pregunta> preguntas = encuestaDTO.getPreguntas();
        encuesta.setPreguntas(new ArrayList<>()); // Temporalmente remover preguntas
        Encuesta savedEncuesta = encuestaRepository.save(encuesta);

        // Reasocia las preguntas con la encuesta guardada y las guarda
        if (preguntas != null) {
            for (Pregunta pregunta : preguntas) {
                pregunta.setEncuesta(savedEncuesta);  // Se asigna la encuesta a cada pregunta 
                pregunta.setActivo(true);
                preguntaRepository.save(pregunta);    
            }
        }
        //para devolver algo 
        savedEncuesta.setPreguntas(preguntas);

        // Llamar al método para asignar horarios
        //asignarHorariosPorTipo(savedEncuesta);

        return savedEncuesta;
    }

    public void asignarHorariosPorTipo(Encuesta encuesta) {
        if (encuesta.getTipo() == TipoEncuesta.DOCENTE) {
            asignarEncuestaDocenteHorarios(encuesta.getIdEncuesta());
        } else if (encuesta.getTipo() == TipoEncuesta.JP) {
            asignarEncuestaJPHorarios(encuesta.getIdEncuesta());
        }
    }

    public ArrayList<Encuesta> obtenerTodasEncuestas() {
        ArrayList<Encuesta> encuestasActivas = new ArrayList<>();

        for (Encuesta encuesta : encuestaRepository.findAll()) {
            if (encuesta.isActivo() && encuesta.getTipo() == TipoEncuesta.DOCENTE) { // Suponiendo que tienes un

                encuestasActivas.add(encuesta);
            }
        }

        return encuestasActivas;
    }

    public ArrayList<Encuesta> obtenerTodasEncuestasJP() {
        ArrayList<Encuesta> encuestasActivas = new ArrayList<>();

        for (Encuesta encuesta : encuestaRepository.findAll()) {
            if (encuesta.isActivo() && encuesta.getTipo() == TipoEncuesta.JP) { // Suponiendo que tienes un

                encuestasActivas.add(encuesta);
            }
        }

        return encuestasActivas;

    }

    public boolean eliminarEncuesta(Long id) {
        Optional<Encuesta> escuestaOpcional = encuestaRepository.findById(id);
        if (escuestaOpcional.isPresent()) {
            Encuesta encuesta = escuestaOpcional.get();
            encuesta.setActivo(false); // Cambiar el estado a "false" para indicar que está eliminada
            List<Pregunta> preguntas = preguntaRepository.listarEncuestaID(id);
            for (Pregunta pregunta : preguntas) {
            pregunta.setActivo(false); // Cambiar el estado a inactivo
            preguntaRepository.save(pregunta); // Guardar el cambio de estado en la pregunta
        } 
            encuestaRepository.save(encuesta);
            return true;
        } else {
            return false;
        }
    }

    public Page<Encuesta> obtenerEncuestasPaginadasPorTipo(TipoEncuesta tipo, Pageable pageable) {
        return encuestaRepository.findByActivoTrueAndTipo(tipo, pageable);
    }
    
    public Encuesta actualizarEncuesta(Long id, EncuestaDTO encuestaActualizada) {
        Optional<Encuesta> encuestaOpcional = encuestaRepository.findById(id);
        if (encuestaOpcional.isPresent()) {
            Encuesta encuestaExistente = encuestaOpcional.get();
    
            // Actualizar propiedades de la encuesta
            encuestaExistente.setTitulo(encuestaActualizada.getTitulo());
            encuestaExistente.setEsIntermedia(encuestaActualizada.isEsIntermedia());
            encuestaExistente.setFechaInicio(encuestaActualizada.getFechaInicio());
            encuestaExistente.setFechaFin(encuestaActualizada.getFechaFin());

            FacultadDTO facultadDTO = encuestaActualizada.getFacultad();
            modelMapper = new ModelMapper();
            Facultad facultad = modelMapper.map(facultadDTO, Facultad.class);
            encuestaExistente.setFacultad(facultad);

            encuestaExistente.setTipo(encuestaActualizada.getTipo());
            encuestaExistente.setActivo(encuestaActualizada.isActivo());
    
            // Manejar preguntas
            List<Pregunta> preguntasExistentes = encuestaExistente.getPreguntas();
            
            // Eliminar preguntas que ya no están presentes en encuestaActualizada
            preguntasExistentes.removeIf(pregunta -> {
                return encuestaActualizada.getPreguntas().stream()
                    .noneMatch(p -> p.getId_Pregunta() != null && p.getId_Pregunta().equals(pregunta.getId_Pregunta()));
            });
    
            // Agregar o actualizar preguntas
            for (Pregunta preguntaModificada : encuestaActualizada.getPreguntas()) {
                if (preguntaModificada.getId_Pregunta() == null) {
                    // Nueva pregunta
                    preguntaModificada.setEncuesta(encuestaExistente);
                    preguntasExistentes.add(preguntaModificada);
                } else {
                    // Pregunta existente, actualizar
                    Optional<Pregunta> optionalPregunta = preguntasExistentes.stream()
                        .filter(p -> p.getId_Pregunta().equals(preguntaModificada.getId_Pregunta()))
                        .findFirst();
                    
                    if (optionalPregunta.isPresent()) {
                        Pregunta preguntaExistente = optionalPregunta.get();
                        preguntaExistente.setNumeracion(preguntaModificada.getNumeracion());
                        preguntaExistente.setDescripcion(preguntaModificada.getDescripcion());
                        preguntaExistente.setTipo(preguntaModificada.getTipo());
                        preguntaExistente.setActivo(preguntaModificada.isActivo());
                    }
                }
            }
    
            return encuestaRepository.save(encuestaExistente);
        } else {
            return null;
        }
    }
    
    
    //esto asigna a todos los docentes en la db, deberia ser por facultad creo -- ENCUESTA DOCENTE
    //se invoca cada vez que un estudiante responde una encuesta DOCENTE

    //esto asigna a todos los jp en la db, deberia ser por facultad creo -- ENCUESTA JP

    //se invoca cada vez que un estudiante responde una encuesta DOCENTE

    @Transactional
    public void asignarEncuestaDocenteHorarios(Long encuestaId) {
        Encuesta encuesta = encuestaRepository.findById(encuestaId)
            .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));
        Facultad facultad = encuesta.getFacultad();
        List<Especialidad> especialidades = especialidadRepository.findByFacultad_Id(facultad.getId());

        for (Especialidad especialidad : especialidades) {
            // Obtener cursos directamente por el ID de la especialidad
            List<Curso> cursos = cursoRepository.findByEspecialidad_Id(especialidad.getId());
            for (Curso curso : cursos) {
                List<Horario> horarios = curso.getHorarios();
                for (Horario horario : horarios) {       
                    horario.setEncuestaDocente(encuesta); // Asigna la encuesta al horario
                }
            }
        }
    }
    @Transactional //Esto asigna las encuestas docentes
    public void asignarEncuestaJPHorarios(Long encuestaId) { //este metodo asigna todas las encuestas 
        //no se si estara en los estandares pero funciona xd
       Encuesta encuesta = encuestaRepository.findById(encuestaId)
           .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));
           Facultad facultad = encuesta.getFacultad();
           List<Especialidad> especialidades = especialidadRepository.findByFacultad_Id(facultad.getId());
        for (Especialidad especialidad : especialidades) {
            // Obtener cursos directamente por el ID de la especialidad
            List<Curso> cursos = cursoRepository.findByEspecialidad_Id(especialidad.getId());
            for (Curso curso : cursos) {
                List<Horario> horarios = curso.getHorarios();
                for (Horario horario : horarios) {       
                    horario.setEncuestaJp(encuesta); // Asigna la encuesta al horario
                }
            }
        }
    }

    public List<Encuesta> obtenerEncuestasProfesor(Long idProfe) {
        return encuestaRepository.obtenerEncuestasProfesor(idProfe);
    }

    public List<Encuesta> obtenerEncuestasJp(Long idJp) {
        return encuestaRepository.obtenerEncuestasJp(idJp);
    }


    public Map<Long, Boolean> verificarAsignaciones(List<Long> encuestaIds) {
        Map<Long, Boolean> resultado = new HashMap<>();
        for (Long id : encuestaIds) {
            boolean estaAsignada = horarioRepository.existsByIdEncuestaDocente(id);
            resultado.put(id, estaAsignada);
        }
        return resultado;
    }

    public Map<Long, Boolean> verificarAsignacionesJP(List<Long> encuestaIds) {
        Map<Long, Boolean> resultado = new HashMap<>();
        for (Long id : encuestaIds) {
            boolean estaAsignada = horarioRepository.existsByIdEncuestaJP(id);
            resultado.put(id, estaAsignada);
        }
        return resultado;
    }


}












