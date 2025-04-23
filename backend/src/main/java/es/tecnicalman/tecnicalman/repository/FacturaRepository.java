package es.tecnicalman.tecnicalman.repository;

import es.tecnicalman.tecnicalman.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacturaRepository extends JpaRepository<Factura, Long> {

}