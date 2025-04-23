package es.tecnicalman.tecnicalman.controller;

import es.tecnicalman.tecnicalman.model.LineaFactura;
import es.tecnicalman.tecnicalman.service.LineaFacturaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lineas-factura")
@RequiredArgsConstructor
public class LineaFacturaController {
    private final LineaFacturaService lineaFacturaService;

    @GetMapping
    public ResponseEntity<List<LineaFactura>> getAllLineasFactura() {
        return ResponseEntity.ok(lineaFacturaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LineaFactura> getLineaFacturaById(@PathVariable Long id) {
        return lineaFacturaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LineaFactura> createLineaFactura(@RequestBody LineaFactura lineaFactura) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lineaFacturaService.save(lineaFactura));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LineaFactura> updateLineaFactura(@PathVariable Long id,
            @RequestBody LineaFactura lineaFactura) {
        return ResponseEntity.ok(lineaFacturaService.update(id, lineaFactura));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLineaFactura(@PathVariable Long id) {
        lineaFacturaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}