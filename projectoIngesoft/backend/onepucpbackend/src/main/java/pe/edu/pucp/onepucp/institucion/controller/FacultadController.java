package pe.edu.pucp.onepucp.institucion.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.institucion.dto.EspecialidadDTO;
import pe.edu.pucp.onepucp.institucion.dto.FacultadDTO;
import pe.edu.pucp.onepucp.institucion.dto.RespuestaFacultades;
import pe.edu.pucp.onepucp.institucion.model.Especialidad;
import pe.edu.pucp.onepucp.institucion.service.EspecialidadService;
import pe.edu.pucp.onepucp.institucion.service.FacultadService;
import pe.edu.pucp.onepucp.rrhh.service.PersonaService;

@RestController
@RequestMapping("/institucion/facultad")
public class FacultadController {

    private static final Logger logger = LoggerFactory.getLogger(FacultadController.class);
    @Autowired
    FacultadService service;
    @Autowired
    PersonaService personaService;
    @Autowired
    EspecialidadService especialidadService;

    //!LISTAR
    @GetMapping("/listar")
    public ResponseEntity<List<FacultadDTO>> obtenerTodasLasFacultades() {
        logger.info("Solicitando lista de todas las facultades activas.");
        List<FacultadDTO> facultades = service.obtenerTodasLasFacultades();
        logger.info("Número de facultades encontradas: {}", facultades.size());
        return ResponseEntity.ok(facultades);
    }

    //?LISTAR INDEXADO
    @GetMapping("/listar_indexado")
    public ResponseEntity<Page<FacultadDTO>> obtenerFacultadesIndexado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        logger.info("Listando facultades activas en la página: {}, tamaño: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<FacultadDTO> facultadesPage = service.obtenerFacultadesDTOPaginadas(pageable);

        logger.info("Se encontraron {} facultades activas en la página {}", facultadesPage.getTotalElements(), page);
        return ResponseEntity.ok(facultadesPage);
    }

    @PostMapping("/insertar")
    public ResponseEntity<FacultadDTO> insertarFacultad(@RequestBody FacultadDTO facultadDTO) {
        logger.info("Iniciando inserción de facultad con código: {}", facultadDTO.getCodigo());
        FacultadDTO nuevoFacultad = service.insertarFacultad(facultadDTO);
        logger.info("Facultad insertada con éxito. Código: {}", nuevoFacultad.getCodigo());
        return ResponseEntity.ok(nuevoFacultad);
    }

    //!EXISTE
    @GetMapping("/existePorCodigo/{codigo}")
    public boolean existeFacultadPorCodigo(@PathVariable String codigo) {
        logger.info("Buscando facultad con código: {}", codigo);
        return service.existeCodigo(codigo);
    }

    //? Existe por secretaria especialidad
    @GetMapping("/existePorSecretarioAcademico/{id}")
    public boolean existeFacultadPorSecretariaEspecialidad(@PathVariable Long id) {
        logger.info("Buscando facultad con secretario académico ID: {}", id);
        return service.existePorSecretarioAcademico(id);
    }

    //!ELIMINAR
    @DeleteMapping("/eliminar/{id}")
    public String eliminarFacultad(@PathVariable Long id) {
        logger.info("Iniciando eliminación de facultad con ID: {}", id);
        boolean eliminado = service.eliminarFacultad(id);
        if (eliminado) {
            logger.info("Facultad eliminada con éxito. ID: {}", id);
            return "Facultad eliminada con éxito";
        } else {
            logger.error("No se pudo eliminar la facultad con ID: {}", id);
            return "No se pudo eliminar la facultad";
        }
    }

    //!ACTUALIZAR
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<FacultadDTO> actualizarFacultad(@PathVariable Long id, @RequestBody FacultadDTO facultadDTOActualizado) {
        logger.info("Iniciando actualización de facultad con ID: {}, Nombre: {}, Código: {}", id, facultadDTOActualizado.getNombre(), facultadDTOActualizado.getCodigo());
        FacultadDTO facultad = service.actualizarFacultad(id, facultadDTOActualizado);
        if (facultad != null) {
            logger.info("Facultad actualizada con éxito. ID: {}", facultad.getId());
            return ResponseEntity.ok(facultad);
        } else {
            logger.error("Facultad no encontrada con ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/insertarCSV")
    public RespuestaFacultades insertarFacultadesCsv(@RequestBody List<FacultadDTO> facultades) {
        logger.info("Iniciando inserción de múltiples facultades. Total: {}", facultades.size());
        List<FacultadDTO> facultadesGuardadas = new ArrayList<>();
        List<String> errores = new ArrayList<>();

        for (FacultadDTO facultadDTO : facultades) {
            boolean allDatosValid = true;
            String error ="";

            error = "Para la facultad con código: " + facultadDTO.getCodigo() + " ";

            logger.info("Procesando facultad con código: {}", facultadDTO.getCodigo());

            if (service.existeCodigo(facultadDTO.getCodigo())) {
                logger.warn("Facultad ya existe con código: {}", facultadDTO.getCodigo());
                errores.add(error + "Facultad ya existe con código.");
                allDatosValid = false;
            }

            Long idSecretarioAcademico = personaService.obtenerIdPersonaPorCodigo(facultadDTO.getSecretarioAcademico().getCodigo());
            if (idSecretarioAcademico == null) {
                logger.error("Secretario académico no encontrado para código: {}", facultadDTO.getSecretarioAcademico().getCodigo());
                errores.add(error + "Secretario académico no encontrado.");
                allDatosValid = false;
            } else if (service.existePorSecretarioAcademico(idSecretarioAcademico)) {
                logger.warn("Secretario académico ya asignado a otra facultad. Código: {}", facultadDTO.getSecretarioAcademico().getCodigo());
                errores.add(error + "Secretario académico ya asignado a otra facultad.");
                allDatosValid = false;
            }
            else {
                facultadDTO.getSecretarioAcademico().setId(idSecretarioAcademico);
            }
            error = "";
            if (allDatosValid) {
                FacultadDTO facultadGuardada = service.insertarFacultad(facultadDTO);
                facultadesGuardadas.add(facultadGuardada);
                logger.info("Facultad insertada con éxito. Código: {}", facultadDTO.getCodigo());
            } else {
                logger.error("Datos inválidos para la facultad con código: {}", facultadDTO.getCodigo());
            }
        }

        return new RespuestaFacultades(facultadesGuardadas, errores);
    }


    @GetMapping("/listarEspecialidadesDeFacultad/{id}")
    public List<EspecialidadDTO> obtenerEspecialidades(@PathVariable Long id) {
        return especialidadService.obtenerEspecialidadesPorFacultad(id);
    }

}
