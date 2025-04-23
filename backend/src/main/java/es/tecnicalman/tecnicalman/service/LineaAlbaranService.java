package es.tecnicalman.tecnicalman.service;

import es.tecnicalman.tecnicalman.model.LineaAlbaran;
import es.tecnicalman.tecnicalman.repository.LineaAlbaranRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LineaAlbaranService {
    private final LineaAlbaranRepository lineaAlbaranRepository;

    public List<LineaAlbaran> findAll() {
        return lineaAlbaranRepository.findAll();
    }

    public Optional<LineaAlbaran> findById(Long id) {
        return lineaAlbaranRepository.findById(id);
    }

    public LineaAlbaran save(LineaAlbaran lineaAlbaran) {
        return lineaAlbaranRepository.save(lineaAlbaran);
    }

    public LineaAlbaran update(Long id, LineaAlbaran lineaAlbaran) {
        lineaAlbaran.setId(id); // Asegura que el ID es correcto
        return lineaAlbaranRepository.save(lineaAlbaran);
    }

    public void deleteById(Long id) {
        lineaAlbaranRepository.deleteById(id);
    }
}