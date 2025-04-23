package es.tecnicalman.tecnicalman.repository;

import es.tecnicalman.tecnicalman.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TareaRepository extends JpaRepository<Tarea, Long> {

}