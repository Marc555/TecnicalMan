package es.tecnicalman.tecnicalman.model;

import java.sql.Timestamp;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Factura {
    public enum EstadoFactura {
        BORRADOR, ACEPTADO, RECHAZADO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long idCliente;
    private String titulo;
    private String condiciones;
    private Timestamp fechaEmitida;
    private Timestamp fechaValidez;

    @Enumerated(EnumType.STRING)
    private EstadoFactura estado;

}