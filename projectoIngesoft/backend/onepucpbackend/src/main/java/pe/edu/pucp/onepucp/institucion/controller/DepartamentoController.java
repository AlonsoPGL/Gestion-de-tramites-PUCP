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

import pe.edu.pucp.onepucp.institucion.dto.DepartamentoDTO;
import pe.edu.pucp.onepucp.institucion.model.Departamento;
import pe.edu.pucp.onepucp.institucion.service.DepartamentoService;

@RestController
@RequestMapping("/institucion/departamento")
public class DepartamentoController {
    private static final Logger logger = LoggerFactory.getLogger(DepartamentoController.class);

    @Autowired
    private DepartamentoService departamentoService;

    //! INSERTAR
    @PostMapping("/insertar")
    public ResponseEntity<?> insertarDepartamento(@RequestBody DepartamentoDTO departamentoDTO) {
        try {
            logger.info("Iniciando inserción de departamento: Código={}, Nombre={}", 
                        departamentoDTO.getCodigo(), departamentoDTO.getNombre());
            DepartamentoDTO nuevoDepartamento = departamentoService.insertarDepartamento(departamentoDTO);
            logger.info("Departamento insertado con éxito: ID={}", nuevoDepartamento.getId());
            return ResponseEntity.ok(nuevoDepartamento);
        } catch (Exception e) {
            logger.error("Error al insertar el departamento: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error al insertar el departamento");
        }
    }

    //! LISTAR
    @GetMapping("/listar")
    public ResponseEntity<?> listarDepartamentos() {
        try {
            logger.info("Listando todos los departamentos...");
            List<DepartamentoDTO> departamentos = departamentoService.obtenerTodosLosDepartamentos();
            logger.info("Se encontraron {} departamentos activos", departamentos.size());
            return ResponseEntity.ok(departamentos);
        } catch (Exception e) {
            logger.error("Error al listar los departamentos: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error al listar los departamentos");
        }
    }

    //! LISTAR INDEXADO
    @GetMapping("/listar_indexado")
    public ResponseEntity<?> obtenerDepartamentosIndexado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            logger.info("Listando departamentos activos paginados: Página={}, Tamaño={}", page, size);
            Pageable pageable = PageRequest.of(page, size);
            Page<DepartamentoDTO> departamentosPage = departamentoService.obtenerDepartamentosDTOPaginados(pageable);
            logger.info("Se encontraron {} departamentos activos en total", departamentosPage.getTotalElements());
            return ResponseEntity.ok(departamentosPage);
        } catch (Exception e) {
            logger.error("Error al listar departamentos indexados: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error al listar departamentos indexados");
        }
    }

    //! BUSCAR POR NOMBRE
    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<?> buscarDepartamentoPorNombre(@PathVariable String nombre) {
        try {
            logger.info("Buscando departamento por nombre: {}", nombre);
            List<DepartamentoDTO> departamentos = departamentoService.buscarDepartamentoPorNombre(nombre);
            if (departamentos.isEmpty()) {
                logger.warn("No se encontraron departamentos con el nombre '{}'", nombre);
                return ResponseEntity.status(404).body("No se encontraron departamentos con el nombre proporcionado");
            }
            logger.info("Se encontraron {} departamentos con el nombre '{}'", departamentos.size(), nombre);
            return ResponseEntity.ok(departamentos);
        } catch (Exception e) {
            logger.error("Error al buscar departamento por nombre: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error al buscar departamento por nombre");
        }
    }

    //! ELIMINAR
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarDepartamento(@PathVariable Long id) {
        try {
            logger.info("Iniciando eliminación de departamento con ID={}", id);
            boolean eliminado = departamentoService.eliminarDepartamento(id);
            if (eliminado) {
                logger.info("Departamento eliminado con éxito: ID={}", id);
                return ResponseEntity.ok("Departamento eliminado con éxito");
            } else {
                logger.warn("No se pudo eliminar el departamento: ID={}", id);
                return ResponseEntity.status(404).body("No se pudo eliminar el departamento, no existe o ya está inactivo");
            }
        } catch (Exception e) {
            logger.error("Error al eliminar el departamento: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error al eliminar el departamento");
        }
    }

    //! ACTUALIZAR
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizarDepartamento(
            @PathVariable Long id, @RequestBody DepartamentoDTO departamentoDTO) {
        try {
            logger.info("Iniciando actualización de departamento: ID={}", id);
            DepartamentoDTO departamentoActualizado = departamentoService.actualizarDepartamento(id, departamentoDTO);
            if (departamentoActualizado != null) {
                logger.info("Departamento actualizado con éxito: ID={}", id);
                return ResponseEntity.ok(departamentoActualizado);
            } else {
                logger.warn("No se encontró el departamento para actualizar: ID={}", id);
                return ResponseEntity.status(404).body("No se encontró el departamento con el ID especificado");
            }
        } catch (Exception e) {
            logger.error("Error al actualizar el departamento: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error al actualizar el departamento");
        }
    }

    //! EXISTE POR CÓDIGO
    @GetMapping("/existePorCodigo/{codigo}")
    public ResponseEntity<?> existeDepartamentoPorCodigo(@PathVariable String codigo) {
        try {
            logger.info("Verificando existencia de departamento por código: {}", codigo);
            boolean existe = departamentoService.existeDepartamentoPorCodigo(codigo);
            logger.info("Resultado de existencia por código '{}': {}", codigo, existe);
            return ResponseEntity.ok(existe);
        } catch (Exception e) {
            logger.error("Error al verificar existencia de departamento por código: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error al verificar existencia de departamento por código");
        }
    }

    //! EXISTE POR NOMBRE
    @GetMapping("/existePorNombre/{nombre}")
    public ResponseEntity<?> existeDepartamentoPorNombre(@PathVariable String nombre) {
        try {
            logger.info("Verificando existencia de departamento por nombre: {}", nombre);
            boolean existe = departamentoService.existeDepartamentoPorNombre(nombre);
            logger.info("Resultado de existencia por nombre '{}': {}", nombre, existe);
            return ResponseEntity.ok(existe);
        } catch (Exception e) {
            logger.error("Error al verificar existencia de departamento por nombre: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error al verificar existencia de departamento por nombre");
        }
    }

    //! EXISTE JEFE POR ID
    @GetMapping("/existePorIdJefe/{id}")
    public ResponseEntity<?> existeJefePorId(@PathVariable Long id) {
        try {
            logger.info("Verificando existencia de jefe de departamento por ID={}", id);
            boolean existe = departamentoService.existeDepartamentoPorIdJeje(id);
            logger.info("Resultado de existencia de jefe por ID={}: {}", id, existe);
            return ResponseEntity.ok(existe);
        } catch (Exception e) {
            logger.error("Error al verificar existencia de jefe por ID: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error al verificar existencia de jefe por ID");
        }
    }
}

