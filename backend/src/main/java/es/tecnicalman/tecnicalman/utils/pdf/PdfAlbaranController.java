package es.tecnicalman.tecnicalman.utils.pdf;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/albaranpdf")
@RequiredArgsConstructor
public class PdfAlbaranController {

    private final PdfAlbaranService pdfAlbaranService;

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getAlbaranPdf(@PathVariable("id") Long id) {
        try {
            byte[] pdfBytes = pdfAlbaranService.generarPdfAlbaran(id);
            String fileName = "albaran_" + id + ".pdf";
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