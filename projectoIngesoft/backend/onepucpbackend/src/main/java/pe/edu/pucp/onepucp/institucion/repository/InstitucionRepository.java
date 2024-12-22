package pe.edu.pucp.onepucp.institucion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
 
 
import pe.edu.pucp.onepucp.institucion.model.Institucion;
import pe.edu.pucp.onepucp.institucion.model.Semestre;
public interface InstitucionRepository extends JpaRepository<Institucion,Long> {
    //Obtener el semestre por id de institucion
    Semestre findSemestreByIdInstitucion(Long idInstitucion);
    
}
