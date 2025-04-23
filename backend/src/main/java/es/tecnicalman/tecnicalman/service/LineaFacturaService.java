package es.tecnicalman.tecnicalman.service;

import es.tecnicalman.tecnicalman.model.LineaFactura;
import es.tecnicalman.tecnicalman.repository.LineaFacturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LineaFacturaService {
    private final LineaFacturaRepository lineaFacturaRepository;

    public List<LineaFactura> findAll() {
        return lineaFacturaRepository.findAll();
    }

    public Optional<LineaFactura> findById(Long id) {
        return lineaFacturaRepository.findById(id);
    }

    public LineaFactura save(LineaFactura lineaFactura) {
        return lineaFacturaRepository.save(lineaFactura);
    }

    public LineaFactura update(Long id, LineaFactura lineaFactura) {
        lineaFactura.setId(id); // Asegura que el ID es correcto
        return lineaFacturaRepository.save(lineaFactura);
    }

    public void deleteById(Long id) {
        lineaFacturaRepository.deleteById(id);
    }
}