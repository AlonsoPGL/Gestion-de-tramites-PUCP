package pe.edu.pucp.onepucp.institucion.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import pe.edu.pucp.onepucp.institucion.model.Facultad;

public interface FacultadRepository extends JpaRepository<Facultad,Long>{

    default Page<Facultad> findAllActiveOrderedByIdDesc(Pageable pageable) {
        Pageable sortedByIdDesc = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by("id").descending()
        );
        return findByActivoTrue(sortedByIdDesc);
    }
    
    
    Page<Facultad> findByActivoTrue(Pageable pageable);

   List<Facultad> findAllByActivoTrue();

   boolean existsByCodigo(String codigo); 
   Long findIdByCodigo(String codigo);
   List<Facultad> findByActivoTrueOrderByNombreAsc();

   boolean existsByCodigoAndActivoTrue(String codigo); 
   List<Long> findIdByCodigoAndActivoTrue(String codigo);


   // Contar las facultades que tengan un seecretario académico con el id especificado y esten activas
    @Query("SELECT COUNT(f) FROM Facultad f WHERE f.secretarioAcademico.id = :id AND f.activo = true")
    int countBySecretarioAcademicoIdAndActivoTrue(Long id); 
    

}