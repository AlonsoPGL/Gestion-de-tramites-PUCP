package pe.edu.pucp.onepucp.institucion.repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pe.edu.pucp.onepucp.institucion.model.Semestre;
@Repository
public interface SemestreRepository extends JpaRepository<Semestre, Long>{

    ArrayList<Semestre> findByNombreContaining(String nombre);
// En el repository (interfaz SemestreRepository)
    boolean existsByNombreAndActivoTrue(String nombre);
    Page<Semestre> findByActivoTrue(Pageable pageable);
    List<Semestre> findAllByActivoTrue();
    
    default Page<Semestre> findAllActiveOrderedByIdDesc(Pageable pageable) {
        Pageable sortedByIdDesc = PageRequest.of(
            pageable.getPageNumber(), 
            pageable.getPageSize(), 
            Sort.by("idSemestre").descending()
        );
        return findByActivoTrue(sortedByIdDesc);
    }

    Optional<Object> findByNombre(String s);
}
