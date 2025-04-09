package es.tecnicalman.tecnicalman.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtil {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "123456"; // Cambia esto por la contraseña que quieres cifrar
        String hashedPassword = encoder.encode(rawPassword);

        System.out.println("Contraseña cifrada: " + hashedPassword);
    }
}