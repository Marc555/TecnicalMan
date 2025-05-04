package es.tecnicalman.tecnicalman.model;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @CreationTimestamp
    private Timestamp fechaCreacion;

    private String nombre;
    private String nif;
    private String direccion;
    private String ciudad;
    private String codigoPostal;
    private String provincia;
    private String pais;
    private String email;
    private String telefono;

}