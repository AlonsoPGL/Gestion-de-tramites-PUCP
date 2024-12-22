package pe.edu.pucp.onepucp.rrhh.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import pe.edu.pucp.onepucp.rrhh.model.Persona;
@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {
    boolean existsByCodigo(int codigo);
    Optional<Persona> findByCuentaUsuarioAndCuentaContrasenia(String usuario, String contrasenia);

    boolean existsByCuenta_Usuario(String usuario);
    


    Page<Persona> findByActivoTrue(Pageable pageable);
    default Page<Persona> findAllActiveOrderedByIdDesc(Pageable pageable) {
        Pageable sortedByIdDesc = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("id").descending());
        return findByActivoTrue(sortedByIdDesc);
    } 
    @Query("SELECT p.id FROM Persona p WHERE p.codigo = :codigo AND p.activo = true")
    List<Long> findIdByCodigoAndActivoTrue(int codigo);
    
    default Persona findByIdOrThrow(Long id) {
        return findById(id).orElseThrow(() -> new IllegalArgumentException("Persona no encontrada con ID: " + id));
    }
        @Query("UPDATE Persona p SET p.especialidad.id = :especialidadId WHERE p.id = :personaId")

        
    @Modifying
    @Transactional
    void updateEspecialidadId(@Param("personaId") Long personaId, @Param("especialidadId") Long especialidadId);

    boolean existsByEmailAndActivoTrue(String correo);


    // Verificar si el código existe solo para personas activas y cuentas activas
    boolean existsByCodigoAndActivoTrueAndCuentaActivoTrue(int codigo);

    // Verificar si el correo electrónico existe solo para personas activas y cuentas activas
    boolean existsByEmailAndActivoTrueAndCuentaActivoTrue(String correo);

    // Verificar si el usuario de la cuenta existe y está activo
    boolean existsByCuenta_UsuarioAndCuentaActivoTrue(String usuario);
}
