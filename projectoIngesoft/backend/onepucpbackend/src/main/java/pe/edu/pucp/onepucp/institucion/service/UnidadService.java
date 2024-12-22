package pe.edu.pucp.onepucp.institucion.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import pe.edu.pucp.onepucp.institucion.dto.CursoDTO;
import pe.edu.pucp.onepucp.institucion.dto.UnidadDTO;
import pe.edu.pucp.onepucp.institucion.model.TipoUnidad;
import pe.edu.pucp.onepucp.institucion.repository.DepartamentoRepository;
import pe.edu.pucp.onepucp.institucion.repository.EspecialidadRepository;
import pe.edu.pucp.onepucp.institucion.repository.FacultadRepository;
import pe.edu.pucp.onepucp.institucion.repository.SeccionRepository;

@Service
public class UnidadService {
    
    private FacultadRepository facultadRepository;
    private DepartamentoRepository departamentoRepository;
    private SeccionRepository seccionRepository;
    private EspecialidadRepository especialidadRepository;
    private ModelMapper modelMapper = new ModelMapper();

    public UnidadService(FacultadRepository facultadRepository, DepartamentoRepository departamentoRepository, SeccionRepository seccionRepository, EspecialidadRepository especialidadRepository ) {
        this.facultadRepository = facultadRepository;
        this.departamentoRepository = departamentoRepository;
        this.seccionRepository = seccionRepository;
        this.especialidadRepository = especialidadRepository;
    }

    public List<UnidadDTO> listarUnidadesPorTipo(TipoUnidad tipoUnidad) {
        List<?> unidades;
        switch (tipoUnidad) {
            case FACULTAD:
                unidades = facultadRepository.findByActivoTrueOrderByNombreAsc();
                break;
            case DEPARTAMENTO:
                unidades = departamentoRepository.findByActivoTrueOrderByNombreAsc();
                break;
            case SECCION:
                unidades = seccionRepository.findByActivoTrueOrderByNombreAsc();
                break;
            case ESPECIALIDAD:
                unidades = especialidadRepository.findByActivoTrueOrderByNombreAsc();
                break;
            default:
                throw new IllegalArgumentException("Tipo de unidad no soportado: " + tipoUnidad);
        }
        // Convertir a UnidadDTO
        return modelMapper.map(unidades, new TypeToken<List<UnidadDTO>>(){}.getType());
    }


}
