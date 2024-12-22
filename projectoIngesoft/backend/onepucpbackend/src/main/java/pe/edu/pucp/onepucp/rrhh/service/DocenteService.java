package pe.edu.pucp.onepucp.rrhh.service;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.edu.pucp.onepucp.rrhh.dto.DocenteDTO;
import pe.edu.pucp.onepucp.rrhh.model.Docente;
import pe.edu.pucp.onepucp.rrhh.repository.DocenteRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class DocenteService {
    @Autowired
    private DocenteRepository repository;

    private ModelMapper modelMapper;

    public List<DocenteDTO> obtenerTodosLosDocentes() {
        modelMapper=new ModelMapper();
        List<Docente> docentes= (List<Docente>) repository.findDocentes();
        List<DocenteDTO> docentesDTO = modelMapper.map(docentes, new TypeToken<List<DocenteDTO>>(){}.getType());
     //   return  modelMapper.map(cuenta, CuentaDto.class);

        return docentesDTO;
    }
    public List<DocenteDTO> buscarDocentesPorCriterios(String apellidoPaterno, String apellidoMaterno, String nombres, Integer codigo) {
        return repository.buscarPorCriterios(
                (apellidoPaterno != null && !apellidoPaterno.isEmpty()) ? apellidoPaterno : null,
                (apellidoMaterno != null && !apellidoMaterno.isEmpty()) ? apellidoMaterno : null,
                (nombres != null && !nombres.isEmpty()) ? nombres : null,
                (codigo == null || codigo == 0) ? null : codigo // Maneja el caso del código
        );
    }

    public DocenteDTO obtenerDocentePorId(Long idDocente) {
        // Buscar docente usando el repositorio
        Docente docente = repository.findByDocenteId(idDocente);

        // Mapear a DTOs
        return new DocenteDTO(
            docente.getId(),
            docente.getNombre(),
            docente.getApellidoPaterno(),
            docente.getApellidoMaterno(),
            docente.getEmail(),
            docente.getCodigo(),
            docente.isActivo()
            );
    }
}
