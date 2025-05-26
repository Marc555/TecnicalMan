package es.tecnicalman.tecnicalman.utils.pdf;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/presupuestopdf")
@RequiredArgsConstructor
public class PdfPresupuestoController {

    private final PdfPresupuestoService pdfPresupuestoService;

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getPresupuestoPdf(@PathVariable("id") Long id) {
        try {
            byte[] pdfBytes = pdfPresupuestoService.generarPdfPresupuesto(id);
            String fileName = "presupuesto_" + id + ".pdf";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            e.printStackTrace(); // <--- Añade esto para ver el error real aquí también
            return ResponseEntity.notFound().build();
        }
    }
}