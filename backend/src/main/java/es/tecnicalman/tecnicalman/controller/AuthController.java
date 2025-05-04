package es.tecnicalman.tecnicalman.controller;

import es.tecnicalman.tecnicalman.model.User;
import es.tecnicalman.tecnicalman.security.JwtUtil;
import es.tecnicalman.tecnicalman.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        User user = userService.getUserByEmail(email);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Credenciales incorrectas"));
        }

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        String email = jwtUtil.extractEmail(token);
        if (email != null && jwtUtil.validateToken(token, email)) {
            return ResponseEntity.ok().body("Token válido");
        }
        return ResponseEntity.status(401).body("Token inválido o expirado");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        String email = jwtUtil.extractEmail(token);
        if (email == null || !jwtUtil.validateToken(token, email)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado");
        }

        User user = userService.getUserByEmail(email);
        user.setPassword(passwordEncoder.encode(newPassword));
        userService.saveUser(user);

        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada con éxito"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        User user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "El usuario no existe"));
        }

        String token = jwtUtil.generateToken(email);
        String resetPasswordLink = "http://localhost:5173/reset-password?token=" + token;
        String subject = "Restablecimiento de Contraseña";
        String body = "Hola, " + user.getName() + ".\n\n" +
                   "Hemos recibido una solicitud para restablecer tu contraseña. " +
                   "Por favor haz clic en el siguiente enlace para restablecer tu contraseña:\n\n" +
                   "<a href=\"" + resetPasswordLink + "\">pulse aquí</a>\n\n" +
                   "Si no solicitaste este cambio, ignora este mensaje.";

        try {
            userService.sendEmail(email, subject, body);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al enviar el correo"));
        }

        return ResponseEntity.ok(Map.of("message", "Correo de recuperación enviado con éxito"));
    }
}