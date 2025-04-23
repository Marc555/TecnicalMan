package es.tecnicalman.tecnicalman.repository;

import es.tecnicalman.tecnicalman.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

}
