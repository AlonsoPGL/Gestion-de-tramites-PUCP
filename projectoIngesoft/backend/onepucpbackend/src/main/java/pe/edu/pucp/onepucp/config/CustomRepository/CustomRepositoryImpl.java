package pe.edu.pucp.onepucp.config.CustomRepository;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class CustomRepositoryImpl <T> implements CustomRepository<T>{
    @PersistenceContext
    private EntityManager entityManager;
    private final Class<T> domainClass;

    public CustomRepositoryImpl(Class<T> domainClass) {
        this.domainClass = domainClass;
    }
    @Override
    public List<T> findAllDescendentePorId() {
        // Consulta JPQL para ordenar por ID en forma descendente
        String jpql = "SELECT e FROM " + domainClass.getName() + " e ORDER BY e.id DESC";
        TypedQuery<T> query = entityManager.createQuery(jpql, domainClass);
        return query.getResultList();
    }
}
