package es.tecnicalman.tecnicalman.service;

import es.tecnicalman.tecnicalman.model.LineaPresupuesto;
import es.tecnicalman.tecnicalman.repository.LineaPresupuestoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LineaPresupuestoService {
    private final LineaPresupuestoRepository lineaPresupuestoRepository;

    public List<LineaPresupuesto> findAll() {
        return lineaPresupuestoRepository.findAll();
    }

    public Optional<LineaPresupuesto> findById(Long id) {
        return lineaPresupuestoRepository.findById(id);
    }

    public LineaPresupuesto save(LineaPresupuesto lineaPresupuesto) {
        return lineaPresupuestoRepository.save(lineaPresupuesto);
    }

    public LineaPresupuesto update(Long id, LineaPresupuesto lineaPresupuesto) {
        lineaPresupuesto.setId(id); // Asegura que el ID es correcto
        return lineaPresupuestoRepository.save(lineaPresupuesto);
    }

    public void deleteById(Long id) {
        lineaPresupuestoRepository.deleteById(id);
    }
}