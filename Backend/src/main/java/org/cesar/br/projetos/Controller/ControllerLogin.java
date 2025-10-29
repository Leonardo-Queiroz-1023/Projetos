package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.Mediator.UsuarioMediator;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class ControllerLogin {
	
	private final UsuarioMediator mediator = UsuarioMediator.getInstancia();

    @PostMapping("/register")
    public String registrar(@RequestParam String nome, @RequestParam String email , @RequestParam String senha) {
    	
        mediator.registrarUsuario(nome, email ,senha, null);
        return "Usuário registrado com sucesso!";
    }

    @PostMapping("/login")
    public String login(@RequestParam String nome, @RequestParam String senha) {
        boolean ok = mediator.autenticar(nome, senha);
        return ok ? "Login bem-sucedido!" : "Usuário ou senha inválidos!";
    }
	
}