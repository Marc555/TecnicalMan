package es.tecnicalman.tecnicalman.controller;

import es.tecnicalman.tecnicalman.model.Tarea;
import es.tecnicalman.tecnicalman.service.TareaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@RequiredArgsConstructor
public class TareaController {
    private final TareaService tareaService;

    @GetMapping
    public ResponseEntity<List<Tarea>> getAllTareas() {
        return ResponseEntity.ok(tareaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarea> getTareaById(@PathVariable("id") Long id) {
        return tareaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Tarea> createTarea(@Validated @RequestBody Tarea tarea) {
        if (tarea.getFechaHora() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fecha y hora son requeridas");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(tareaService.save(tarea));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarea> updateTarea(@PathVariable("id") Long id, @RequestBody Tarea tarea) {
        return ResponseEntity.ok(tareaService.update(id, tarea));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTarea(@PathVariable("id") Long id) {
        tareaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}