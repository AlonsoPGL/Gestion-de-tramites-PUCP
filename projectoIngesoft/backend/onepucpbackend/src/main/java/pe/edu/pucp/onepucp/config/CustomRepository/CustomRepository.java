package pe.edu.pucp.onepucp.config.CustomRepository;

import java.util.List;

public interface CustomRepository<T> {
    List<T>findAllDescendentePorId();
}
