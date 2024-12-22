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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import jakarta.transaction.Transactional;
import pe.edu.pucp.onepucp.institucion.dto.CursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.model.Curso;
import pe.edu.pucp.onepucp.institucion.model.Semestre;
import pe.edu.pucp.onepucp.institucion.repository.CursoRepository;
@Service
public class CursoService {

    private static final Logger logger = LoggerFactory.getLogger(CursoService.class);

    @Autowired
    CursoRepository repository;
    private ModelMapper modelMapper = new ModelMapper();
    @Autowired  
    private InstitucionService institucionService;
    //!INSERTAR
    public CursoDTO insertarCurso(CursoDTO cursoDTO) {
        logger.info("Iniciando proceso de inserción de curso");
        cursoDTO.setIdCurso(null);  // Asegurarse de que el ID sea nulo para evitar prob
        cursoDTO.setActivo(true);  // Asegurarse de que el curso esté activo
        // Validación de datos
        if (cursoDTO == null || cursoDTO.getCodigo() == null || cursoDTO.getNombre() == null) {
            logger.error("Datos del curso son inválidos");
            throw new IllegalArgumentException("Datos del curso son inválidos");
        }
        
        // Convertir DTO a entidad  
        Curso curso = modelMapper.map(cursoDTO, Curso.class);
                // Insertar el curso en la relacion semestre - curso
            
        //?Primero se obtiene el semestre por id de institucion el semestre actual
        Long idInst = 1L;
        Long IdSemestreActual=institucionService.obtenerSemestrePorIdInstitucion(idInst);
        //?Luego se inserta el curso en la tabla semestre_curso
        //?Se inserta el curso en la tabla curso
        if(IdSemestreActual!=null){
            Semestre semestre = new Semestre();
            semestre.setIdSemestre(IdSemestreActual);
            //El curso tiene varios semestres
            ArrayList<Semestre> semestres = new ArrayList<Semestre>();
            semestres = (ArrayList<Semestre>) curso.getSemestres();
            if(semestres==null){
                semestres = new ArrayList<Semestre>();
            } 
            List <Semestre> semestres2 = new ArrayList<Semestre>();
            semestres2 = semestres.stream().toList();
            curso.setSemestres(semestres2);
            logger.info("Semestre actual encontrado con ID: {}", IdSemestreActual);
        }
        else{
            logger.error("No se encontro el semestre actual");
            throw new RuntimeException("No se encontro el semestre actual");
        }
        
        // Guardar el curso
        curso.setActivo(true);
        curso = repository.save(curso);
        logger.info("Curso insertado exitosamente con ID: {}", curso.getIdCurso());



        // Convertir la entidad guardada de vuelta a DTO
        return modelMapper.map(curso, CursoDTO.class);
    }

    //!ACTUALIZAR
    @Transactional
    public CursoDTO actualizarCurso(Long idCurso, CursoDTO cursoDTO) {
        logger.info("Iniciando proceso de actualización del curso con ID: {}", idCurso);
        logger.info("Datos del curso a actualizar: {}", cursoDTO.imprimeCursoDTO());
        // Validación de existencia
        Optional<Curso> cursoOptional = repository.findByIdCurso(idCurso);
        if (!cursoOptional.isPresent()) {
            logger.error("Curso con ID {} no encontrado.", idCurso);
            throw new RuntimeException("Curso con ID " + idCurso + " no encontrado.");
        }

        // Convertir DTO a entidad
        Curso curso = cursoOptional.get();
        modelMapper.map(cursoDTO, curso);  // Actualizar solo los campos del curso

        // Guardar los cambios en la base de datos
        curso.setActivo(true);
        curso = repository.save(curso);
        logger.info("Curso actualizado exitosamente con ID: {}", curso.getIdCurso());

        // Convertir la entidad actualizada a DTO
        return modelMapper.map(curso, CursoDTO.class);
    }
    //? actualiza cursos pero solo algunos campos
    @Transactional
    public CursoDTO actualizarCursoParcial(Long idCurso, CursoDTO cursoDTO) {
        logger.info("Iniciando proceso de actualización del curso con ID: {}", idCurso);
        logger.info("Datos del curso a actualizar: {}", cursoDTO.imprimeCursoDTO());
    
        // Validación de existencia
        Optional<Curso> cursoOptional = repository.findByIdCurso(idCurso);
        if (!cursoOptional.isPresent()) {
            logger.error("Curso con ID {} no encontrado.", idCurso);
            throw new RuntimeException("Curso con ID " + idCurso + " no encontrado.");
        }
    
        // Convertir DTO a entidad
        Curso curso = cursoOptional.get();
    
        // Solo actualizamos los campos que están presentes en el DTO
        if (cursoDTO.getCodigo() != null) {
            curso.setCodigo(cursoDTO.getCodigo());
        }
        if (cursoDTO.getNombre() != null) {
            curso.setNombre(cursoDTO.getNombre());
        }
        if (cursoDTO.getCreditos() != 0) {  // Asumimos que 0 no es un valor válido para créditos
            curso.setCreditos(cursoDTO.getCreditos());
        }
        if (cursoDTO.isActivo() != curso.isActivo()) {  // Comprobamos si el valor es distinto
            curso.setActivo(cursoDTO.isActivo());
        }
    
        // Guardar los cambios en la base de datos
        curso.setActivo(true);
        curso = repository.save(curso);
        logger.info("Curso actualizado exitosamente con ID: {}", curso.getIdCurso());
    
        // Convertir la entidad actualizada a DTO
        return modelMapper.map(curso, CursoDTO.class);
    }
    
    public List<CursoDTO> getCursoDTOByCodigoNombreAndFacultad(String codigo, String nombre, String nombreFacultad) {
        logger.info("Buscando cursos con código: {}, nombre: {}, facultad: {}", codigo, nombre, nombreFacultad);

        // Obtener la lista de cursos directamente desde el repositorio
        List<Curso> cursos = repository.findCursoByCodigoNombreAndFacultad(codigo, nombre, nombreFacultad);

        // Mapear los objetos Curso a CursoDTO
        return mapToCursoDTOList(cursos);
    }

    public List<CursoDTO> buscarCursosNombreCodigoFacultad(String nombre, String codigo, String nombreFacultad) {
        logger.info("Buscando cursos con filtros - nombre: {}, código: {}, facultad: {}", nombre, codigo, nombreFacultad);

        // Si los parámetros están vacíos, pásalos como null al repositorio
        String nombreFiltro = StringUtils.hasText(nombre) ? nombre : null;
        String codigoFiltro = StringUtils.hasText(codigo) ? codigo : null;
        String facultadFiltro = StringUtils.hasText(nombreFacultad) ? nombreFacultad : null;

        List<Curso> cursos = repository.buscarCursosNombreCodigoFacultad(nombreFiltro, codigoFiltro, facultadFiltro);
        List<CursoDTO> cursoDTOS = cursos.stream()
        .map(curso -> modelMapper.map(curso, CursoDTO.class))
        .collect(Collectors.toList());

        logger.info("Se encontraron {} cursos", cursoDTOS.size());
        return cursoDTOS;
    }

    // Método de mapeo de los resultados de Curso a CursoDTO
    private List<CursoDTO> mapToCursoDTOList(List<Curso> cursos) {
        List<CursoDTO> cursoDTOs = new ArrayList<>();

        for (Curso curso : cursos) {
            CursoDTO dto = new CursoDTO();

            // Asignación de propiedades de Curso a CursoDTO
            dto.setIdCurso(curso.getIdCurso());
            dto.setCodigo(curso.getCodigo());
            dto.setNombre(curso.getNombre());
            dto.setCreditos(curso.getCreditos());
            dto.setActivo(curso.isActivo());

            // Mapear la Especialidad a EspecialidadDTO
            EspecialidadDTO especialidadDTO = new EspecialidadDTO();
            especialidadDTO.setId(curso.getEspecialidad().getId());
            especialidadDTO.setNombre(curso.getEspecialidad().getNombre());
            dto.setEspecialidad(especialidadDTO);

            cursoDTOs.add(dto);
        }
        return cursoDTOs;
    }

    public Page<CursoDTO> obtenerTodasLosCursos(Pageable pageable) {
        logger.info("Obteniendo todos los cursos con paginación");

        Page<Curso> cursos = repository.findAll(pageable);
        modelMapper.getConfiguration()
                .setAmbiguityIgnored(true) // Ignora ambigüedades en los tipos de datos
                .setPropertyCondition(context -> context.getSource() != null);
        // Convertir la lista inmutable a mutable antes de mapear
        List<CursoDTO> cursoDTOS = cursos.getContent().stream()
                .map(curso -> modelMapper.map(curso, CursoDTO.class))
                .toList();

        // Crear y retornar una nueva página con los DTOs y la misma información de paginación
        return new PageImpl<>(cursoDTOS, pageable, cursos.getTotalElements());
    }

    public List<CursoDTO> buscarPorEspecialidadYSemestre(String especialidad, String semestre) {
        // Realizar la búsqueda en el repositorio

        List<Curso> cursos = repository.findCursoByEspecialidadAndSemestre(especialidad, semestre);
        
        // Mapear la lista de Cursos a una lista de CursoDTOs
        List<CursoDTO> cursoDTOS = modelMapper.map(cursos, new TypeToken<List<CursoDTO>>() {}.getType());
        
        // Retornar la lista de DTOs
        return cursoDTOS;
    }
    public List<CursoDTO> buscarEspecialidad(String especialidad){
        // Realizar la búsqueda en el repositorio
        List<Curso> cursos = repository.findCursoByEspecialidad(especialidad);

        // Mapear la lista de Cursos a una lista de CursoDTOs
        List<CursoDTO> cursoDTOS = cursos.stream()
            .map(curso -> modelMapper.map(curso, CursoDTO.class))
            .toList();
        // Retornar la lista de DTOs
        return cursoDTOS;
    }
 /*   public List<Curso> buscarPorEspecialidadYSemestre(String especialidad, String semestre) {
        logger.info("Buscando cursos por especialidad: {} y semestre: {}", especialidad, semestre);

        return repository.findCursoByEspecialidadAndSemestre(especialidad, semestre);
    }
*/
    //!EXISTE POR CODIGO
    public boolean existePorCodigo(String codigo) {
        logger.info("Verificando existencia de curso con código: {}", codigo);

        return repository.existsByCodigo(codigo);
    }

    //!eliminar
    //!SOFT DELETE: MARCAR COMO INACTIVO
    public void eliminarCurso(Long idCurso) {
        logger.info("Iniciando proceso de eliminación (soft delete) del curso con ID: {}", idCurso);

        // Validar si el curso existe
        Optional<Curso> cursoOptional = repository.findById(idCurso);
        if (!cursoOptional.isPresent()) {
            logger.error("Curso con ID {} no encontrado.", idCurso);
            throw new RuntimeException("Curso con ID " + idCurso + " no encontrado.");
        }

        // Marcar el curso como inactivo
        Curso curso = cursoOptional.get();
        curso.setActivo(false);  // Cambiamos el campo "activo" a false, para indicar que está "eliminado" lógicamente
        repository.save(curso);

        logger.info("Curso con ID {} marcado como inactivo", idCurso);
    }
    //! OBTENER CURSO POR ID
    public CursoDTO obtenerCursoPorId(Long idCurso) {
        logger.info("Iniciando proceso para obtener curso con ID: {}", idCurso);

        Optional<Curso> cursoOptional = repository.findByIdCurso(idCurso);
        if (!cursoOptional.isPresent()) {
            logger.error("Curso con ID {} no encontrado.", idCurso);
            throw new RuntimeException("Curso con ID " + idCurso + " no encontrado.");
        }

        // Mapear la entidad Curso a CursoDTO
        CursoDTO cursoDTO = modelMapper.map(cursoOptional.get(), CursoDTO.class);
        logger.info("Curso con ID {} obtenido exitosamente", idCurso);
        
        return cursoDTO;
    }

    //!EXISTE CURSO POR ID
    public boolean existeCursoPorId(Long idCurso) {
        logger.info("Verificando existencia de curso con ID: {}", idCurso);

        return repository.existsByIdCursoAndActivoTrue(idCurso);
    }
    
}
