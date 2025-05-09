package es.tecnicalman.tecnicalman.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Tarea {
    public enum EstadoTarea {
        PENDIENTE, EN_PROGRESO, COMPLETADA, CANCELADA
    }

    public enum Encargado {
        JAIME, PABLO, AMBOS
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descripcion;
    private Encargado encargado;
    private String direccion;
    private EstadoTarea estado;

    @Column(columnDefinition = "TIMESTAMP")
    private Instant fechaHora; // Usar Instant para mejor manejo de fechas

}