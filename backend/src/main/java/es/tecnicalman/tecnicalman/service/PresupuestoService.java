package es.tecnicalman.tecnicalman.service;

import es.tecnicalman.tecnicalman.model.Presupuesto;
import es.tecnicalman.tecnicalman.repository.PresupuestoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PresupuestoService {
    private final PresupuestoRepository presupuestoRepository;

    public List<Presupuesto> findAll() {
        return presupuestoRepository.findAll();
    }

    public Optional<Presupuesto> findById(Long id) {
        return presupuestoRepository.findById(id);
    }

    public Presupuesto save(Presupuesto presupuesto) {
        return presupuestoRepository.save(presupuesto);
    }

    public Presupuesto update(Long id, Presupuesto presupuesto) {
        presupuesto.setId(id); // Asegura que el ID es correcto
        return presupuestoRepository.save(presupuesto);
    }

    public void deleteById(Long id) {
        presupuestoRepository.deleteById(id);
    }
}