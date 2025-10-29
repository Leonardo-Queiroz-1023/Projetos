package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.Mediator.UsuarioMediator;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class ControllerLogin {
	
	private final UsuarioMediator mediator = UsuarioMediator.getInstancia();

    @PostMapping("/register")
    public String registrar(@RequestParam String username, @RequestParam String email , @RequestParam String password) {
    	
        mediator.registrarUsuario(username, email ,password, null);
        return "Usuário registrado com sucesso!";
    }

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        boolean ok = mediator.autenticar(username, password);
        return ok ? "Login bem-sucedido!" : "Usuário ou senha inválidos!";
    }
	
}
