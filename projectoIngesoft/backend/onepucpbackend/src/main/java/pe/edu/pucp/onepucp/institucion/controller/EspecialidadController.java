package pe.edu.pucp.onepucp.institucion.controller;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.repository.EspecialidadRepository;
import pe.edu.pucp.onepucp.institucion.service.EspecialidadService;
import pe.edu.pucp.onepucp.institucion.service.FacultadService;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.PersonaRolUnidad;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.service.PersonaService;

@RestController
@RequestMapping("/institucion/especialidad")
public class EspecialidadController {

    private static final Logger logger = LoggerFactory.getLogger(EspecialidadController.class);
    @Autowired
    EspecialidadService service;
    @Autowired
    FacultadService facultadService;
    @Autowired
    PersonaService personaService;

    private ModelMapper modelMapper;

    @Autowired
    private EspecialidadRepository especialidadRepository;
    ;
    //!LISTAR
    @GetMapping("/listar")
    public List<EspecialidadDTO> listarEspecialidad() {
        //Solo lista las activas
        List<EspecialidadDTO> especialidades = service.listarEspecialidades();
        List<EspecialidadDTO> especialidadesActivas = especialidades.stream().filter(especialidad -> especialidad.isActivo()).toList();

        return especialidadesActivas;
    }

    //?LISTAR INDEXADO
    @GetMapping("/listar_indexado")
    public ResponseEntity<Page<EspecialidadDTO>> obtenerEspecialidadesIndexado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        logger.info("Listando todas las especialidades activas en la página: {}, tamaño: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<EspecialidadDTO> especialidadesPage = service.obtenerEspecialidadesDTOPaginadas(pageable);

        logger.info("Se encontraron {} especialidades activas", especialidadesPage.getTotalElements());
        return ResponseEntity.ok(especialidadesPage);
    }

    //!EXISTE
    //? Existe por codigo
    @GetMapping("/existe/{codigo}")
    public boolean existeEspecialidadPorCodigo(@PathVariable String codigo) {
        logger.info("Buscando semestre por nombre: {}", codigo);
        return service.existeEspecialidadPorCodigo(codigo);
    }
    //? Existe por coordinador

    @GetMapping("/existePorCoordinador/{id}")
    public boolean existeEspecialidadPorCoordinador(@PathVariable Long id) {
        logger.info("Buscando especialidad por coordinador: {}", id);
        return service.existePorCoordinador(id);
    }

    //? Existe por existePorAsistenteCarrera
    @GetMapping("/existePorAsistenteDeCarrera/{id}")
    public boolean existeEspecialidadPorAsistenteDeCarrera(@PathVariable Long id) {
        logger.info("Buscando especialidad por Por Asistente De Carrera: {}", id);
        return service.existePorAsistenteCarrera(id);
    }

    //!INSERTAR
    @PostMapping("/insertar")
    public EspecialidadDTO insertarEspecialidad(@RequestBody EspecialidadDTO especialidadDTO) {

        EspecialidadDTO nuevoEspecialidad = service.insertarEspecialidad(especialidadDTO);
        return nuevoEspecialidad;
    }

    //!ELIMINAR
    @DeleteMapping("/eliminar/{id}")
    public void eliminarEspecialidad(@PathVariable Long id) {
        service.eliminarEspecialidad(id);
    }

    //!OBTENER POR ID
    @GetMapping("/obtener/{id}")
    public EspecialidadDTO obtenerEspecialidadPorId(@PathVariable Long id) {
        return service.obtenerEspecialidadPorId(id);
    }

    //!ACTUALIZAR
    @PutMapping("/actualizar/{id}")
    public EspecialidadDTO actualizarEspecialidad(@PathVariable Long id, @RequestBody EspecialidadDTO especialidadDTOActualizado) {
        logger.info("Iniciando actualización de especialidad: {}", especialidadDTOActualizado.getNombre(), especialidadDTOActualizado.getCodigo());
        EspecialidadDTO especialidad = service.actualizarEspecialidad(id, especialidadDTOActualizado);
        if (especialidad != null) {
            logger.info("Especialidad actualizado con éxito: {}", especialidad.getId()); // Log de éxito
            return especialidadDTOActualizado;
        } else {
            logger.info("Especialidad no encontrado");
            return null;
        }
    }

    @PostMapping("/insertarCSV")
    public List<EspecialidadDTO> insertarEspecialidadesCsv(@RequestBody List<EspecialidadDTO> especialidades) {
        logger.info("Iniciando la inserción de múltiples especialidades: {}", especialidades.size());

        List<EspecialidadDTO> especialidadesGuardadas = new ArrayList<>();

        for (EspecialidadDTO especialidadDTO : especialidades) {
            logger.info("Insertando especialidad: {}", especialidadDTO.getCodigo());
            if (service.existeCodigo(especialidadDTO.getCodigo())) {
                logger.info("Especialidad ya existe: {}", especialidadDTO.getCodigo());
                continue;
            }
            // //!Ahora buscar los ids del coordinador y de la facultad
            Long idFacultad = facultadService.obtenerIdFacultadPorCodigo(especialidadDTO.getFacultad().getCodigo());
            Long idCoordinador = personaService.obtenerIdPersonaPorCodigo(especialidadDTO.getCoordinador().getCodigo());
            if (idFacultad == null) {
                logger.error("Facultad no encontrada: {}", especialidadDTO.getFacultad().getCodigo());
                especialidadDTO.setFacultad(null);
            } else {
                especialidadDTO.getFacultad().setId(idFacultad);
            }
            if (idCoordinador == null) {
                logger.error("Coordinador no encontrado: {}", especialidadDTO.getCoordinador().getCodigo());
                especialidadDTO.setCoordinador(null);
            } else {
                especialidadDTO.getCoordinador().setId(idCoordinador);
            }
            modelMapper = new ModelMapper();
            EspecialidadDTO especialidadGuardada = service.insertarEspecialidad(especialidadDTO);
            Especialidad especialidad = modelMapper.map(especialidadGuardada, Especialidad.class);
            service.asignarAsistenteDeCarrera(especialidad);
            service.asignarRolAlDirectorDeCarrera(especialidad);
            especialidadesGuardadas.add(especialidadGuardada);


            logger.info("Especialidad insertada con éxito: {}", especialidadDTO.getCodigo());
        }
        return especialidadesGuardadas;
    }
    //!BUSCAR POR COORDINADOR
    //?Buscar por coordinador
    
    @GetMapping("/buscarPorCoordinador")
    public ResponseEntity<EspecialidadDTO> buscarPorCoordinador(@RequestParam Long idCoordinador) {
        logger.info("Inicio de la búsqueda de Especialidad por idCoordinador: {}", idCoordinador);

        if (idCoordinador == null || idCoordinador <= 0) {
            logger.warn("El idCoordinador proporcionado es inválido: {}", idCoordinador);
            return ResponseEntity.badRequest()
                    .body(null); // También puedes devolver un mensaje de error si defines un DTO para errores.
        }

        try {
            EspecialidadDTO especialidad = service.buscarPorCoordinador(idCoordinador);

            if (especialidad == null) {
                logger.info("No se encontró una Especialidad asociada al idCoordinador: {}", idCoordinador);
                return ResponseEntity.notFound().build();
            }

            logger.info("Búsqueda exitosa. Especialidad encontrada para idCoordinador: {}", idCoordinador);
            return ResponseEntity.ok(especialidad);
        } catch (Exception e) {
            logger.error("Error durante la búsqueda de Especialidad para idCoordinador: {}. Error: {}", idCoordinador, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/habilitarEnvioSolicitudCursos/{id}")
    public void habilitarEnvioSolicitudCursos(@PathVariable Long id) {
        // Buscar la especialidad por ID
        Especialidad especialidad = especialidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada con id: " + id));

        // Actualizar el atributo
        especialidad.setHabilitarEnvioSolicitudCursos(true);

        // Guardar los cambios en la base de datos
        especialidadRepository.save(especialidad);
    }

    @GetMapping("/estadoHabilitarEnvioSolicitudCursos/{id}")
    @ResponseBody
    public boolean estadoHabilitarEnvioSolicitudCursos(@PathVariable Long id) {
        // Buscar la especialidad por ID
        Especialidad especialidad = especialidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada con id: " + id));

        // Devolver el estado del atributo habilitarEnvioSolicitudCursos
        return especialidad.isHabilitarEnvioSolicitudCursos();
    }
}
