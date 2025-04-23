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

        String email = jwtUtil.extractEmail(token); // Obtienes el correo del token
        if (email != null && jwtUtil.validateToken(token, email)) {
            return ResponseEntity.ok().body("Token válido");
        }
        return ResponseEntity.status(401).body("Token inválido o expirado");
    }
}