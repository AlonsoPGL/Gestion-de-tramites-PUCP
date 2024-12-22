package pe.edu.pucp.onepucp.rrhh.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.edu.pucp.onepucp.institucion.model.Unidad;
import pe.edu.pucp.onepucp.institucion.repository.UnidadRepository;
import pe.edu.pucp.onepucp.rrhh.model.Persona;
import pe.edu.pucp.onepucp.rrhh.model.PersonaRolUnidad;
import pe.edu.pucp.onepucp.rrhh.model.Rol;
import pe.edu.pucp.onepucp.rrhh.repository.PersonaRepository;
import pe.edu.pucp.onepucp.rrhh.repository.PersonaRolUnidadRepository;
import pe.edu.pucp.onepucp.rrhh.repository.RolRepository;

@Service
public class PersonaRolUnidadService {

    @Autowired
    private PersonaRolUnidadRepository personaRolUnidadRepository;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private UnidadRepository unidadRepository;


    public PersonaRolUnidad insertarPersonaRolUnidad(Long personaId, Long rolId, Long unidadId, boolean estado) {
        System.out.printf("Buscando Persona con ID: " + personaId + "\n");
        Persona persona = personaRepository.findByIdOrThrow(personaId);
        System.out.printf("Buscando Rol con ID: " + rolId +  "\n");
        Rol rol = rolRepository.findByIdOrThrow(rolId);
        System.out.printf("Buscando Unidad con ID: " + unidadId);
        System.out.printf("\n\n\n\n\n\n");
        Unidad unidad = unidadRepository.findByIdSimple(unidadId);
    
        PersonaRolUnidad personaRolUnidad = new PersonaRolUnidad();
        personaRolUnidad.setPersona(persona);
        personaRolUnidad.setRol(rol);
        personaRolUnidad.setUnidad(unidad);
        personaRolUnidad.setEstado(estado);
    
        System.out.printf("Guardando PersonaRolUnidad...");
        return personaRolUnidadRepository.save(personaRolUnidad);
    }

    public boolean eliminarPersonaRolUnidad(Long id) {
        Optional<PersonaRolUnidad> rolOptional= personaRolUnidadRepository.findById(id);
        if (rolOptional.isPresent()) {
            PersonaRolUnidad personaRolUnidad = rolOptional.get();
            personaRolUnidad.setEstado(false); // Cambiar el estado a "false" para indicar que está eliminada
            personaRolUnidadRepository.save(personaRolUnidad);
            return true;
        } else {
            return false;
        }
    }

    public PersonaRolUnidad insertar(PersonaRolUnidad personaRolUnidad) {
        return personaRolUnidadRepository.save(personaRolUnidad);
    }

     // Método para obtener la relación entre persona y unidad
     public PersonaRolUnidad obtenerPorPersonaYUnidad(Persona persona, Unidad unidad) {
        Optional<PersonaRolUnidad> personaRolUnidadOpt = personaRolUnidadRepository.findByPersonaAndUnidadAndEstado(persona, unidad, true);
        return personaRolUnidadOpt.orElse(null);  // Retorna null si no se encuentra la relación
    }
}
