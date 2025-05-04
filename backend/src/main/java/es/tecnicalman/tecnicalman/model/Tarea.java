package es.tecnicalman.tecnicalman.model;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
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

    @Enumerated(EnumType.STRING)
    private Encargado encargado;

    @Column(name = "fecha_hora", columnDefinition = "TIMESTAMP")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Timestamp fechaHora;

    @Enumerated(EnumType.STRING)
    private EstadoTarea estado;
    private String direccion;

    @CreationTimestamp
    private Timestamp fechaCreacion;
}