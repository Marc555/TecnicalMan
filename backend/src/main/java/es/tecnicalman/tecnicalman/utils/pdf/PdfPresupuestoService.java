package es.tecnicalman.tecnicalman.utils.pdf;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import es.tecnicalman.tecnicalman.model.Cliente;
import es.tecnicalman.tecnicalman.model.LineaPresupuesto;
import es.tecnicalman.tecnicalman.model.Presupuesto;
import es.tecnicalman.tecnicalman.service.ClienteService;
import es.tecnicalman.tecnicalman.service.LineaPresupuestoService;
import es.tecnicalman.tecnicalman.service.PresupuestoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PdfPresupuestoService {

        private final PresupuestoService presupuestoService;
        private final ClienteService clienteService;
        private final LineaPresupuestoService lineaPresupuestoService;

        public byte[] generarPdfPresupuesto(Long idPresupuesto) throws Exception {
                Optional<Presupuesto> presupuestoOpt = presupuestoService.findById(idPresupuesto);
                if (presupuestoOpt.isEmpty())
                        throw new IllegalArgumentException("Presupuesto no encontrado");

                Presupuesto presupuesto = presupuestoOpt.get();

                // Completar fechas si son null
                LocalDateTime now = LocalDateTime.now();
                if (presupuesto.getFechaEmitida() == null) {
                        presupuesto.setFechaEmitida(Timestamp.valueOf(now));
                }
                if (presupuesto.getFechaValidez() == null) {
                        presupuesto.setFechaValidez(Timestamp.valueOf(now.plus(1, ChronoUnit.MONTHS)));
                }

                presupuestoService.update(presupuesto.getId(), presupuesto);

                Optional<Cliente> clienteOpt = clienteService.findById(presupuesto.getIdCliente());
                if (clienteOpt.isEmpty())
                        throw new IllegalArgumentException("Cliente no encontrado");

                Cliente cliente = clienteOpt.get();

                List<LineaPresupuesto> lineas = lineaPresupuestoService.findAll().stream()
                                .filter(l -> l.getIdPresupuesto().equals(idPresupuesto))
                                .toList();

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                PdfWriter writer = new PdfWriter(baos);
                PdfDocument pdf = new PdfDocument(writer);
                Document doc = new Document(pdf);

                // ---------- CABECERA CON LOGO Y DATOS EMPRESA ----------
                Table headerTable = new Table(UnitValue.createPercentArray(new float[] { 2, 4, 3 }))
                                .useAllAvailableWidth()
                                .setMarginBottom(10);

                // Logo empresa (ajusta el path y tamaño)
                try {
                        InputStream logoStream = getClass().getResourceAsStream("/static/logo-tecnicalman.png");
                        if (logoStream != null) {
                                byte[] logoBytes = logoStream.readAllBytes();
                                Image logo = new Image(ImageDataFactory.create(logoBytes));
                                logo.setWidth(120);
                                logo.setHeight(60);
                                headerTable.addCell(new Cell(3, 1).add(logo).setBorder(Border.NO_BORDER));
                        } else {
                                headerTable.addCell(new Cell(3, 1).add(new Paragraph("TECNICALMAN"))
                                                .setBorder(Border.NO_BORDER));
                        }
                } catch (Exception e) {
                        headerTable.addCell(
                                        new Cell(3, 1).add(new Paragraph("TECNICALMAN")).setBorder(Border.NO_BORDER));
                }

                // Datos empresa
                Cell cellEmpresa = new Cell()
                                .add(new Paragraph("Pablo Calle Hurtado").setBold())
                                .add(new Paragraph("NIF: 48140404Y"))
                                .add(new Paragraph("C/Amilcar, 38 bis 08041 Barcelona"))
                                .add(new Paragraph("Barcelona (España)"))
                                .add(new Paragraph("Teléfono: 936633059 Móvil: 617550128"))
                                .add(new Paragraph("cgt@tecnicalman.es - www.tecnicalman.es"))
                                .setBorder(Border.NO_BORDER)
                                .setFontSize(9);
                headerTable.addCell(cellEmpresa);

                // Presupuesto info (número, título)
                String idFormatted = String.format("PPTO%04d", presupuesto.getId());
                Cell cellPresupuesto = new Cell()
                                .add(new Paragraph("PRESUPUESTO " + idFormatted)
                                                .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                                                .setFontSize(16)
                                                .setTextAlignment(TextAlignment.RIGHT))
                                .setBorder(Border.NO_BORDER)
                                .setVerticalAlignment(VerticalAlignment.TOP);
                headerTable.addCell(cellPresupuesto);

                doc.add(headerTable);

                // ---------- DATOS CLIENTE Y FECHAS ----------
                Table infoTable = new Table(UnitValue.createPercentArray(new float[] { 3, 2, 2, 2 }))
                                .useAllAvailableWidth()
                                .setFontSize(9)
                                .setMarginBottom(8);

                // Datos cliente
                Cell datosCliente = new Cell(4, 1)
                                .add(new Paragraph("DATOS CLIENTE").setBold())
                                .add(new Paragraph(cliente.getNombre()))
                                .add(new Paragraph(cliente.getDireccion()))
                                .add(new Paragraph(cliente.getCiudad() + ", " + cliente.getProvincia()))
                                .add(new Paragraph(cliente.getEmail()))
                                .setBorder(Border.NO_BORDER)
                                .setFontSize(9)
                                .setTextAlignment(TextAlignment.LEFT);
                infoTable.addCell(datosCliente);

                // Fechas y DNI
                SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                infoTable.addCell(celdaLabelDato("FECHA DE EMISION", sdf.format(presupuesto.getFechaEmitida())));
                infoTable.addCell(celdaLabelDato("VENCIMIENTO", sdf.format(presupuesto.getFechaValidez())));
                infoTable.addCell(celdaLabelDato("CIF/DNI", cliente.getNif()));

                // Celdas vacías para rellenar la fila
                infoTable.addCell(new Cell().setBorder(Border.NO_BORDER));
                infoTable.addCell(new Cell().setBorder(Border.NO_BORDER));
                infoTable.addCell(new Cell().setBorder(Border.NO_BORDER));

                doc.add(infoTable);

                // ---------- TABLA DE LINEAS ----------
                Table tablaLineas = new Table(UnitValue.createPercentArray(new float[] { 5, 1, 2, 2 }))
                                .useAllAvailableWidth()
                                .setFontSize(10);

                tablaLineas.addHeaderCell(celdaHeader("COD / DESCRIPCION"));
                tablaLineas.addHeaderCell(celdaHeader("CANTIDAD"));
                tablaLineas.addHeaderCell(celdaHeader("PRECIO"));
                tablaLineas.addHeaderCell(celdaHeader("SUBTOTAL"));

                double baseImponible = 0;
                for (LineaPresupuesto linea : lineas) {
                        double subtotal = linea.getCantidad() * linea.getPrecioUnitario();
                        baseImponible += subtotal;
                        tablaLineas.addCell(celdaDato(linea.getDescripcion()));
                        tablaLineas.addCell(celdaDato(String.valueOf(linea.getCantidad())));
                        tablaLineas.addCell(celdaDato(String.format("%.2f €", linea.getPrecioUnitario())));
                        tablaLineas.addCell(celdaDato(String.format("%.2f €", subtotal)));
                }
                doc.add(tablaLineas);

                // ---------- CONDICIONES ----------
                doc.add(new Paragraph("CONDICIONES")
                                .setFontSize(11)
                                .setBold()
                                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                                .setMarginTop(6)
                                .setMarginBottom(3));
                doc.add(new Paragraph(presupuesto.getCondiciones() != null ? presupuesto.getCondiciones() : "-")
                                .setFontSize(9)
                                .setMarginBottom(10));

                // ---------- RESUMEN IMPUESTOS Y TOTAL ----------
                double ivaPorcentaje = 21.0;
                double baseImpuesto = baseImponible;
                double cuotaImpuesto = Math.round((baseImponible * ivaPorcentaje) / 100.0 * 100.0) / 100.0;
                double total = baseImponible + cuotaImpuesto;

                Table resumen = new Table(UnitValue.createPercentArray(new float[] { 2, 2, 2, 2, 2 }))
                                .useAllAvailableWidth()
                                .setFontSize(10)
                                .setMarginBottom(8);

                resumen.addCell(celdaHeader("BASE IMPONIBLE"));
                resumen.addCell(celdaHeader("IMPUESTO %"));
                resumen.addCell(celdaHeader("BASE IMPUESTO"));
                resumen.addCell(celdaHeader("CUOTA IMPUESTO"));
                resumen.addCell(celdaHeader("TOTAL"));

                resumen.addCell(celdaDato(String.format("%.2f €", baseImponible)));
                resumen.addCell(celdaDato("IVA " + ivaPorcentaje + " %"));
                resumen.addCell(celdaDato(String.format("%.2f €", baseImpuesto)));
                resumen.addCell(celdaDato(String.format("%.2f €", cuotaImpuesto)));
                resumen.addCell(celdaDato(String.format("%.2f €", total)).setBold().setFontColor(ColorConstants.RED));

                // Forma de pago y cuenta bancaria
                Cell pago = new Cell(1, 5)
                                .add(new Paragraph("FORMA DE PAGO: INGRESO EN CC: ES61 2100 0388 1902 0030 9756")
                                                .setFontSize(10)
                                                .setBold());
                resumen.addCell(pago);

                doc.add(resumen);

                // ---------- PIE DE SERVICIOS Y AVISO ----------
                doc.add(new Paragraph("SERVICIOS:")
                                .setFontSize(12)
                                .setBold()
                                .setMarginTop(8));

                // Aquí podrías añadir una imagen de servicios si tienes
                // Ejemplo:
                // InputStream serviciosStream =
                // getClass().getResourceAsStream("/static/servicios.png");
                // if (serviciosStream != null) {
                // byte[] serviciosBytes = serviciosStream.readAllBytes();
                // Image serviciosImg = new Image(ImageDataFactory.create(serviciosBytes));
                // serviciosImg.setWidth(400);
                // doc.add(serviciosImg);
                // }

                // O añade texto de servicios
                List<String> servicios = List.of(
                                "Antenas TV - SAT Comunitarias e Individuales",
                                "Porteros Electrónicos, Videoporteros",
                                "Videovigilancia CCTV AHD - IP",
                                "Redes Informáticas, Reparación PC, Configuración Redes, Wifi, Programación");
                for (String s : servicios) {
                        doc.add(new Paragraph("• " + s).setFontSize(9));
                }

                // Aviso transferencia
                doc.add(new Paragraph("TRANSFERENCIA BANCARIA INDICAR EN CONCEPTO Nº FACTURA")
                                .setFontColor(ColorConstants.RED)
                                .setFontSize(10)
                                .setBold()
                                .setTextAlignment(TextAlignment.CENTER)
                                .setMarginTop(8));

                // Aviso legal (puedes personalizar el texto)
                doc.add(new Paragraph(
                                "Este presupuesto tiene una validez de 30 días. Para aceptar el presupuesto, notifíquelo por email o teléfono. La aceptación implica la aceptación de las condiciones generales de venta.")
                                .setFontSize(7)
                                .setTextAlignment(TextAlignment.JUSTIFIED)
                                .setMarginTop(5));

                doc.close();
                return baos.toByteArray();
        }

        // Helpers para celdas con estilos
        private Cell celdaHeader(String texto) {
                return new Cell()
                                .add(new Paragraph(texto))
                                .setBold()
                                .setBackgroundColor(ColorConstants.BLACK)
                                .setFontColor(ColorConstants.WHITE)
                                .setTextAlignment(TextAlignment.CENTER);
        }

        private Cell celdaDato(String texto) {
                return new Cell()
                                .add(new Paragraph(texto != null ? texto : ""))
                                .setTextAlignment(TextAlignment.CENTER);
        }

        private Cell celdaLabelDato(String label, String dato) {
                return new Cell()
                                .add(new Paragraph(label).setBold().setFontSize(8))
                                .add(new Paragraph(dato).setFontSize(9));
        }
}