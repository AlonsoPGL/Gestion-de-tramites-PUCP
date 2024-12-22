package pe.edu.pucp.onepucp.rrhh.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.ss.usermodel.*;
import java.util.List;
import jakarta.persistence.EntityNotFoundException;
import pe.edu.pucp.onepucp.institucion.dto.HorarioDTO;
import pe.edu.pucp.onepucp.institucion.dto.JefeDePracticaDTO;
import pe.edu.pucp.onepucp.institucion.model.Horario;
import pe.edu.pucp.onepucp.institucion.repository.HorarioRepository;
import pe.edu.pucp.onepucp.rrhh.controller.ExcelProcessingResult;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.dto.AlumnoEnRiesgo_X_HorarioDTO;
import pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO;

import pe.edu.pucp.onepucp.rrhh.dto.AlumnoDTO;
import pe.edu.pucp.onepucp.rrhh.model.Alumno;
import pe.edu.pucp.onepucp.rrhh.model.AlumnoEnRiesgo_X_Horario;
import pe.edu.pucp.onepucp.rrhh.repository.AlumnoEnRiesgoRepository;
import pe.edu.pucp.onepucp.rrhh.repository.AlumnoEnRiesgo_X_HorarioRepository;
import pe.edu.pucp.onepucp.rrhh.repository.AlumnoRepository;
//loger
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AlumnoService {
    @Autowired
    AlumnoRepository repository;
    @Autowired
    AlumnoEnRiesgoRepository repositoryAlumnoEnRiesgo;
    @Autowired
    HorarioRepository repositoryHorario;
    @Autowired
    private AlumnoEnRiesgo_X_HorarioRepository alumnoEnRiesgoXHorarioRepository;

    private ModelMapper modelMapper;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AlumnoService.class);

    public Optional<Alumno> buscarPorNombreApellidoYCodigo(String nombre, String apellidoPaterno, String apellidoMaterno, int codigo) {
        return repository.findByNombreAndApellidoPaternoAndApellidoMaternoAndCodigo(nombre,apellidoPaterno, apellidoMaterno, codigo);
    }

    /******* ALUMNOS EN RIESGO  *********/
    //  Crear un Alumno en Riesgo
    public Alumno registrarAlumnoEnRiesgo(Alumno alumno) {
        alumno.setEnRiesgo(true);
        return repository.save(alumno);
    }
    //!OBTENER
    // Buscar Alumno por ID
    public Alumno obtenerAlumnoPorId(Long id) {
        return repository.findById(id).orElse(null);
    }
    public AlumnoDTO obtenerAlumnoActivoPorId(Long id) {
        logger.info("Iniciando búsqueda de alumno activo con ID: {}", id);

        try {
            Alumno alumno = repository.findByIdAndActivoTrue(id)
                    .orElseThrow(() -> {
                        logger.warn("No se encontró un alumno activo con ID: {}", id);
                        return new NoSuchElementException("No se encontró un alumno activo con el ID: " + id);
                    });

            logger.info("Alumno activo encontrado: {}", alumno.getNombre());
            return alumno.toDTO();
        } catch (NoSuchElementException e) {
            logger.error("Error: {}", e.getMessage());
            throw e; // Re-lanzar para manejarlo en el controlador o capa superior
        } catch (Exception e) {
            logger.error("Error inesperado al buscar el alumno activo con ID: {}", id, e);
            throw new RuntimeException("Ocurrió un error inesperado al buscar el alumno activo.");
        }
    }
    /**
     * Obtener un alumno activo por código
     *
     * @param codigo Código del alumno
     * @return AlumnoDTO si existe y está activo
     * @throws NoSuchElementException si no se encuentra o no está activo
     */
    public AlumnoDTO obtenerAlumnoActivoPorCodigo(int codigo) {
        logger.info("Iniciando búsqueda del primer alumno activo con código: {}", codigo);

        try {
            Alumno alumno = repository.findFirstByCodigoAndActivoTrue(codigo)
                    .orElseThrow(() -> {
                        logger.warn("No se encontró un alumno activo con el código: {}", codigo);
                        return new NoSuchElementException("No se encontró un alumno activo con el código: " + codigo);
                    });

            logger.info("Alumno activo encontrado: {}", alumno.getNombre());
            return alumno.toDTO();
        } catch (NoSuchElementException e) {
            logger.error("Error: {}", e.getMessage());
            throw e; // Re-lanzar para manejarlo en el controlador
        } catch (Exception e) {
            logger.error("Error inesperado al buscar el alumno activo con código: {}", codigo, e);
            throw new RuntimeException("Ocurrió un error inesperado al buscar el alumno activo.");
        }
    }
    // Buscar Alumno por Codigo
    public Alumno obtenerAlumnoPorCodigo(Long codigoAlumno) {
        return repository.findAlumnoByCodigo(codigoAlumno);
    }
    // Buscar por código de alumno
    public Optional<Alumno> buscarPorCodigo(Long codigo) {
        return repository.findByCodigo(codigo);
    }
    public AlumnoDTO obtenerAlumnoPorCodigoDTO(Long codigo) {
        logger.info("Iniciando búsqueda de alumno con código: {}", codigo);

        try {
            Alumno alumno = repository.findAlumnoByCodigo(codigo);
            if (alumno == null) {
                logger.warn("No se encontró un alumno con el código: {}", codigo);
                throw new NoSuchElementException("No se encontró un alumno con el código: " + codigo);
            }

            logger.info("Alumno encontrado: {}", alumno.getNombre());
            return alumno.toDTO();
        } catch (NoSuchElementException e) {
            logger.error("Error: {}", e.getMessage());
            throw e; // Re-lanzar para manejarlo en el controlador
        } catch (Exception e) {
            logger.error("Error inesperado al buscar el alumno con código: {}", codigo, e);
            throw new RuntimeException("Ocurrió un error inesperado al buscar el alumno.");
        }
    }
    // Buscar por nombre de alumno
    public List<Alumno> buscarAlumnosPorNombre(String searchTerm) {
        return repository.buscarAlumnosPorNombre(searchTerm);
    }
    // Buscar por nombre de alumno en riesgo
    public List<Alumno> buscarAlumnosEnRiesgoPorNombre(String searchTerm) {
        return repository.buscarAlumnosEnRiesgoPorNombre(searchTerm);
    }

    // Modificar Alumno en Riesgo
    public Alumno actualizarAlumno(Alumno alumno) {
        return repository.save(alumno);
    }


    // Eliminar Alumno en Riesgo 
    public boolean eliminarAlumnoEnRiesgoXHorario(Long idARH) {
        // Buscar el alumno por su id
        Optional<AlumnoEnRiesgo_X_Horario> aluxhor_encontrado = alumnoEnRiesgoXHorarioRepository.findById(idARH);

        // Si existe, cambiar el atributo enRiesgo a false
        if (aluxhor_encontrado.isPresent()) {
            System.out.println("\n Con ID = "+ idARH +" Se encontro en alumnoEnRiesgoXHorarioRepository\n");
            AlumnoEnRiesgo_X_Horario aluhor = aluxhor_encontrado.get();
            Long idAlumno = aluhor.getAlumno().getId();
            aluhor.setActivo(false);
            //Alumno alumno = optionalAlumno.get();

            Optional<AlumnoEnRiesgo_X_Horario> alumnosEncontrados = alumnoEnRiesgoXHorarioRepository.findByIdAlumno(idAlumno);

            if (alumnosEncontrados.isEmpty()){  // si esta vacio, entonces este alumno ya no es de riesgo 
                Optional<Alumno> alumnoencontrado = repository.findById(idAlumno);
                if(alumnoencontrado.isPresent()){
                    Alumno alumno = alumnoencontrado.get();
                    alumno.setEnRiesgo(false);
                    repository.save(alumno);
                }
            }

            alumnoEnRiesgoXHorarioRepository.save(aluhor);
            return true;
        } else {
            //throw new IllegalArgumentException("El alumno con ID " + codigo + " no se encontró.");
            System.out.println("No se encontro ese alumno con horario");
            return false;
        }
    }

    // Eliminar Alumno en Riesgo deprecado
    public boolean eliminarAlumnoEnRiesgo(Long codigo) {
        // Buscar el alumno por su id
        Optional<Alumno> optionalAlumno = repository.findByCodigo(codigo);

        // Si existe, cambiar el atributo enRiesgo a false
        if (optionalAlumno.isPresent()) {
            Alumno alumno = optionalAlumno.get();
            alumno.setEnRiesgo(false); // Cambia el atributo enRiesgo a false
            repository.save(alumno); // Guardar los cambios en la BD
            return true;
        } else {
            //throw new IllegalArgumentException("El alumno con ID " + codigo + " no se encontró.");
            return false;
        }
    }


    // Agregar Alumno en Riesgo
    public boolean agregarAlumnoEnRiesgo(Long codigo, String codigoHorario, String codigoCurso, long vez,String motivo) {
        
        // Buscando alumno y horario
        Alumno alumno = obtenerAlumnoPorCodigo(codigo);
        Horario horario = repositoryHorario.findByCodigoHorarioyCurso(codigoHorario, codigoCurso);
        // Verificando si el alumno y horario existe
        if (alumno != null && horario != null) {
            // Verificando ya existe en la tabla AlumnoEnRiesgo_X_Horario
            AlumnoEnRiesgo_X_Horario aluxhor_encontrado = alumnoEnRiesgoXHorarioRepository.findByIdHorario(alumno.getId(), horario.getIdHorario());
            if(aluxhor_encontrado == null){
                System.out.println("Se ha encontrado un alumno llamado  con ID: " + alumno.getId());
                alumno.setEnRiesgo(true); // Cambia el atributo enRiesgo a false
                
                System.out.println("Se ha encontrado un horario " + horario.getNombreCurso());
    
                AlumnoEnRiesgo_X_Horario alumnoERHorario = new AlumnoEnRiesgo_X_Horario();
                alumnoERHorario.setAlumno(alumno);
                alumnoERHorario.setHorario(horario);
                alumnoERHorario.setVez(vez);
                alumnoERHorario.setMotivo(motivo);
                alumnoERHorario.setActivo(true);
                alumnoERHorario.setCantSolInfo(Long.valueOf(0));
                alumnoERHorario.setCantRespuestaXLeer(Long.valueOf(0));
                alumnoERHorario.setCantSolXResponder(Long.valueOf(0));
                alumnoERHorario.setFechaUltimaSolicitud(null);
                // Guardar el registro en la base de datos
                alumnoEnRiesgoXHorarioRepository.save(alumnoERHorario);
                repository.save(alumno); // cambio EnRiesgo = true
                System.out.println("Guardado");            
                return true;
            }else{
                System.out.println("El alumno y horario ya estan registrados en la tabla AlumnoEnRiesgo_X_Horario"); 
                if(!aluxhor_encontrado.getActivo()){  // Si no está activo, volverá a aparecer  
                    aluxhor_encontrado.setActivo(true);
                    alumnoEnRiesgoXHorarioRepository.save(aluxhor_encontrado);
                    return true;
                }else{
                    return false;
                }                
            }            
        } else {
            //throw new IllegalArgumentException("El alumno con ID " + codigo + " no se encontró.");
            return false;
        }
    }


    // Metodo para procesar el archivo excel con los alumnos en riesgo
    public ExcelProcessingResult procesarExcel(MultipartFile file) {
        ExcelProcessingResult result = new ExcelProcessingResult();
        try {
            if (file == null || file.isEmpty()) {
                result.getErrorMessages().add("El archivo está vacío o no se proporcionó.");
                result.setSuccess(false);
                return result;
            }
    
            InputStream inputStream = file.getInputStream();
            Workbook workbook = new XSSFWorkbook(inputStream);
            Sheet sheet = workbook.getSheetAt(0); // Primera hoja del Excel
    
            // Variables para tracking
            boolean errorsFound = false;
            int rowsCount = 0;
            
            System.out.println("\n Validando archivo... \n");
            boolean continueProcessing = true;
            // Recorrer las filas del Excel, comenzando en la fila 1 (saltando la cabecera)
            for (int i = 1; i <= sheet.getLastRowNum() &&  continueProcessing ; i++) {
                Row row = sheet.getRow(i);  // fila i, donde i > 0
                if (row == null){
                    System.out.println("\n Ultima fila fue ... "+ i);
                    break;
                }
                
    
                // Obtener valores
                Cell cellCodigo = row.getCell(0); 
                if (cellCodigo == null || cellCodigo.getCellType() == CellType.BLANK) {
                    if (i == 1) {
                        // Si esto ocurre en la fila 1, significa que el archivo esta vacio o no hay datos en esta fila
                        result.getErrorMessages().add("La segunda fila (donde inicia los registros) está vacía o el código del alumno no se ha indicado. El archivo parece estar vacío.");
                        errorsFound = true;
                        continueProcessing = false;
                        break;
                    } else {
                        // Para filas posteriores, asumimos que se acabó la data
                        break;
                    }
                }

                // Validar formato de datos
                if (cellCodigo.getCellType() != CellType.NUMERIC) {
                    result.getErrorMessages().add("Fila " + (i + 1) + " - El código del alumno debe ser numérico.");
                    errorsFound = true;
                    continue;
                }

                Cell cellHorario = row.getCell(4); 
                if (cellHorario == null || cellHorario.getCellType() != CellType.STRING) {
                    result.getErrorMessages().add("Fila " + (i + 1) + " - El código de horario debe ser texto (ejm. 0678)  y/o no estar vacío.");
                    errorsFound = true;
                    continue;
                }

                Cell cellCodigoCurso = row.getCell(5); 
                if (cellCodigoCurso == null || cellCodigoCurso.getCellType() != CellType.STRING) {
                    result.getErrorMessages().add("Fila " + (i + 1) + " - El código del curso debe ser texto  y/o no estar vacío.");
                    errorsFound = true;
                    continue;
                }

                Cell cellVez = row.getCell(6);
                if (cellVez == null || cellVez.getCellType() != CellType.NUMERIC) {
                    result.getErrorMessages().add("Fila " + (i + 1) + " - El campo 'vez' debe ser numérico  y/o no estar vacío.");
                    errorsFound = true;
                    continue;
                }

                Cell cellMotivo = row.getCell(7);
                if (cellMotivo == null || cellMotivo.getCellType() != CellType.STRING) {
                    result.getErrorMessages().add("Fila " + (i + 1) + " - El motivo debe ser texto y/o no estar vacío.");
                    errorsFound = true;
                    continue;
                }
                
                
                // Extraer valores
                long codigo = (long) cellCodigo.getNumericCellValue();  // codigo de alumno
                String codigoHorario = cellHorario.getStringCellValue(); // codigo de horario
                String codigoCurso = cellCodigoCurso.getStringCellValue(); // codigo de curso
                long vez = (long) cellVez.getNumericCellValue(); // vez que lleva el curso
                String motivo = cellMotivo.getStringCellValue(); // motivo de riesgo
    
                // Validación de Alumno y Horario
                Alumno alumno = repository.findAlumnoByCodigo(codigo);
                if (alumno == null) {
                    result.getErrorMessages().add("Fila " + (i + 1) + " - El alumno con código " + codigo + " no existe.");
                    errorsFound = true;
                    continue;
                }
    
                Horario horario = repositoryHorario.findByCodigoHorarioyCurso(codigoHorario, codigoCurso);
                if (horario == null) {
                    result.getErrorMessages().add("Fila " + (i + 1) + " - El horario con código " + codigoHorario + " y curso " + codigoCurso + " no existe.");
                    errorsFound = true;
                    continue;
                }
    
                /* Verificar si ya existe en la tabla AlumnoEnRiesgo_X_Horario
                AlumnoEnRiesgo_X_Horario aluxhor_encontrado = alumnoEnRiesgoXHorarioRepository.findByIdHorario(alumno.getId(), horario.getIdHorario());
                if(aluxhor_encontrado != null){
                    // ya existe, almacenar en ignoredDuplicates
                    
                }*/
                // Todos los datos de la fila son válidos; guardar la información
                // Esperar para guardar la información real después de verificar todas las filas
            }
    
            // Si se encontraron errores, no procesar nada
            if (errorsFound) {
                result.setSuccess(false);
                workbook.close();
                return result;
            }
    
            System.out.println("\n Se vaildaron todos los datos ... ");
            // Si no hubo errores, repetir el ciclo para guardar los datos
            System.out.println("\n Se guardaran los datos hasta la fila ... " + sheet.getLastRowNum());
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);  
                if (row == null) continue;
                
                // Mismos pasos para extraer valores válidos ya que no hay errores
                Cell cellCodigo = row.getCell(0); 
                Cell cellHorario = row.getCell(4); 
                Cell cellCodigoCurso = row.getCell(5); 
                Cell cellVez = row.getCell(6);
                Cell cellMotivo = row.getCell(7);
                

                if (cellCodigo == null || cellCodigo.getCellType() == CellType.BLANK) {
                    // Si la primera columna está vacía, se acabó la data
                    System.out.println("\n Se guardo datos solo hasta la fila ... " + i);
                    break;
                }
    
                if (cellCodigo.getCellType() != CellType.NUMERIC) {
                    // Filas que no pasaron validaciones ya fueron reportadas, aquí las ignoramos
                    continue;
                }
                //if (cellCodigo == null || cellHorario == null || cellCodigoCurso == null || cellVez == null || cellMotivo == null) {
                //    continue; // ya manejamos errores antes
                //}
    
                long codigo = (long) cellCodigo.getNumericCellValue();  
                String codigoHorario = cellHorario.getStringCellValue(); 
                String codigoCurso = cellCodigoCurso.getStringCellValue(); 
                long vezValue = (long) cellVez.getNumericCellValue(); 
                String motivoValue = cellMotivo.getStringCellValue(); 
    
                Alumno alumno = repository.findAlumnoByCodigo(codigo);
                Horario horario = repositoryHorario.findByCodigoHorarioyCurso(codigoHorario, codigoCurso);
    
                // Revisar si este combo alumno/horario ya fue marcado como duplicado
                AlumnoEnRiesgo_X_Horario aluxhor_encontrado = alumnoEnRiesgoXHorarioRepository.findByIdHorario(alumno.getId(), horario.getIdHorario());
                if(aluxhor_encontrado == null){
                    // Crear nuevo registro
                    AlumnoEnRiesgo_X_Horario alumnoERHorario = new AlumnoEnRiesgo_X_Horario();
                    alumnoERHorario.setAlumno(alumno);
                    alumnoERHorario.setHorario(horario);
                    alumnoERHorario.setVez(vezValue);
                    alumnoERHorario.setMotivo(motivoValue);
                    alumnoERHorario.setActivo(true);
                    alumnoERHorario.setCantSolInfo(Long.valueOf(0));
                    alumnoERHorario.setFechaUltimaSolicitud(null);
                    // Guardar el registro en la base de datos
                    alumnoEnRiesgoXHorarioRepository.save(alumnoERHorario);
                    System.out.println("\n       Guardando alumno " + alumno.getCodigo() + " " + alumno.getNombre() + " " + alumno.getApellidoPaterno() + " ...");
                    // Actualizar alumno
                    alumno.setEnRiesgo(true); 
                    repository.save(alumno); 
                }else{
                    System.out.println("\n       Es un alumno duplicado : Alumno con código " + codigo + " y horario " + codigoHorario + " ya existe.");
                    result.getIgnoredDuplicates().add("Fila " + (i + 1) + ": Alumno con código " + codigo + " y horario " + codigoHorario + " ya existe.");
                    continue; 
                }
            }
    
            workbook.close();
            System.out.println("\n Devolviendo success ...");
            result.setSuccess(true);
            // result.getIgnoredDuplicates() puede tener info sobre duplicados
            return result;
        } catch (IOException e) {
            e.printStackTrace();
            result.getErrorMessages().add("Error al leer el archivo Excel.");
            result.setSuccess(false);
            System.out.println("\n Devolviendo error ...");
            return result;
        }
    }
    

    /*/ Metodo para obtener los alumnos en riesgo
    public List<AlumnoDTO> obtenerAlumnosEnRiesgo() {
        List<Alumno> alumnosEncontrados = repository.findAlumnosEnRiesgo();
        if(alumnosEncontrados.isEmpty()){
            throw new EntityNotFoundException("No se encontraron alumnos en riesgo");
            //return null;
        }

        return alumnosEncontrados.stream()
            .map(alumno -> new AlumnoDTO(alumno.getId(), alumno.getCodigo(), 
            alumno.getNombre(), alumno.getApellidoPaterno(), alumno.getApellidoMaterno(), alumno.getEmail()))
            .collect(Collectors.toList());
    }*/

    public List<AlumnoDTO> obtenerTodosLosAlumnos() {
        modelMapper=new ModelMapper();
        List<Alumno> alumnos= (List<Alumno>) repository.findAll();

        List<AlumnoDTO> alumnoDTOS = modelMapper.map(alumnos, new TypeToken<List<AlumnoDTO>>(){}.getType());
        return  alumnoDTOS;
    }

    /*public List<Alumno> findAlumnosEnRiesgoByCurso(Long idCurso){
        return repository.findAlumnosEnRiesgoByCurso(idCurso);
    }
    public List<Alumno> findAlumnosEnRiesgoBySemestre(Long idSemestre){
        return repository.findAlumnosEnRiesgoBySemestre(idSemestre);
    } */

    public List<AlumnoDTO> buscarAlumnosPorCriterios(String apellidoPaterno, String apellidoMaterno, String nombre, Integer codigo) {
        System.out.println("Nombre es: " + nombre);  
    
        // Obtener la lista de Alumnos desde el repositorio
        List<Alumno> alumnos = repository.buscarPorCriterios(
            (apellidoPaterno != null && !apellidoPaterno.isEmpty()) ? apellidoPaterno : null,
            (apellidoMaterno != null && !apellidoMaterno.isEmpty()) ? apellidoMaterno : null,
            (nombre != null && !nombre.isEmpty()) ? nombre : null,
            (codigo == null || codigo == 0) ? null : codigo // Maneja el caso del código
        );
    
        // Convertir la lista de Alumnos a una lista de AlumnoDTO
        List<AlumnoDTO> dtoAlumnos = alumnos.stream()
            .map(alumno -> new AlumnoDTO(
                alumno.getId(),
                alumno.getNombre(),
                alumno.getApellidoPaterno(),
                alumno.getApellidoMaterno(),
                alumno.getEmail(),
                alumno.getCodigo(),
                alumno.isActivo()
                
            ))
            .collect(Collectors.toList());
    
        System.out.println("El resultado es: " + dtoAlumnos); 
        return dtoAlumnos;
    }
    
    // Método que use el repositorio de Horario
    @Autowired
    private HorarioRepository horarioRepository;
    
    public List<HorarioDTO> obtenerHorariosPorAlumno(Long alumnoId) {
        List<Horario> horarioEncontrado = horarioRepository.findByAlumnoId(alumnoId);
        if(horarioEncontrado.isEmpty()){
            throw new EntityNotFoundException("El alumno con id "+ alumnoId + " no tiene horario registrado");
            
        }
        // Mapeando cada Horario a HorarioDTO y convirtiendo los Docente a DocenteDTO
        return horarioEncontrado.stream()
        .map(horario -> new HorarioDTO(
            horario.getIdHorario(),
            horario.getCodigo(), 
            horario.getCodigoCurso(), 
            horario.getNombreCurso(), 
            horario.getCreditoCurso(), 
            horario.getDocentes().stream()
                .map(docente -> new DocenteDTO(docente.getId(), docente.getNombre(), docente.getApellidoPaterno(), 
                docente.getApellidoMaterno(), docente.getEmail(), docente.getCodigo(), docente.isActivo()))
                .collect(Collectors.toList()),
            horario.getJps().stream()
            .map(jp -> new JefeDePracticaDTO(jp.getIdJefeDePractica(), jp.getNombre(), 
            jp.getCalificacionAnual(),jp.isActivo())).collect(Collectors.toList())
        ))
        .collect(Collectors.toList());  
    }

        ////// Listar alumnos en riesgo AlumnoEnRiesgo_X_HorarioDTO /////////////////
    public List<AlumnoEnRiesgo_X_HorarioDTO> obtenerAlumnosEnRiesgoDTO() {
        List<AlumnoEnRiesgo_X_Horario> alumnosEnRiesgo = alumnoEnRiesgoXHorarioRepository.findAllActive();
    
        List<AlumnoEnRiesgo_X_HorarioDTO> dtos = new ArrayList<>();
        for (AlumnoEnRiesgo_X_Horario alEnRiesgo : alumnosEnRiesgo) {
            AlumnoDTO alumnoDTO = new AlumnoDTO(
                    alEnRiesgo.getAlumno().getId(),
                    alEnRiesgo.getAlumno().getCodigo(),
                    alEnRiesgo.getAlumno().getNombre(),
                    alEnRiesgo.getAlumno().getApellidoPaterno(),
                    alEnRiesgo.getAlumno().getApellidoMaterno(),
                    alEnRiesgo.getAlumno().getEmail()
            );
            System.out.println("\nAlumno: " + alEnRiesgo.getAlumno().getNombre() + " ID: " + alEnRiesgo.getAlumno().getId() + "\n");
    
            System.out.println("\nHorario " + alEnRiesgo.getHorario().getCurso().getNombre() + " ID: " + alEnRiesgo.getHorario().getIdHorario() + "\n");        
            HorarioDTO horarioDTO = new HorarioDTO(
                    alEnRiesgo.getHorario().getIdHorario(),
                    alEnRiesgo.getHorario().getCodigo(),
                    alEnRiesgo.getHorario().getCodigoCurso(),
                    alEnRiesgo.getHorario().getCurso().getNombre(),
                    alEnRiesgo.getHorario().getCurso().getCreditos(),                    
                    alEnRiesgo.getHorario().getDocentes().stream()
                    .map(docente -> new DocenteDTO(docente.getId(), docente.getNombre(), docente.getApellidoPaterno(), 
                    docente.getApellidoMaterno(), docente.getEmail(), docente.getCodigo(), docente.isActivo()))
                    .collect(Collectors.toList())
                       /////////////////////////////// null
            );
            System.out.println(alEnRiesgo.getHorario().getDocentes());

            //System.out.println("\nHorario " + alEnRiesgo.getHorario().getCurso().getNombre() + " ID: " + alEnRiesgo.getHorario().getIdHorario() + "\n");

            System.out.println("\nHorario DE LA BASE DE DATOS XD " + horarioDTO.getNombreCurso() + " ID: " + horarioDTO.getIdHorario() + "\n");

            AlumnoEnRiesgo_X_HorarioDTO dto = new AlumnoEnRiesgo_X_HorarioDTO(
                    alEnRiesgo.getId(),
                    alEnRiesgo.getVez(),
                    alEnRiesgo.getMotivo(),
                    alumnoDTO,
                    horarioDTO,
                    alEnRiesgo.getCantSolXResponder(),
                    alEnRiesgo.getCantRespuestaXLeer()
            );
            dtos.add(dto);
        }
    
        return dtos;
    }


    public List<AlumnoEnRiesgo_X_HorarioDTO> obtenerAlumnosEnRiesgoDTOxDocente(Long idDocente) {
        List<AlumnoEnRiesgo_X_Horario> alumnosEnRiesgo = alumnoEnRiesgoXHorarioRepository.findAllActiveXDocente(idDocente);
    
        List<AlumnoEnRiesgo_X_HorarioDTO> dtos = new ArrayList<>();
        for (AlumnoEnRiesgo_X_Horario alEnRiesgo : alumnosEnRiesgo) {
            AlumnoDTO alumnoDTO = new AlumnoDTO(
                    alEnRiesgo.getAlumno().getId(),
                    alEnRiesgo.getAlumno().getCodigo(),
                    alEnRiesgo.getAlumno().getNombre(),
                    alEnRiesgo.getAlumno().getApellidoPaterno(),
                    alEnRiesgo.getAlumno().getApellidoMaterno(),
                    alEnRiesgo.getAlumno().getEmail()
            );
            System.out.println("\nAlumno: " + alEnRiesgo.getAlumno().getNombre() + " ID: " + alEnRiesgo.getAlumno().getId() + "\n");
    
            System.out.println("\nHorario " + alEnRiesgo.getHorario().getCurso().getNombre() + " ID: " + alEnRiesgo.getHorario().getIdHorario() + "\n");        
            HorarioDTO horarioDTO = new HorarioDTO(
                    alEnRiesgo.getHorario().getIdHorario(),
                    alEnRiesgo.getHorario().getCodigo(),
                    alEnRiesgo.getHorario().getCodigoCurso(),
                    alEnRiesgo.getHorario().getCurso().getNombre(),
                    alEnRiesgo.getHorario().getCurso().getCreditos(),                    
                    alEnRiesgo.getHorario().getDocentes().stream()
                    .map(docente -> new DocenteDTO(docente.getId(), docente.getNombre(), docente.getApellidoPaterno(), 
                    docente.getApellidoMaterno(), docente.getEmail(), docente.getCodigo(), docente.isActivo()))
                    .collect(Collectors.toList())
                       /////////////////////////////// null
            );
            System.out.println(alEnRiesgo.getHorario().getDocentes());

            System.out.println("\nHorario " + alEnRiesgo.getHorario().getCurso().getNombre() + " ID: " + alEnRiesgo.getHorario().getIdHorario() + "\n");

            AlumnoEnRiesgo_X_HorarioDTO dto = new AlumnoEnRiesgo_X_HorarioDTO(
                    alEnRiesgo.getId(),
                    alEnRiesgo.getVez(),
                    alEnRiesgo.getMotivo(),
                    alumnoDTO,
                    horarioDTO,
                    alEnRiesgo.getCantSolXResponder(),
                    alEnRiesgo.getCantRespuestaXLeer()
            );
            dtos.add(dto);
        }
    
        return dtos;
    }

    /* Metodo para actualizar informacion de un alumno en riesgo */
    public Boolean actualizarAlumnoRiesgo(Long id, Long vez, String motivo){
        Optional<AlumnoEnRiesgo_X_Horario> aluxhor_encontrado = alumnoEnRiesgoXHorarioRepository.findById(id);
        if (!aluxhor_encontrado.isEmpty()){
            System.out.println("Se ha encontrado un alumno con ID: " + aluxhor_encontrado.get().getAlumno().getId());

            AlumnoEnRiesgo_X_Horario alumnoERHorario = aluxhor_encontrado.get();
            alumnoERHorario.setVez(vez);
            alumnoERHorario.setMotivo(motivo);
            // Guardar el registro en la base de datos
            alumnoEnRiesgoXHorarioRepository.save(alumnoERHorario); 
            System.out.println("Guardado");            
            return true;
        }
        return false;
    }

    /*  Metodo para obtener un alumno en riesgo */
    public AlumnoEnRiesgo_X_HorarioDTO obtenerUnAlumnoEnRiesgo_X_HorarioDTO(Long idAlumnoXHorario) {
        AlumnoEnRiesgo_X_Horario alEnRiesgo = alumnoEnRiesgoXHorarioRepository.obtenerUnAlumnoEnRiesgo(idAlumnoXHorario);

        AlumnoDTO alumnoDTO = new AlumnoDTO(
                alEnRiesgo.getAlumno().getId(),
                alEnRiesgo.getAlumno().getCodigo(),
                alEnRiesgo.getAlumno().getNombre(),
                alEnRiesgo.getAlumno().getApellidoPaterno(),
                alEnRiesgo.getAlumno().getApellidoMaterno(),
                alEnRiesgo.getAlumno().getEmail()
        );
        System.out.println("\nAlumno: " + alEnRiesgo.getAlumno().getNombre() + " ID: " + alEnRiesgo.getAlumno().getId() + "\n");

        System.out.println("\nHorario " + alEnRiesgo.getHorario().getCurso().getNombre() + " ID: " + alEnRiesgo.getHorario().getIdHorario() + "\n");        
        HorarioDTO horarioDTO = new HorarioDTO(
                alEnRiesgo.getHorario().getIdHorario(),
                alEnRiesgo.getHorario().getCodigo(),
                alEnRiesgo.getHorario().getCodigoCurso(),
                alEnRiesgo.getHorario().getCurso().getNombre(),
                alEnRiesgo.getHorario().getCurso().getCreditos(),                    
                alEnRiesgo.getHorario().getDocentes().stream()
                .map(docente -> new DocenteDTO(docente.getId(), docente.getNombre(), docente.getApellidoPaterno(), 
                docente.getApellidoMaterno(), docente.getEmail(), docente.getCodigo(), docente.isActivo()))
                .collect(Collectors.toList())
                    /////////////////////////////// null
        );

        AlumnoEnRiesgo_X_HorarioDTO dto = new AlumnoEnRiesgo_X_HorarioDTO(
            alEnRiesgo.getId(),
            alEnRiesgo.getVez(),
            alEnRiesgo.getMotivo(),
            alumnoDTO,
            horarioDTO,
            alEnRiesgo.getCantSolXResponder(),
            alEnRiesgo.getCantRespuestaXLeer()
        );
        return dto;
    }

    public List<AlumnoDTO> obtenerTodosLosAlumnosXHorario(Long idHorario) {
        // Buscar alumnos usando el repositorio
        List<Alumno> alumnos = repository.findAllByHorarioId(idHorario);

        // Mapear a DTOs
        return alumnos.stream()
                .map(alumno -> new AlumnoDTO(
                        alumno.getId(),
                        alumno.getCodigo(),
                        alumno.getNombre(),
                        alumno.getApellidoPaterno(),
                        alumno.getApellidoMaterno(),
                        alumno.getEmail(),
                        alumno.isActivo()
                ))
                .collect(Collectors.toList());
    }
    //!EXISTE POR CODIGO
    public boolean existePorCodigo(int codigo) {
        logger.info("Verificando si existe un alumno activo con el código: {}", codigo);

        try {
            boolean existe = repository.existsByCodigoAndActivoTrue(codigo);
            if (existe) {
                logger.info("Alumno activo encontrado con el código: {}", codigo);
            } else {
                logger.warn("No se encontró ningún alumno activo con el código: {}", codigo);
            }
            return existe;
        } catch (Exception e) {
            logger.error("Error inesperado al verificar el código: {}", codigo, e);
            throw new RuntimeException("Ocurrió un error al verificar la existencia del código: " + codigo, e);
        }
    }
    

    public List<AlumnoDTO> listarAlumnosActivosPorHorario(Long idHorario) {
        if (idHorario == null || idHorario <= 0) {
            logger.error("ID de horario inválido: {}", idHorario);
            throw new IllegalArgumentException("El ID del horario no puede ser nulo o menor que 1");
        }
    
        try {
            logger.info("Iniciando búsqueda de alumnos activos para el horario ID: {}", idHorario);
            
            List<Alumno> alumnosActivos = repository.findActivoAlumnosByHorarioId(idHorario);
            
            if (alumnosActivos.isEmpty()) {
                logger.info("No se encontraron alumnos activos para el horario ID: {}", idHorario);
                return new ArrayList<>();
            }
            
            List<AlumnoDTO> alumnosDTO = alumnosActivos.stream()
                .map(alumno -> new AlumnoDTO(
                    alumno.getId(),
                    alumno.getNombre(),
                    alumno.getApellidoPaterno(),
                    alumno.getApellidoMaterno(),
                    alumno.getEmail(),
                    alumno.getCodigo(),
                    alumno.isActivo(),
                    alumno.getEnRiesgo() != null ? alumno.getEnRiesgo() : false
                ))
                .collect(Collectors.toList());
            
            logger.info("Se encontraron {} alumnos activos para el horario ID: {}", alumnosDTO.size(), idHorario);
            return alumnosDTO;
            
        } catch (Exception e) {
            logger.error("Error al listar alumnos activos del horario {}: {}", idHorario, e.getMessage());
            throw new RuntimeException("Error al obtener alumnos activos del horario", e);
        }
    }
    
}
