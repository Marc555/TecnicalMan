package es.tecnicalman.tecnicalman.model;

import java.security.Timestamp;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tarea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descripcion;
    private Timestamp fechaHora;
    private String estado;
    private String direccion;
}