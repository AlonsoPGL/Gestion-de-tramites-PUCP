package pe.edu.pucp.onepucp.institucion.controller;
 

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pe.edu.pucp.onepucp.institucion.model.TipoHorario;

 
@RestController
@RequestMapping("/tipoHorario")
public class TipoHorarioController {
    @GetMapping("/listar")
    public List<String> listarTiposUnidad() {
        // Devuelve los valores del enum como una lista de strings
        return Arrays.stream(TipoHorario.values())
                     .map(Enum::name)
                     .toList();
    }
}
