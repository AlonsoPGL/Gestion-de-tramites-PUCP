package pe.edu.pucp.onepucp.institucion.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pe.edu.pucp.onepucp.institucion.dto.AlumnoHorarioDTO;
import pe.edu.pucp.onepucp.institucion.dto.CursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO;
import pe.edu.pucp.onepucp.institucion.dto.HorarioDelegadoDTO;
import pe.edu.pucp.onepucp.institucion.dto.HorarioInsertDTO;
import pe.edu.pucp.onepucp.institucion.dto.JefeDePracticaDTO;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.institucion.model.JefeDePractica;
import pe.edu.pucp.onepucp.institucion.model.Semestre;
import pe.edu.pucp.onepucp.institucion.model.TipoHorario;
import pe.edu.pucp.onepucp.institucion.repository.HorarioRepository;
import pe.edu.pucp.onepucp.institucion.repository.JefeDePracticaRepository;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTOInsert;
import pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.model.Docente;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.repository.AlumnoRepository;
import pe.edu.pucp.onepucp.rrhh.service.AlumnoService;
@Service
public class HorarioService {

    private static final Logger logger = LoggerFactory.getLogger(HorarioService.class);  // Logger

    @Autowired
    private HorarioRepository horarioRepository;
    @Autowired
    private CursoService cursoService;
    @Autowired
    private InstitucionService institucionService;
    @Autowired
    private JefeDePracticaRepository jpRepository;
    private ModelMapper modelMapper = new ModelMapper();
    @Autowired
    private AlumnoRepository alumnoRepository;
    @Autowired
    private AlumnoService alumnoService;
    // Método para insertar un nuevo horario
    //! INSERTAR HORARIO
    public HorarioDTO insertarHorario(HorarioInsertDTO horarioInsertDTO) {
        try {
            // Obtener la información del curso utilizando el método del servicio CursoService
            CursoDTO cursoDTO = cursoService.obtenerCursoPorId(horarioInsertDTO.getCurso().getIdCurso());
            if (cursoDTO == null) {
                logger.error("Curso con ID {} no encontrado.", horarioInsertDTO.getCurso().getIdCurso());
                throw new RuntimeException("Curso con ID " + horarioInsertDTO.getCurso().getIdCurso() + " no encontrado.");
            }
            // Crear un nuevo objeto Horario y asignar los valores del CursoDTO y otros datos del DTO de inserción
            Horario horario = new Horario();
            horario.setCodigo(horarioInsertDTO.getCodigo());

            //Aca forma el codigo con el numero de horarios que tiene el curso
            int cantidadHorarios = contarHorariosActivosYVisibles(horarioInsertDTO.getCurso().getIdCurso());
            //EJEM 601  o 602 o 603 y asi sucesivamente se le suma 1 a la cantida de horaruios existente 
            //Pero siempre comienza en 600  pero es un numero fijo no tiene que ver con curso
            horario.setCodigo("" + (600 + cantidadHorarios + 1));
            horario.setCurso(modelMapper.map(cursoDTO, pe.edu.pucp.onepucp.institucion.model.Curso.class)); // Asociar el curso mapeado
            horario.setNombreCurso(cursoDTO.getNombre());
            horario.setCodigoCurso(cursoDTO.getCodigo());
            horario.setCreditoCurso(cursoDTO.getCreditos());
            horario.setCantAlumnos(horarioInsertDTO.getCantAlumnos()); // Asignar la cantidad de alumnos
            horario.setVisible(horarioInsertDTO.isVisible()); // Asignar visibilidad
            horario.setActivo(true); // Asignar activo
            horario.setTipoHorario(horarioInsertDTO.getTipoHorario()); // Asignar tipo de horario
            //!Ahora se asigna el semestre actual
            Long idInstitucion = 1L;
            Long idSemestreActual=institucionService.obtenerSemestrePorIdInstitucion(idInstitucion);
            if(idSemestreActual==null){
                logger.error("No se encontro el semestre actual");
                throw new RuntimeException("No se encontro el semestre actual");
            }
            else
            {
                logger.info("Semestre actual encontrado con ID: {}", idSemestreActual);
                Semestre semestre = new Semestre();
                semestre.setIdSemestre(idSemestreActual);
                horario.setSemestre(semestre);
            }

            // Guardar el nuevo horario en la base de datos
            
            Horario horarioGuardado = horarioRepository.save(horario);

            // Mapear el Horario guardado a HorarioDTO
            HorarioDTO horarioDTO = modelMapper.map(horarioGuardado, HorarioDTO.class);
            logger.info("Horario insertado exitosamente con ID: {}", horarioDTO.getIdHorario());

            return horarioDTO;

        } catch (RuntimeException e) {
            logger.error("Error al insertar el horario: {}", e.getMessage());
            throw new RuntimeException("No se pudo insertar el horario. Verifique los datos e intente nuevamente.");
        } catch (Exception e) {
            logger.error("Error inesperado al insertar el horario: {}", e.getMessage());
            throw new RuntimeException("Ocurrió un error inesperado. Verifique los datos e intente nuevamente.");
        }
    }

    //! ACTUALIZAR HORARIO
    @Transactional
    public HorarioDTO actualizarHorario(Long idHorario, HorarioInsertDTO horarioInsertDTO) {
        try {
            // Validar la existencia del horario a actualizar
            Optional<Horario> horarioOptional = horarioRepository.findById(idHorario);
            if (!horarioOptional.isPresent()) {
                logger.error("Horario con ID {} no encontrado.", idHorario);
                throw new RuntimeException("Horario con ID " + idHorario + " no encontrado.");
            }

            Horario horarioExistente = horarioOptional.get();

            // Actualizar los campos permitidos
            horarioExistente.setCodigo(horarioInsertDTO.getCodigo());
            horarioExistente.setCantAlumnos(horarioInsertDTO.getCantAlumnos()); // Actualizar la cantidad de alumnos
            horarioExistente.setVisible(horarioInsertDTO.isVisible()); // Actualizar visibilidad
            horarioExistente.setActivo(true); // Actualizar activo
            horarioExistente.setTipoHorario(horarioInsertDTO.getTipoHorario()); // Actualizar tipo de horario
            // Guardar el horario actualizado en la base de datos
            logger.info("Actualizando horario con ID: {}", idHorario);
            logger.info("Horario actualizado: {}", horarioExistente.getTipoHorario().toString());
            Horario horarioActualizado = horarioRepository.save(horarioExistente);

            // Mapear el Horario actualizado a HorarioDTO
            HorarioDTO horarioDTO = modelMapper.map(horarioActualizado, HorarioDTO.class);
            logger.info("Horario con ID {} actualizado exitosamente.", horarioDTO.getIdHorario());

            return horarioDTO;

        } catch (Exception e) {
            logger.error("Error al actualizar el horario: {}", e.getMessage());
            throw new RuntimeException("No se pudo actualizar el horario. Verifique los datos e intente nuevamente.");
        }
    }

    // !Métodos para obtener horarios por curso
    public List<HorarioDTO> obtenerHorariosPorCurso(int idCurso) {
        logger.info("Obteniendo horarios para el curso con ID: {}", idCurso);  // Logging de inicio del método
        // Obtener la lista de horarios desde el repositorio
        List<Horario> horarios = horarioRepository.findByCursoIdCurso(idCurso);

        // Mapear cada objeto Horario a HorarioDTO
        return mapToHorarioDTOList(horarios);
    }

    //! Método para mapear una lista de Horario a HorarioDTO
    private List<HorarioDTO> mapToHorarioDTOList(List<Horario> horarios) {
        List<HorarioDTO> horarioDTOs = new ArrayList<>();

        for (Horario horario : horarios) {
            HorarioDTO horarioDTO = new HorarioDTO();

            // Asignar propiedades de Horario a HorarioDTO
            horarioDTO.setIdHorario(horario.getIdHorario());
            horarioDTO.setCodigo(horario.getCodigo());
            horarioDTO.setNombreCurso(horario.getCurso().getNombre());
            horarioDTO.setCodigoCurso(horario.getCurso().getCodigo());
            horarioDTO.setCreditoCurso(horario.getCurso().getCreditos());
            horarioDTO.setCantAlumnos(horario.getCantAlumnos());
            horarioDTO.setVisible(horario.isVisible());
            horarioDTO.setActivo(horario.isActivo());

            // Mapear la lista de docentes a DocenteDTO
            List<DocenteDTO> docenteDTOs = new ArrayList<>();
            for (Persona obj : horario.getDocentes()) {
                DocenteDTO doc = new DocenteDTO();
                doc.setId(obj.getId());
                doc.setNombre(obj.getNombre());
                docenteDTOs.add(doc);
            }

            horarioDTO.setDocentes(docenteDTOs);

            horarioDTOs.add(horarioDTO);
        }

        logger.info("Se han mapeado {} horarios.", horarioDTOs.size());  // Logging de la cantidad de elementos mapeados
        return horarioDTOs;
    }

    //! LISTAR HORARIOS ACTIVOS POR CURSO
    public List<HorarioDTO> listarHorariosActivosPorCurso(Long idCurso) {
        // Obtener la lista de horarios activos desde el repositorio
        List<Horario> horariosActivos = horarioRepository.findHorariosActivosByCursoId(idCurso);

        // Convertir cada entidad Horario a HorarioDTO
        return horariosActivos.stream()
                .map(horario -> modelMapper.map(horario, HorarioDTO.class))
                .collect(Collectors.toList());
    }

    // ?Métodos para búsquedas y listados específicos
    public List<Horario> buscarPorEspecialidadSemestre(String especialidad, String semestre) {
        logger.info("Buscando horarios para especialidad: {} y semestre: {}", especialidad, semestre);  // Logging de parámetros
        return horarioRepository.findHorariosByEspecialidadAndSemestre(especialidad, semestre);
    }

    //! Obtener todos los delegados de horarios
    public List<HorarioDelegadoDTO> obtenerTodosLosDelegados() {
        logger.info("Obteniendo todos los delegados de horarios");
        List<Horario> delegados = (List<Horario>) horarioRepository.findAll();
        modelMapper.typeMap(Horario.class, HorarioDelegadoDTO.class).addMappings(mapper -> {
            mapper.map(src -> src.getCurso().getNombre(), HorarioDelegadoDTO::setCursoNombre);
        });
        List<HorarioDelegadoDTO> horarioDelegadoDTOS = modelMapper.map(delegados, new TypeToken<List<HorarioDelegadoDTO>>() {
        }.getType());

        return horarioDelegadoDTOS;
    }

    // ?Métodos para asignación de docentes y delegados
    //! Asignar docentes a un horario
    public void asignarDocenteAHorario(Long idHorario, List<Long> idDocentes) {
        for (Long idDocente : idDocentes) {
            int exists = horarioRepository.existsByHorarioIdAndDocenteId(idHorario, idDocente);
            if (exists == 0) {
                logger.info("Asignando docente con ID: {} al horario con ID: {}", idDocente, idHorario);
                // Si no está asignado, realiza la asignación
                horarioRepository.asignarDocenteAHorario(idDocente, idHorario);
            } else {
                logger.warn("El docente con ID: {} ya está asignado al horario con ID: {}", idDocente, idHorario);  // Warning
            }
        }
    }

    //! Asignar delegado a un horario
    public void asignarDelegadoAHorario(Long idHorario, Long idDelegado) {
        logger.info("Asignando delegado con ID: {} al horario con ID: {}", idDelegado, idHorario);
        // Si no está asignado, realiza la asignación
        horarioRepository.asignarNuevoDelegado(idDelegado, idHorario);
    }

    // ?Métodos para listar horarios y delegados por persona
    //! Listar horarios por ID de persona
    public List<HorarioDTO> listarHorariosPorPersonaId(Long personaId) {
        logger.info("Listando horarios para la persona con ID: {}", personaId);
        List<Horario> horarios = horarioRepository.findByDocentesId(personaId);

        modelMapper.typeMap(Horario.class, HorarioDTO.class).addMappings(mapper -> {
            mapper.map(Horario::getIdHorario, HorarioDTO::setIdHorario);
            mapper.map(Horario::getCodigo, HorarioDTO::setCodigo);
            mapper.map(Horario::getCantAlumnos, HorarioDTO::setCantAlumnos);
            mapper.map(Horario::isVisible, HorarioDTO::setVisible);
            mapper.map(Horario::isActivo, HorarioDTO::setActivo);
        });

        return modelMapper.map(horarios, new TypeToken<List<HorarioDTO>>() {
        }.getType());
    }

    //! Eliminar delegado de un horario
    public void eliminarDelegadoDeHorario(Long idHorario) {
        logger.info("Eliminando delegado del horario con ID: {}", idHorario);
        Horario horario = horarioRepository.findById(idHorario)
                .orElseThrow(() -> {
                    logger.error("Horario con ID: {} no encontrado", idHorario);  // Error
                    return new RuntimeException("Horario no encontrado con id: " + idHorario);
                });

        // Cambiar el delegado a null
        horario.setDelegado(null);

        // Guardar los cambios
        horarioRepository.save(horario);
        logger.info("Delegado eliminado para el horario con ID: {}", idHorario);
    }

    // ?Métodos para listar jefes de práctica y docentes por horario
    //! Listar jefes de práctica por ID de horario
    public List<JefeDePracticaDTO> listarJpsPorHorario(Long id) {
        logger.info("Listando Jefes de Práctica para el horario con ID: {}", id);
        List<JefeDePractica> jefesDePractica = horarioRepository.findJpsByHorarioId(id);

        // Mapear a DTO
        return jefesDePractica.stream()
                .map(jp -> modelMapper.map(jp, JefeDePracticaDTO.class))
                .collect(Collectors.toList());
    }

    public JefeDePracticaDTO obtenerJpPorId(Long id) {
        logger.info("Buscando Jefe de Práctica con ID: {}", id);
        Optional<JefeDePractica> jefeDePracticaOptional = jpRepository.findById(id);

        // Verificar si existe el Jefe de Práctica
        if (jefeDePracticaOptional.isPresent()) {
            // Obtener el Jefe de Práctica
            JefeDePractica jp = jefeDePracticaOptional.get();

            // Crear y devolver el DTO manualmente
            JefeDePracticaDTO jpDTO = new JefeDePracticaDTO();
            jpDTO.setIdJefeDePractica(jp.getIdJefeDePractica());
            jpDTO.setNombre(jp.getNombre());
            jpDTO.setCalificacionAnual(jp.getCalificacionAnual());
            jpDTO.setActivo(jp.isActivo());

            return jpDTO;
        } else {
            logger.warn("No se encontró Jefe de Práctica con ID: {}", id);
            return null; // O puedes retornar una excepción o un valor adecuado dependiendo de tu caso de uso
        }
    }

    //! Listar docentes por ID de horario
    public List<DocenteDTO> listarDocentesPorHorario(Long id) {
        logger.info("Listando docentes para el horario con ID: {}", id);
        List<Docente> docentes = horarioRepository.findDocentesByHorarioId(id);

        // Mapear a DTO
        return docentes.stream()
                .map(docente -> modelMapper.map(docente, DocenteDTO.class))
                .collect(Collectors.toList());
    }

    // ?Métodos para obtener horario y jefes de práctica por ID
    //! Obtener horario por ID
    public HorarioDTO obtenerHorarioPorId(Long idHorario) {
        logger.info("Obteniendo horario con ID: {}", idHorario);
        Optional<Horario> horario = horarioRepository.findById(idHorario);
        return horario.map(h -> modelMapper.map(h, HorarioDTO.class))
                .orElseThrow(() -> {
                    logger.error("Horario con ID: {} no encontrado", idHorario);  // Error
                    return new RuntimeException("Horario no encontrado con ID: " + idHorario);
                });
    }

    //! Listar todos los jefes de práctica
    public List<JefeDePracticaDTO> listarTodosJPs() {
        logger.info("Listando todos los Jefes de Práctica");
        List<JefeDePractica> jps = horarioRepository.findAllJps();

        // Mapear a DTO
        return jps.stream()
                .map(jp -> modelMapper.map(jp, JefeDePracticaDTO.class))
                .collect(Collectors.toList());
    }

    //! CONTAR HORARIOS ACTIVOS Y VISIBLES DEL CURSO
    public int contarHorariosActivosYVisibles(Long idCurso) {
        try {
            // Validar la existencia del curso
            boolean existeCurso = cursoService.existeCursoPorId(idCurso);
            if (!existeCurso) {
                logger.error("Curso con ID {} no encontrado.", idCurso);
                throw new RuntimeException("Curso con ID " + idCurso + " no encontrado.");
            }

            // Contar los horarios activos y visibles usando el repositorio
            long cantidadHorarios = horarioRepository.contarHorariosActivosYVisibles(idCurso);

            logger.info("El curso con ID {} tiene {} horarios activos y visibles.", idCurso, cantidadHorarios);
            return (int) cantidadHorarios;

        } catch (Exception e) {
            logger.error("Error al contar los horarios activos y visibles del curso con ID {}: {}", idCurso, e.getMessage());
            throw new RuntimeException("No se pudo contar los horarios. Verifique los datos e intente nuevamente.");
        }
    }
    //! ELIMINAR HORARIO (SOFT DELETE)

    public void eliminarHorario(Long idHorario) {
        try {
            logger.info("Iniciando proceso de eliminación lógica del horario con ID: {}", idHorario);
            horarioRepository.eliminarLogicamente(idHorario);
            logger.info("Horario con ID: {} marcado como inactivo.", idHorario);
        } catch (Exception e) {
            logger.error("Error al eliminar el horario con ID: {}: {}", idHorario, e.getMessage());
            throw new RuntimeException("No se pudo eliminar el horario. Verifique los datos e intente nuevamente.");
        }
    }

    public boolean existePorCodigoCursoYTipo(String codigo, String codigoCurso, TipoHorario tipoHorario) {
        logger.info("Verificando si existe un horario con código: {}, código curso: {}, tipo: {}", codigo, codigoCurso, tipoHorario);

        try {
            boolean existe = horarioRepository.existsByCodigoAndCodigoCursoAndTipoHorarioAndActivoTrue(codigo, codigoCurso, tipoHorario);
            if (existe) {
                logger.info("EXISTE Horario encontrado con los criterios proporcionados.");
            } else {
                logger.warn("No se EXISTE ningún horario con los criterios proporcionados.");
            }
            return existe;
        } catch (Exception e) {
            logger.error("Error inesperado al verificar el horario: código {}, código curso {}, tipo {}", codigo, codigoCurso, tipoHorario, e);
            throw new RuntimeException("Ocurrió un error al verificar la existencia del horario.", e);
        }
    }
    public Optional<HorarioInsertDTO> obtenerPorCodigoCursoYTipo(String codigo, String codigoCurso, TipoHorario tipoHorario) {
        logger.info("Obteniendo horario con código: {}, código curso: {}, tipo: {}", codigo, codigoCurso, tipoHorario);

        try {
            Optional<Horario> horario = horarioRepository.findByCodigoAndCodigoCursoAndTipoHorarioAndActivoTrue(codigo, codigoCurso, tipoHorario);
            if (horario.isPresent()) {
                logger.info("Horario encontrado con los criterios proporcionados.");
            } else {
                logger.warn("No se encontró ningún horario con los criterios proporcionados.");
            }
            return horario.map(h -> modelMapper.map(h, HorarioInsertDTO.class));
        } catch (Exception e) {
            logger.error("Error inesperado al obtener el horario: código {}, código curso {}, tipo {}", codigo, codigoCurso, tipoHorario, e);
            throw new RuntimeException("Ocurrió un error al obtener el horario.", e);
        }
    }
      
    public AlumnoHorarioDTO insertarRelacionAlumnoHorario(AlumnoDTO alumnoDTO, HorarioInsertDTO horarioDTO) {
        try {
            logger.info("Iniciando proceso para relacionar alumno con ID: {} y horario con ID: {}", 
                        alumnoDTO.getId(), horarioDTO.getIdHorario());

            modelMapper  = new ModelMapper();

            Horario horario = modelMapper.map(horarioDTO, Horario.class);
            Alumno alumno = modelMapper.map(alumnoDTO, Alumno.class);
            // Agregar el alumno a la lista de alumnos del horario
            if (!horario.getAlumnos().contains(alumno)) {
                horario.getAlumnos().add(alumno);
                horarioRepository.save(horario);
                logger.info("Alumno agregado al horario correctamente.");
            } else {
                logger.warn("El alumno ya está asociado a este horario.");
            }

            // Crear un DTO para devolver la relación guardada
            AlumnoHorarioDTO relacionGuardada = new AlumnoHorarioDTO();
            relacionGuardada.setAlumno(alumnoDTO);
            relacionGuardada.setHorario(horarioDTO);

            return relacionGuardada;

        } catch (IllegalArgumentException e) {
            logger.error("Error al insertar relación Alumno-Horario: {}", e.getMessage());
            throw e; // Re-throw para que sea manejado por el controlador
        } catch (Exception e) {
            logger.error("Error inesperado al insertar relación Alumno-Horario", e);
            throw new RuntimeException("Error inesperado al insertar la relación", e);
        }
    }

    @Transactional
    public HorarioInsertDTO agregarAlumnosAHorario(Long idHorario, List<AlumnoDTOInsert> nuevosAlumnos) {
        // Validar que el horario existe
        logger.info("Agregando alumnos al horario con ID: {}", idHorario);
        Optional<Horario> horarioOptional = horarioRepository.findById(idHorario);
        if (!horarioOptional.isPresent()) {
            throw new RuntimeException("El horario con ID " + idHorario + " no existe");
        }
        
        Horario horario = horarioOptional.get();
        
        // Validar que el horario esté activo
        if (!horario.isActivo()) {
            throw new RuntimeException("El horario no está activo");
        }

        // Obtener la lista actual de alumnos
        List<Alumno> alumnosActuales = horario.getAlumnos();
        
        // Convertir AlumnoDTOInsert a Alumno y agregar
        for (AlumnoDTOInsert alumnoDTO : nuevosAlumnos) {
            Optional<Alumno> alumnoOptional = alumnoRepository.findById(alumnoDTO.getId());
            
            if (!alumnoOptional.isPresent()) {
                throw new RuntimeException("El alumno con ID " + alumnoDTO.getId() + " no existe");
            }
            
            Alumno alumno = alumnoOptional.get();
            
            // Verificar si el alumno ya está en el horario
            if (!alumnosActuales.contains(alumno)) {
                alumnosActuales.add(alumno);
            }
        }
        
        // Actualizar la cantidad de alumnos
        horario.setCantAlumnos(alumnosActuales.size());
        
        // Guardar los cambios
        horario = horarioRepository.save(horario);
        
        // Convertir el resultado a HorarioInsertDTO
        return convertirAHorarioInsertDTO(horario);
    }

    private HorarioInsertDTO convertirAHorarioInsertDTO(Horario horario) {
        HorarioInsertDTO dto = new HorarioInsertDTO();
        dto.setIdHorario(horario.getIdHorario());
        dto.setCodigo(horario.getCodigo());
        dto.setVisible(horario.isVisible());
        dto.setNombreCurso(horario.getNombreCurso());
        dto.setCodigoCurso(horario.getCodigoCurso());
        dto.setCreditoCurso(horario.getCreditoCurso());
        dto.setCantAlumnos(horario.getCantAlumnos());
        dto.setTipoHorario(horario.getTipoHorario());
        
        // Convertir la lista de Alumno a AlumnoDTOInsert
        List<AlumnoDTOInsert> alumnosDTO = horario.getAlumnos().stream()
            .map(this::convertirAAlumnoDTOInsert)
            .collect(Collectors.toList());
        dto.setAlumnos(alumnosDTO);
        
        return dto;
    }

    private AlumnoDTOInsert convertirAAlumnoDTOInsert(Alumno alumno) {
        AlumnoDTOInsert dto = new AlumnoDTOInsert();
        dto.setId(alumno.getId());
        // Aquí deberías setear los demás campos necesarios del AlumnoDTOInsert
        // según la estructura de tu DTO
        return dto;
    }
}
