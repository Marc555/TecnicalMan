package es.tecnicalman.tecnicalman.service;

import es.tecnicalman.tecnicalman.model.Factura;
import es.tecnicalman.tecnicalman.repository.FacturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FacturaService {
    private final FacturaRepository FacturaRepository;

    public List<Factura> findAll() {
        return FacturaRepository.findAll();
    }

    public Optional<Factura> findById(Long id) {
        return FacturaRepository.findById(id);
    }

    public Factura save(Factura Factura) {
        return FacturaRepository.save(Factura);
    }

    public Factura update(Long id, Factura Factura) {
        Factura.setId(id); // Asegura que el ID es correcto
        return FacturaRepository.save(Factura);
    }

    public void deleteById(Long id) {
        FacturaRepository.deleteById(id);
    }
}