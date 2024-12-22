package pe.edu.pucp.onepucp.rrhh.controller;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExcelProcessingResult {
    private boolean success;
    private List<String> errorMessages;  // Mensajes de error específicos
    private List<String> ignoredDuplicates; // Lista de alumnos ignorados por ser duplicados
    
    public ExcelProcessingResult() {
        this.errorMessages = new ArrayList<>();
        this.ignoredDuplicates = new ArrayList<>();
    }
    
}
