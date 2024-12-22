package pe.edu.pucp.onepucp.institucion.test;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import pe.edu.pucp.onepucp.institucion.model.Departamento;
import pe.edu.pucp.onepucp.institucion.model.TipoUnidad;
import pe.edu.pucp.onepucp.institucion.repository.DepartamentoRepository;
import pe.edu.pucp.onepucp.OnepucpbackendApplication;

import java.util.ArrayList;
import java.util.List;

public class DepartamentoTest {

    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext(OnepucpbackendApplication.class);
        DepartamentoRepository departamentoRepository = context.getBean(DepartamentoRepository.class);
        PlatformTransactionManager transactionManager = context.getBean(PlatformTransactionManager.class);

        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);

        transactionTemplate.execute(new TransactionCallback<Void>() {
            @Override
            public Void doInTransaction(TransactionStatus status) {
                try {
                    List<Departamento> departamentos = new ArrayList<>();

                    for (int i = 1; i <= 10; i++) {
                        Departamento depto = new Departamento();
                        depto.setCodigo("DEP" + String.format("%03d", i));
                        depto.setNombre("Departamento de Prueba " + i);
                        depto.setTelefonoContacto("123-456-" + String.format("%03d", i));
                        depto.setCorreoContacto("dep" + i + "@pucp.edu.pe");
                        depto.setDireccionWeb("www.pucp.edu.pe/dep" + i);
                        depto.setActivo(i % 2 == 0); // Alternamos entre activo e inactivo
                        depto.setTipo(TipoUnidad.DEPARTAMENTO);

                        departamentos.add(depto);
                    }

                    departamentoRepository.saveAll(departamentos);

                    System.out.println("Departamentos insertados:");
                    for (Departamento depto : departamentos) {
                        System.out.println("ID: " + depto.getId() + 
                                           ", Código: " + depto.getCodigo() + 
                                           ", Nombre: " + depto.getNombre() + 
                                           ", Activo: " + depto.isActivo());
                    }

                    long count = departamentoRepository.count();
                    System.out.println("Total de departamentos en la base de datos: " + count);

                } catch (Exception e) {
                    e.printStackTrace();
                    status.setRollbackOnly();
                }
                return null;
            }
        });

        ((AnnotationConfigApplicationContext) context).close();
    }
}