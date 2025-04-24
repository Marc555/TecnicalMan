package es.tecnicalman.tecnicalman.controller;

import es.tecnicalman.tecnicalman.model.Albaran;
import es.tecnicalman.tecnicalman.service.AlbaranService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/albarans")
@RequiredArgsConstructor
public class AlbaranController {
    private final AlbaranService albaranService;

    @GetMapping
    public ResponseEntity<List<Albaran>> getAllAlbarans() {
        return ResponseEntity.ok(albaranService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Albaran> getAlbaranById(@PathVariable Long id) {
        return albaranService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Albaran> createAlbaran(@RequestBody Albaran albaran) {
        return ResponseEntity.status(HttpStatus.CREATED).body(albaranService.save(albaran));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Albaran> updateAlbaran(@PathVariable Long id, @RequestBody Albaran albaran) {
        return ResponseEntity.ok(albaranService.update(id, albaran));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbaran(@PathVariable Long id) {
        albaranService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}