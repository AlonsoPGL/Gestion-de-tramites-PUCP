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

import pe.edu.pucp.onepucp.institucion.dto.SeccionDTO;
import pe.edu.pucp.onepucp.institucion.model.Seccion;
import pe.edu.pucp.onepucp.institucion.service.SeccionService;
@RestController
@RequestMapping("/institucion/seccion")
public class SeccionController {

    // Declaramos el logger
    private static final Logger logger = LoggerFactory.getLogger(SeccionController.class);

    @Autowired
    SeccionService seccionservice; 

    
    private ModelMapper modelMapper;
    //!INSERTAR
    @PostMapping("/insertar")
    public SeccionDTO insertarSeccion(@RequestBody SeccionDTO seccionDTO) {
        logger.info("Iniciando inserción de seccion: {}", seccionDTO.getNombre());
        SeccionDTO seccion = seccionservice.insertarSeccion(seccionDTO);
        logger.info("Seccion insertado con éxito: {}", seccion.getId());
        return seccion;
    }

    //!LISTAR
    @GetMapping("/listar")
    public ResponseEntity<List<SeccionDTO>> obtenerTodasLasSeccuiones() {
        List<SeccionDTO> secciones = seccionservice.obtenerTodasLasSeccionesDTO();
        return ResponseEntity.ok(secciones);
    }

    @GetMapping("/listar_indexado")
    public ResponseEntity<Page<SeccionDTO>> obtenerSeccionesIndexado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        logger.info("Listando todas las secciones activas en la página: {}, tamaño: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<SeccionDTO> seccionesPage = seccionservice.obtenerSeccionesDTOPaginadas(pageable);

        logger.info("Se encontraron {} secciones activas", seccionesPage.getTotalElements());
        return ResponseEntity.ok(seccionesPage);
    }

    //!BUSCAR POR NOMBRE
    @GetMapping("/buscar/{nombre}")
    public ArrayList<Seccion> buscarSeccionPorNombre(@PathVariable String nombre) {
        logger.info("Buscando seccion por nombre: {}", nombre);
        ArrayList<Seccion> seccions = seccionservice.buscarSeccionPorNombre(nombre);
        logger.info("Se encontraron {} seccions", seccions.size());
        return seccions;
    }

    //!EXISTE
    @GetMapping("/existe/{codigo}")
    public boolean existeSeccionPorCodigo(@PathVariable String codigo) {
        logger.info("Buscando seccion con código: {}", codigo);
        return seccionservice.existeCodigo(codigo);
    }

    //!EXISTE POR JEFE
    @GetMapping("/existePorJefe/{id}")
    public boolean existeSeccionPorJefe(@PathVariable Long id) {
        logger.info("Buscando seccion con jefe: {}", id);
        return seccionservice.existePorJefe(id);
    }

    //!EXISTE POR ASISTENTE
    @GetMapping("/existePorAsistente/{id}")
    public boolean existeSeccionPorAsistente(@PathVariable Long id) {
        logger.info("Buscando seccion con asistente: {}", id);
        return seccionservice.existePorAsistente(id);
    }

    //!ELIMINAR
    @DeleteMapping("/eliminar/{id}")
    public String eliminarSeccion(@PathVariable Long id) {
        logger.info("Iniciando eliminación de seccion con id: {}", id);
        boolean eliminado = seccionservice.eliminarSeccion(id);
        if (eliminado) {
            logger.info("Seccion eliminado con éxito");
            return "Seccion eliminado con éxito";
        } else {
            logger.info("No se pudo eliminar el seccion");
            return "No se pudo eliminar el seccion";
        }

    }
    //!ACTUALIZAR
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<SeccionDTO> actualizarSeccion(@PathVariable Long id, @RequestBody SeccionDTO seccionDTOActualizado) {
        try {
            logger.info("Recibida solicitud de actualización para sección con ID: {}", id);
            SeccionDTO seccionActualizada = seccionservice.actualizarSeccion(id, seccionDTOActualizado);

            if (seccionActualizada != null) {
                logger.info("Sección actualizada exitosamente");
                return ResponseEntity.ok(seccionActualizada);
            } else {
                logger.warn("No se encontró la sección con ID: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error al procesar la actualización de la sección: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    //!INSERTAR CSV
//!INSERTAR CSV

    @PostMapping("/insertarCSV")
    public List<SeccionDTO> insertarSeccionesCsv(@RequestBody List<SeccionDTO> seccionesDTO) {
        logger.info("Iniciando inserción de múltiples secciones: {}", seccionesDTO.size());

        List<SeccionDTO> seccionesInsertadasDTO = new ArrayList<>();
        modelMapper = new ModelMapper();
        for (SeccionDTO seccionDTO : seccionesDTO) {
            logger.info("Insertando sección: {} {}", seccionDTO.getCodigo(), seccionDTO.getNombre()); 

            // Insertar sección en la base de datos y obtener el DTO resultante
            SeccionDTO nuevaSeccionDTO = seccionservice.insertarSeccion(seccionDTO);

            seccionesInsertadasDTO.add(nuevaSeccionDTO);
            logger.info("Sección insertada con éxito: {}", nuevaSeccionDTO.getId());
        }

        return seccionesInsertadasDTO;
    }

}
