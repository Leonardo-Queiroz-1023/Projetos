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

    // -------------------------------
    // REGISTRO DE USUÁRIO
    // -------------------------------
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            boolean sucesso = usuarioService.registrarUsuario(
                    usuario.getNome(),
                    usuario.getEmail(),
                    usuario.getSenha(),
                    java.time.LocalDate.now()
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

    // -------------------------------
    // LOGIN
    // -------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        Usuario usuarioAutenticado = usuarioService.buscarUsuario(usuario.getNome());
        
        if (usuarioAutenticado != null && 
            usuarioService.autenticarUsuario(usuario.getNome(), usuario.getSenha())) {
            return ResponseEntity.ok(Map.of(
                    "message", "Login bem-sucedido!",
                    "usuarioId", usuarioAutenticado.getId()
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Usuário ou senha inválidos!"
            ));
        }
    }

}
