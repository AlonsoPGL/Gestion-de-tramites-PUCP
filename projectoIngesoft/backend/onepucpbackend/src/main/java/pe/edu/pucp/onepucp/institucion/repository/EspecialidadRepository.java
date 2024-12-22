package pe.edu.pucp.onepucp.institucion.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import pe.edu.pucp.onepucp.institucion.model.Especialidad;


public interface EspecialidadRepository extends JpaRepository<Especialidad,Long>{
    //Eliminar por id
    void deleteById(Long id); 
    Optional<Especialidad> findById(Long id);
    // Mtodo base para encontrar especialidades activas
    Page<Especialidad> findByActivoTrue(Pageable pageable);
    
    // Mtodo default para ordenar por ID descendente
    default Page<Especialidad> findAllActiveOrderedByIdDesc(Pageable pageable) {
        Pageable sortedByIdDesc = PageRequest.of(
            pageable.getPageNumber(), 
            pageable.getPageSize(), 
            Sort.by("id").descending()
        );
        return findByActivoTrue(sortedByIdDesc);
    }

    List<Especialidad> findAllByActivoTrue();


    boolean existsByCodigo(String codigo);
    List<Especialidad> findByActivoTrueOrderByNombreAsc();

    boolean existsByCodigoAndActivoTrue(String codigo);
    
    // Contar las facultades que tengan un asistente de carrera con el id especificado y esten activas
    //SQL
    @Query(value = "SELECT COUNT(*) FROM facultad f JOIN especialidad e ON f.id = e.facultad_id WHERE e.asistente_de_carrera_id = ?1 AND f.activo = true", nativeQuery = true)
    int countByAsistenteDeCarreraIdAndActivoTrue(Long id);
    
    @Query(value = "SELECT COUNT(*) FROM facultad f JOIN especialidad e ON f.id = e.facultad_id WHERE e.coordinador_id = ?1 AND f.activo = true", nativeQuery = true)
    int countByCoordinadorIdAndActivoTrue(Long id);
    

    //!Buscar especialidad por id de coordinador   
    @Query(value = "SELECT e.*, u.codigo, u.nombre, u.telefono_contacto, u.correo_contacto, u.direccion_web, u.tipo " +
    "FROM especialidad e " +
    "JOIN unidad u ON e.id = u.id " +
    "WHERE e.coordinador_id = ?1", nativeQuery = true)
    List<Especialidad> findByCoordinadorId(Long id);


    List<Especialidad> findByFacultad_Id(Long id);
    
    List<Especialidad> findByFacultadId(Long facultadId);
}
