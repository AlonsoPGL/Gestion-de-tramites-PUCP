package pe.edu.pucp.onepucp.institucion.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import pe.edu.pucp.onepucp.institucion.model.Departamento;

public interface DepartamentoRepository extends JpaRepository<Departamento,Long>{
    default Page<Departamento> findAllActiveOrderedByIdDesc(Pageable pageable) {
        Pageable sortedByIdDesc = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by("id").descending()
        );
        return findByActivoTrue(sortedByIdDesc);
    }

    Page<Departamento> findByActivoTrue(Pageable pageable);
    List<Departamento> findAllByActivoTrue();

    List<Departamento> findByActivoTrueOrderByNombreAsc();
    boolean existsByCodigoAndActivoTrue(String codigo);
    boolean existsByCodigo(String codigo);
    boolean existsByNombre(String nombre);
    //Listar todos los jefes de departamento que hay en la base de datos
    // List<Persona> findAllJefes();
    //Ecxiste un jefe de departamento con el id especificado
    //SQL  
    @Query("SELECT COUNT(d) FROM Departamento d WHERE d.jefe.id = :id")
    int countByJefeId(Long id);

    

}
