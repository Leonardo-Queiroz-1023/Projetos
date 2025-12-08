package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.Entidades.Usuario;
import org.cesar.br.projetos.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class ControllerLogin {

    private final UsuarioService usuarioService;

    @Autowired
    public ControllerLogin(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            boolean sucesso = usuarioService.registrarUsuario(
                    usuario.getNome(),
                    usuario.getEmail(),
                    usuario.getSenhaHash(),
                    false
            );

            if (sucesso) {
                return ResponseEntity.ok(Map.of(
                        "message", "Usuário registrado com sucesso!"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Usuário já existe ou dados inválidos!"
                ));
            }

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        String email = usuario.getEmail();
        String senhaEmTexto = usuario.getSenhaHash();

        Usuario usuarioAutenticado = usuarioService.buscarPorEmail(email);

        if (usuarioAutenticado != null &&
                usuarioService.autenticarUsuario(email, senhaEmTexto)) {
            return ResponseEntity.ok(Map.of(
                    "message", "Login bem-sucedido!",
                    "usuarioId", usuarioAutenticado.getId(),
                    "nome", usuarioAutenticado.getNome(),
                    "email", usuarioAutenticado.getEmail()
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Usuário ou senha inválidos!"
            ));
        }
    }
}
