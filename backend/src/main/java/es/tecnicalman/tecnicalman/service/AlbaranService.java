package es.tecnicalman.tecnicalman.service;

import es.tecnicalman.tecnicalman.model.Albaran;
import es.tecnicalman.tecnicalman.repository.AlbaranRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AlbaranService {
    private final AlbaranRepository AlbaranRepository;

    public List<Albaran> findAll() {
        return AlbaranRepository.findAll();
    }

    public Optional<Albaran> findById(Long id) {
        return AlbaranRepository.findById(id);
    }

    public Albaran save(Albaran Albaran) {
        return AlbaranRepository.save(Albaran);
    }

    public Albaran update(Long id, Albaran Albaran) {
        Albaran.setId(id); // Asegura que el ID es correcto
        return AlbaranRepository.save(Albaran);
    }

    public void deleteById(Long id) {
        AlbaranRepository.deleteById(id);
    }
}