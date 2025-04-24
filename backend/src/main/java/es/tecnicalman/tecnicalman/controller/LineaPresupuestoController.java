package es.tecnicalman.tecnicalman.controller;

import es.tecnicalman.tecnicalman.model.LineaPresupuesto;
import es.tecnicalman.tecnicalman.service.LineaPresupuestoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lineas-presupuesto")
@RequiredArgsConstructor
public class LineaPresupuestoController {
    private final LineaPresupuestoService lineaPresupuestoService;

    @GetMapping
    public ResponseEntity<List<LineaPresupuesto>> getAllLineasPresupuesto() {
        return ResponseEntity.ok(lineaPresupuestoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LineaPresupuesto> getLineaPresupuestoById(@PathVariable Long id) {
        return lineaPresupuestoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LineaPresupuesto> createLineaPresupuesto(@RequestBody LineaPresupuesto lineaPresupuesto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lineaPresupuestoService.save(lineaPresupuesto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LineaPresupuesto> updateLineaPresupuesto(@PathVariable Long id,
            @RequestBody LineaPresupuesto lineaPresupuesto) {
        return ResponseEntity.ok(lineaPresupuestoService.update(id, lineaPresupuesto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLineaPresupuesto(@PathVariable Long id) {
        lineaPresupuestoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}