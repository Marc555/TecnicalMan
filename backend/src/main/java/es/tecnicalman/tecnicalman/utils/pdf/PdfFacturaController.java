package es.tecnicalman.tecnicalman.utils.pdf;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/facturapdf")
@RequiredArgsConstructor
public class PdfFacturaController {

    private final PdfFacturaService pdfFacturaService;

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getFacturaPdf(@PathVariable("id") Long id) {
        try {
            byte[] pdfBytes = pdfFacturaService.generarPdfFactura(id);
            String fileName = "factura_FAC" + String.format("%04d", id) + ".pdf";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}