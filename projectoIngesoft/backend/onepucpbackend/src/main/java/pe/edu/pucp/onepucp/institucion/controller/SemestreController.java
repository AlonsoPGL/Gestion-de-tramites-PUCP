package pe.edu.pucp.onepucp.institucion.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

import pe.edu.pucp.onepucp.institucion.dto.SemestreDTO;
import pe.edu.pucp.onepucp.institucion.service.SemestreService;
 
 
@RestController
@RequestMapping("/institucion/semestre")
public class SemestreController {
    // Declaramos el logger
    private static final Logger logger = LoggerFactory.getLogger(SemestreController.class);

    @Autowired
    SemestreService semestreservice;

    //!INSERTAR
    @PostMapping("/insertar")
    public SemestreDTO insertarSemestre(@RequestBody SemestreDTO semestre) {
        logger.info("Iniciando inserción de semestre: {}", semestre.getNombre());

        
        SemestreDTO semestreDTO = semestreservice.insertarSemestre(semestre);
        logger.info("Semestre insertado con éxito: {}", semestreDTO.getIdSemestre());
        return semestreDTO;   
    }


    //!LISTAR
    @GetMapping("/listar")
    public ArrayList<SemestreDTO> listarSemestre() {
        logger.info("Listando todas los semestres...");
        ArrayList<SemestreDTO> semestres = semestreservice.listarSemestres();
        logger.info("Se encontraron {} semestres", semestres.size());
        return semestres;
    }
    //? Listar indexado
    // @GetMapping("/listar_indexado")
    // public ResponseEntity<Page<Semestre>> obtenerSemestresIndexado(
    //         @RequestParam(defaultValue = "0") int page,
    //         @RequestParam(defaultValue = "10") int size) {
    //     logger.info("Listando todos los semestres activos en la página: {}, tamaño: {}", page, size);
        
    //     // Crear un Pageable que ordene por ID de mayor a menor
    //     Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        
    //     // Obtener la página de semestres
    //     Page<Semestre> semestresPage = semestreservice.obtenerSemestresPaginados(pageable);
    //     logger.info("Se encontraron {} semestres activos", semestresPage.getTotalElements());
        
    //     return ResponseEntity.ok(semestresPage);
    // }
    //? Listar indexado DTO
    @GetMapping("/listar_indexado")
    public ResponseEntity<Page<SemestreDTO>> obtenerSemestresIndexado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        logger.info("Listando todos los semestres activos en la página: {}, tamaño: {}", page, size);
        
        // Crear un Pageable que ordene por ID de mayor a menor
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        
        // Obtener la página de semestres y convertirla a DTO
        Page<SemestreDTO> semestresPageDTO = semestreservice.obtenerSemestresDTOPaginados(pageable);
        logger.info("Se encontraron {} semestres activos", semestresPageDTO.getTotalElements());
        
        return ResponseEntity.ok(semestresPageDTO);
    }
    //!BUSCAR POR NOMBRE
    @GetMapping("/buscar/{nombre}")
    public ArrayList<SemestreDTO> buscarSemestrePorNombre(@PathVariable String nombre) {
        if(nombre.equals("null")){
            return listarSemestre();
        }
        logger.info("Buscando semestre por nombre: {}", nombre);
        ArrayList<SemestreDTO> semestres = semestreservice.buscarSemestrePorNombre(nombre);
        logger.info("Se encontraron {} semestres", semestres.size());
        return semestres;
    }
    //
    //!OBTENER POR ID
    @GetMapping("/obtener/{id}")
    public SemestreDTO obtenerSemestrePorId(@PathVariable Long id) {
        logger.info("Buscando semestre por id: {}", id);
        SemestreDTO semestre = semestreservice.obtenerSemestrePorId(id);
        if (semestre != null) {
            logger.info("Semestre encontrado con éxito");
            return semestre;
        } else {
            logger.info("Semestre no encontrado");
            return null;
        }
    }
    @GetMapping("/existe/{nombre}")
    public boolean existeSemestrePorNombre(@PathVariable  String nombre) {
        logger.info("Buscando semestre por nombre: {}", nombre);
        return semestreservice.existeSemestrePorNombre(nombre);
    }

    
    //!ELIMINAR
    @DeleteMapping("/eliminar/{id}")
    public String eliminarSemestre(@PathVariable Long id) {
        logger.info("Iniciando eliminación de semestre con id: {}", id);
        boolean eliminado = semestreservice.eliminarSemestre(id);
        if(eliminado){
            logger.info("Semestre eliminado con éxito");
            return "Semestre eliminado con éxito";
        } else {
            logger.info("No se pudo eliminar el semestre");
            return "No se pudo eliminar el semestre";
        }
         
    }
    //!ACTUALIZAR
    @PutMapping("/actualizar/{id}")
    public SemestreDTO actualizarSemestre(@PathVariable Long id, @RequestBody SemestreDTO semestreActualizado) {
        logger.info("Iniciando actualización de semestre con id: {}", id);
        SemestreDTO semestre = semestreservice.actualizarSemestre(id, semestreActualizado);

        if (semestre != null) {
            logger.info("Semestre actualizado con éxito");
            return semestre;
        } else {
            logger.info("No se pudo actualizar el semestre");
            return null;
        }
         
            
    }
    //!INSERTAR CSV
    @PostMapping("/insertarCSV")
    public List<SemestreDTO> insertarSemestresCsv(@RequestBody List<SemestreDTO> semestres) {
        logger.info("Iniciando inserción de múltiples semestres: {}", semestres.size());
        
        List<SemestreDTO> semestresInsertadas = new ArrayList<>();
        
        for (SemestreDTO semestre : semestres) {
            logger.info("Insertando semestre: {} {}", semestre.getNombre());
            
            SemestreDTO nuevaSemestre = semestreservice.insertarSemestre(semestre);

            // Llenar la tabla permiso_x_semestre con todos los permisos en false
            //semestreservice.asignarPermisosPorDefecto(nuevaSemestre);
            
            semestresInsertadas.add(nuevaSemestre);
            logger.info("Semestre insertada con éxito: {}", nuevaSemestre.getIdSemestre());
        }
        
        return semestresInsertadas;
    }

}
