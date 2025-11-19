package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.Entidades.Usuario;
import org.cesar.br.projetos.Mediator.UsuarioMediator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class ControllerLogin {

    private final UsuarioMediator mediator = UsuarioMediator.getInstancia();

    // -------------------------------
    // REGISTRO DE USUÁRIO
    // -------------------------------
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            mediator.registrarUsuario(
                    usuario.getNome(),
                    usuario.getEmail(),
                    usuario.getSenha(),
                    java.time.LocalDate.now()
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Usuário registrado com sucesso!"
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // -------------------------------
    // LOGIN
    // -------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        boolean ok = mediator.autenticarSenha(
                usuario.getNome(),
                usuario.getSenha()
        );

        if (ok) {
            return ResponseEntity.ok(Map.of(
                    "message", "Login bem-sucedido!"
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Usuário ou senha inválidos!"
            ));
        }
    }

    // -------------------------------
    // TESTE
    // -------------------------------
    @GetMapping("/teste")
    public String teste() {
        return "Backend funcionando!";
    }
}