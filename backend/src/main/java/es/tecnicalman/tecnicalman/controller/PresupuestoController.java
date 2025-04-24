package es.tecnicalman.tecnicalman.controller;

import es.tecnicalman.tecnicalman.model.Presupuesto;
import es.tecnicalman.tecnicalman.service.PresupuestoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presupuestos")
@RequiredArgsConstructor
public class PresupuestoController {
    private final PresupuestoService presupuestoService;

    @GetMapping
    public ResponseEntity<List<Presupuesto>> getAllPresupuestos() {
        return ResponseEntity.ok(presupuestoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Presupuesto> getPresupuestoById(@PathVariable Long id) {
        return presupuestoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Presupuesto> createPresupuesto(@RequestBody Presupuesto presupuesto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(presupuestoService.save(presupuesto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Presupuesto> updatePresupuesto(@PathVariable Long id, @RequestBody Presupuesto presupuesto) {
        return ResponseEntity.ok(presupuestoService.update(id, presupuesto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePresupuesto(@PathVariable Long id) {
        presupuestoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}