package es.tecnicalman.tecnicalman.utils.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import es.tecnicalman.tecnicalman.utils.exceptions.EmailSendingException;

@Service
@RequiredArgsConstructor
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String content) {
        logger.debug("Intentando enviar un correo a: {}, Asunto: {}", to, subject);
        try {
            if (!isValidEmail(to)) {
                throw new IllegalArgumentException("Invalid email address: " + to);
            }
    
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
    
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // true habilita HTML en el correo
    
            mailSender.send(message);
            logger.info("Correo enviado exitosamente a {}", to);
        } catch (MessagingException e) {
            logger.error("Error al enviar el correo a {}: {}", to, e.getMessage());
            throw new EmailSendingException("Error al enviar el correo", e);
        }
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email != null && email.matches(emailRegex);
    }
}