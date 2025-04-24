package es.tecnicalman.tecnicalman.controller;

import es.tecnicalman.tecnicalman.model.LineaAlbaran;
import es.tecnicalman.tecnicalman.service.LineaAlbaranService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lineas-albaran")
@RequiredArgsConstructor
public class LineaAlbaranController {
    private final LineaAlbaranService lineaAlbaranService;

    @GetMapping
    public ResponseEntity<List<LineaAlbaran>> getAllLineasAlbaran() {
        return ResponseEntity.ok(lineaAlbaranService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LineaAlbaran> getLineaAlbaranById(@PathVariable Long id) {
        return lineaAlbaranService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LineaAlbaran> createLineaAlbaran(@RequestBody LineaAlbaran lineaAlbaran) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lineaAlbaranService.save(lineaAlbaran));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LineaAlbaran> updateLineaAlbaran(@PathVariable Long id,
            @RequestBody LineaAlbaran lineaAlbaran) {
        return ResponseEntity.ok(lineaAlbaranService.update(id, lineaAlbaran));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLineaAlbaran(@PathVariable Long id) {
        lineaAlbaranService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}