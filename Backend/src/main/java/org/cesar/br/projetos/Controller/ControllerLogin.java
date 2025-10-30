package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.DTO.UsuarioDTO;
import org.cesar.br.projetos.Mediator.UsuarioMediator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class ControllerLogin {

    private final UsuarioMediator mediator = UsuarioMediator.getInstancia();

    // Endpoint de registro
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            mediator.registrarUsuario(
                    usuarioDTO.getUsername(),
                    usuarioDTO.getEmail(),
                    usuarioDTO.getPassword(),
                    java.time.LocalDate.now() // Adicionado para evitar erro no Mediator
            );
            return ResponseEntity.ok(Map.of("message", "Usuário registrado com sucesso!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint de login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioDTO usuarioDTO) {
        boolean ok = mediator.autenticarSenha(usuarioDTO.getUsername(), usuarioDTO.getPassword());
        if (ok) {
            return ResponseEntity.ok(Map.of("message", "Login bem-sucedido!"));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Usuário ou senha inválidos!"));
        }
    }
    
    @GetMapping("/teste")
    public String teste() {
        return "Backend funcionando!";
    }
    
}
